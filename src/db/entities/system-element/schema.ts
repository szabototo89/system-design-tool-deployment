import {
  ActionBuilder,
  createSQLiteBackedEntity,
} from "../../../entity-framework";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAtPattern } from "../../patterns/created-at-pattern";
import { createSelectSchema } from "drizzle-zod";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { z } from "zod";
import { randomUUID } from "crypto";
import { eq, InferInsertModel } from "drizzle-orm";
import {
  SystemTechnology,
  SystemTechnologyEntity,
  SystemTechnologyIDSchema,
} from "../system-technology/schema";

export const SystemElementEntity = createSQLiteBackedEntity({
  table() {
    return sqliteTable("system_element", {
      id: text("id").primaryKey(),
      name: text("name"),
      type: text("type"),
      description: text("description"),
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
      type: z.enum(["system", "container", "component", "person"] as const),
      name: z.string().min(1, "System element name cannot be empty"),
    });
  },

  queries({ table, queryBuilder, schema, edges }) {
    return {
      queryAll: queryBuilder
        .implementation((db: BetterSQLite3Database) => db.select().from(table))
        .output(z.array(schema)),

      queryById: queryBuilder
        .implementation(
          (
            db: BetterSQLite3Database,
            { id }: Pick<z.infer<typeof schema>, "id">,
          ) => db.select().from(table).where(eq(table.id, id)).get(),
        )
        .output(z.nullable(schema)),

      querySystemTechnologies: queryBuilder
        .implementation(
          async (
            db: BetterSQLite3Database,
            entity: Pick<z.infer<typeof schema>, "id">,
          ) => {
            const attachedTechnologies = await db
              .select()
              .from(edges.system_technology)
              .where(eq(edges.system_technology.systemElementID, entity.id));

            return attachedTechnologies
              .map(({ systemTechnologyID }) =>
                SystemTechnologyIDSchema.parse(systemTechnologyID),
              )
              .map((id) => {
                return SystemTechnologyEntity.queries.queryByID(db, {
                  id,
                });
              });
          },
        )
        .output(z.array(SystemTechnologyEntity.schema)),
    };
  },

  actions({ schema, table, edges }) {
    type Entity = z.infer<typeof schema>;

    return {
      create: new ActionBuilder(
        "create",
        async (db, value: Omit<Entity, "id">) => {
          return db
            .insert(table)
            .values({
              ...value,
              id: randomUUID(),
            })
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
            entity: Pick<Entity, "id">; // TODO: Fix it
            value: Omit<Entity, "id" | "createdAt"> & {
              technologies: Pick<SystemTechnology, "name">[];
            };
          },
        ) => {
          if (options.value.technologies != null) {
            const technologies = await Promise.all(
              options.value.technologies.map((technology) =>
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
            .set(options.value)
            .where(eq(table.id, options.entity.id))
            .returning()
            .get();
        },
        schema,
      ),

      delete: new ActionBuilder(
        "delete",
        async (
          db,
          entity: { id: string }, // TODO: Fix it
        ) => {
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
