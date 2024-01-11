import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { getTableConfig, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import { unknown, z } from "zod";
import {
  ActionBuilder,
  EntityQueryConfiguration,
  createSQLiteBackedEntity,
  onDeletionAction,
} from "../../../entity-framework";
import { createdAtPattern } from "../../patterns/created-at-pattern";
import { SystemElement, SystemElementIDSchema } from "../system-element/schema";
import {
  SystemTechnology,
  SystemTechnologyEntity,
  SystemTechnologySchema,
} from "../system-technology/schema";
import { WorkspaceIDSchema } from "../workspace/schema";

export const SystemElementRelationEntity = createSQLiteBackedEntity({
  table() {
    return sqliteTable("system_element_relation", {
      id: text("id").primaryKey(),
      label: text("label"),
      sourceID: text("source_id").notNull(),
      targetID: text("target_id").notNull(),
      workspaceID: text("workspace_id"),
      ...createdAtPattern.forTable(),
    });
  },

  entitySchema(table) {
    const baseSchema = createSelectSchema(table, {
      id: (schema) => schema.id.brand("SystemElementRelation"),
      sourceID: SystemElementIDSchema,
      targetID: SystemElementIDSchema,
      workspaceID: z.nullable(WorkspaceIDSchema),
    });

    return baseSchema.extend({
      technologies: z.array(SystemTechnologyEntity.schema),
    });
  },

  edges({ sourceTable, sourceSchema }) {
    const technologies = createSQLiteBackedEntity({
      table() {
        const { name: sourceName } = getTableConfig(sourceTable);
        const { name: targetName } = getTableConfig(
          SystemTechnologyEntity.table,
        );

        return sqliteTable(`${sourceName}__${targetName}`, {
          systemElementRelationID: text(`${sourceName}_id`),
          systemTechnologyID: text(`${targetName}_id`),
        });
      },
      entitySchema(targetTable) {
        return createSelectSchema(targetTable);
      },
      queries({ table: junctionTable, queryBuilder }) {
        return {
          queryTechnologiesBySystemElementRelationID: queryBuilder
            .implementation(async (db: BetterSQLite3Database, id: string) => {
              const results = await db
                .select()
                .from(junctionTable)
                .leftJoin(
                  SystemTechnologyEntity.table,
                  eq(
                    junctionTable.systemTechnologyID,
                    SystemTechnologyEntity.table.id,
                  ),
                )
                .where(eq(junctionTable.systemElementRelationID, id));

              return results.map((result) => result.system_technology);
            })
            .output(z.array(SystemTechnologyEntity.schema)),
        };
      },
      actions({ table, schema }) {
        return {
          delete: new ActionBuilder(
            "delete",
            (db, technology: Pick<SystemTechnology, "id">) => {
              return db
                .delete(table)
                .where(eq(table.systemTechnologyID, technology.id))
                .returning();
            },
            z.array(schema),
          ),

          update: new ActionBuilder(
            "update",
            async (
              db,
              systemElementRelation: Pick<z.infer<typeof sourceSchema>, "id">,
              technologyNames: readonly string[],
            ) => {
              const technologies = await Promise.all(
                technologyNames.map((technologyName) => {
                  return SystemTechnologyEntity.actions.upsert(db, {
                    name: technologyName,
                    description: "",
                  });
                }),
              );

              await db
                .delete(table)
                .where(
                  eq(table.systemElementRelationID, systemElementRelation.id),
                );

              if (technologies.length === 0) {
                return [];
              }

              return db
                .insert(table)
                .values(
                  technologies.map((technology) => {
                    return {
                      systemTechnologyID: technology.id,
                      systemElementRelationID: systemElementRelation.id,
                    };
                  }),
                )
                .returning();
            },
            z.array(schema),
          ),
        };
      },
    });

    SystemTechnologyEntity.registerActionListener(
      onDeletionAction(SystemTechnologySchema, async (db, systemTechnology) => {
        await technologies.actions.delete(db, systemTechnology);
      }),
    );

    return {
      technologies,
    };
  },

  queries({ table, queryBuilder, schema, edges }) {
    type Entity = z.infer<typeof schema>;

    return {
      queryAll: queryBuilder
        .implementation(async (db: BetterSQLite3Database) => {
          const relations = await db.select().from(table);

          return Promise.all(
            relations.map(async (relation) => {
              const technologies =
                await edges.technologies.queries.queryTechnologiesBySystemElementRelationID(
                  db,
                  relation.id,
                );

              return {
                ...relation,
                technologies,
              };
            }),
          );
        })
        .output(z.array(schema)),
      queryByID: queryBuilder
        .implementation(async (db: BetterSQLite3Database, id: Entity["id"]) => {
          const relation = db
            .select()
            .from(table)
            .where(eq(table.id, id))
            .get();

          if (relation == null) {
            return null;
          }

          const technologies =
            await edges.technologies.queries.queryTechnologiesBySystemElementRelationID(
              db,
              relation.id,
            );

          return {
            ...relation,
            technologies,
          };
        })
        .output(schema),
      queryFromSystemElementSource: queryBuilder
        .implementation(
          (
            db: BetterSQLite3Database,
            systemElement: Pick<SystemElement, "id">,
          ) => {
            return db
              .select()
              .from(table)
              .where(eq(table.sourceID, systemElement.id));
          },
        )
        .output(z.array(schema.omit({ technologies: true }))),

      queryFromSystemElementTarget: queryBuilder
        .implementation(
          (
            db: BetterSQLite3Database,
            systemElement: Pick<SystemElement, "id">,
          ) => {
            return db
              .select()
              .from(table)
              .where(eq(table.targetID, systemElement.id));
          },
        )
        .output(z.array(schema.omit({ technologies: true }))),
    };
  },

  actions({ schema, table, edges }) {
    type Entity = z.infer<typeof schema>;

    return {
      create: new ActionBuilder(
        "create",
        async (
          db,
          params: Omit<Entity, "id" | "createdAt" | "technologies">,
        ) => {
          return db
            .insert(table)
            .values({
              id: randomUUID(),
              sourceID: params.sourceID,
              targetID: params.targetID,
              label: params.label,
            })
            .returning()
            .get();
        },
        schema.omit({ technologies: true }),
      ),
      update: new ActionBuilder(
        "update",
        async (
          db,
          options: {
            entity: Pick<Entity, "id">;
            params: Pick<Entity, "label"> & { technologies: readonly string[] };
          },
        ) => {
          await edges.technologies.actions.update(
            db,
            options.entity,
            options.params.technologies,
          );

          return db
            .update(table)
            .set({
              label: options.params.label,
            })
            .where(eq(table.id, options.entity.id))
            .returning()
            .get();
        },
        schema.omit({ technologies: true }),
      ),
      delete: new ActionBuilder(
        "delete",
        async (db, entity: Pick<Entity, "id">) => {
          return db
            .delete(table)
            .where(eq(table.id, entity.id))
            .returning()
            .get();
        },
        schema.omit({ technologies: true }),
      ),
    };
  },
});

export const SystemElementRelationSchema = SystemElementRelationEntity.schema;
export const SystemElementRelationIDSchema =
  SystemElementRelationSchema.shape.id;

export type SystemElementRelation = z.infer<
  (typeof SystemElementRelationEntity)["schema"]
>;
