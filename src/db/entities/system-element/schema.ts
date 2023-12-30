import {
  ActionBuilder,
  createSQLiteBackedEntity,
} from "../../../entity-framework";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createdAtPattern } from "../../patterns/created-at-pattern";
import { createSelectSchema } from "drizzle-zod";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { z } from "zod";
import { randomUUID } from "crypto";
import { eq, inArray, InferSelectModel } from "drizzle-orm";
import {
  SystemTechnology,
  SystemTechnologyEntity,
  SystemTechnologySchema,
} from "../system-technology/schema";

export const SystemElementEntity = createSQLiteBackedEntity({
  table() {
    return sqliteTable("system_element", {
      id: text("id").primaryKey(),
      name: text("name"),
      type: text("type"),
      description: text("description"),
      parentID: text("parent_id"),
      isExternal: integer("is_external").default(0).notNull(),
      ...createdAtPattern.forTable(),
    });
  },

  edges() {
    return {
      system_technology: sqliteTable("system_element__system_technology", {
        systemElementID: text("system_element_id").notNull(),
        systemTechnologyID: text("system_technology_id").notNull(),
      }),
    };
  },

  entitySchema(table) {
    return createSelectSchema(table, {
      id: (schema) => schema.id.brand("SystemElementID"),
      parentID: (schema) => schema.id.brand("SystemElementID"),
      type: z.enum(["system", "container", "component", "person"] as const),
      name: z.string().trim().min(1, "System element name cannot be empty"),
      isExternal: (schema) =>
        schema.isExternal.transform((value) => (value === 1 ? true : false)),
    });
  },

  queries({ table, queryBuilder, schema, edges }) {
    type Entity = z.infer<typeof schema>;
    const queryTechnologiesGroupedByElementID = async (
      db: BetterSQLite3Database,
      entities: Array<InferSelectModel<typeof table>>,
    ) => {
      const technologies = await db
        .select()
        .from(SystemTechnologyEntity.table)
        .rightJoin(
          edges.system_technology,
          eq(
            SystemTechnologyEntity.table.id,
            edges.system_technology.systemTechnologyID,
          ),
        )
        .where(
          inArray(
            edges.system_technology.systemElementID,
            entities.map((entity) => entity.id),
          ),
        );

      return technologies.reduce((previous, current) => {
        const systemElementID = schema.shape.id.parse(
          current.system_element__system_technology.systemElementID,
        );

        const previousValue = previous.get(systemElementID);

        if (previousValue == null) {
          previous.set(systemElementID, [current]);
        } else {
          previous.set(systemElementID, previousValue.concat(current));
        }

        return previous;
      }, new Map<Entity["id"], typeof technologies>());
    };

    const queryEntityWithTechnologies = async (
      db: BetterSQLite3Database,
      elements: InferSelectModel<typeof table>[],
    ) => {
      const technologies = await queryTechnologiesGroupedByElementID(
        db,
        elements,
      );

      return elements.map((element) => {
        const elementID = schema.shape.id.parse(element.id);

        return {
          ...element,
          technologies:
            technologies
              .get(elementID)
              ?.map((technology) => technology.system_technology) ?? [],
        };
      });
    };

    return {
      queryAll: queryBuilder
        .implementation(async (db: BetterSQLite3Database) => {
          return queryEntityWithTechnologies(db, await db.select().from(table));
        })
        .output(
          z.array(
            schema.extend({
              technologies: z.array(SystemTechnologySchema),
            }),
          ),
        ),

      queryById: queryBuilder
        .implementation(
          async (
            db: BetterSQLite3Database,
            { id }: Pick<z.infer<typeof schema>, "id">,
          ) => {
            const [result] = await queryEntityWithTechnologies(
              db,
              await db.select().from(table).where(eq(table.id, id)),
            );

            const children = db
              .select({ id: table.id })
              .from(table)
              .where(eq(table.parentID, id))
              .all()
              .map(({ id }) => id);

            return {
              ...result,
              children,
            };
          },
        )
        .output(
          z.nullable(
            schema.extend({
              technologies: z.array(SystemTechnologySchema),
              children: z.array(schema.shape.id),
            }),
          ),
        ),
    };
  },

  actions({ schema, table, edges }) {
    type Entity = z.infer<typeof schema>;

    return {
      create: new ActionBuilder(
        "create",
        async (
          db,
          value: Omit<Entity, "id" | "createdAt" | "technologies">,
        ) => {
          const { isExternal, ...restValue } = value;

          return db
            .insert(table)
            .values({
              ...restValue,
              isExternal: isExternal ? 1 : 0,
              id: randomUUID(),
            })
            .returning()
            .get();
        },
        schema,
      ),

      updateParent: new ActionBuilder(
        "update",
        async (
          db,
          options: {
            entity: Pick<Entity, "id">;
            parentEntity: Pick<Entity, "id"> | null;
          },
        ) => {
          return db
            .update(table)
            .set({
              parentID: options.parentEntity?.id ?? null,
            })
            .where(eq(table.id, options.entity.id))
            .returning()
            .get();
        },
        schema,
      ),

      update: new ActionBuilder(
        "update",
        async (
          db,
          options: {
            entity: Pick<Entity, "id">;
            value: Omit<Entity, "id" | "createdAt" | "technologies"> & {
              technologies: Pick<SystemTechnology, "name">[];
            };
          },
        ) => {
          const {
            technologies: technologiesValue,
            isExternal,
            ...newValue
          } = options.value;

          const technologies = await Promise.all(
            technologiesValue.map((technology) =>
              SystemTechnologyEntity.actions.upsert(db, {
                name: technology.name,
              }),
            ),
          );

          await db
            .delete(edges.system_technology)
            .where(
              eq(edges.system_technology.systemElementID, options.entity.id),
            );

          if (technologies.length > 0) {
            await db.insert(edges.system_technology).values(
              technologies.map((technology) => {
                return {
                  systemElementID: options.entity.id,
                  systemTechnologyID: technology.id,
                };
              }),
            );
          }

          return db
            .update(table)
            .set({
              ...newValue,
              isExternal: isExternal ? 1 : 0,
            })
            .where(eq(table.id, options.entity.id))
            .returning()
            .get();
        },
        schema,
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
        schema,
      ),
    };
  },
});

export const SystemElementSchema = SystemElementEntity.schema;
export const SystemElementIDSchema = SystemElementSchema.shape.id;

export type SystemElement = z.infer<typeof SystemElementSchema>;
