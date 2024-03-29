import {
  ActionBuilder,
  createSQLiteBackedEntity,
} from "../../../entity-framework";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { randomUUID } from "crypto";
import { eq, sql } from "drizzle-orm";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { DrizzleDatabase } from "@/db/schema";

export const SystemTechnologyEntity = createSQLiteBackedEntity({
  table() {
    return sqliteTable("system_technology", {
      id: text("id").primaryKey(),
      name: text("name").notNull(),
      description: text("description").notNull().default(""),
    });
  },

  entitySchema(table) {
    return createSelectSchema(table, {
      id: (schema) => schema.id.brand("SystemTechnologyID"),
    });
  },

  queries({ schema, table, queryBuilder }) {
    return {
      queryAll: queryBuilder
        .implementation((db: DrizzleDatabase) => {
          return db.select().from(table);
        })
        .output(z.array(schema)),

      queryByID: queryBuilder.implementation(
        (db: DrizzleDatabase, entity: Pick<z.infer<typeof schema>, "id">) => {
          return db.select().from(table).where(eq(table.id, entity.id));
        },
      ),

      queryByName: queryBuilder.implementation(
        (db: DrizzleDatabase, name: string) => {
          return db.select().from(table).where(eq(table.name, name));
        },
      ),
    };
  },

  actions({ schema, table }) {
    type Entity = z.infer<typeof schema>;

    return {
      create: new ActionBuilder(
        "create",
        async (db, value: Pick<Entity, "name" | "description">) => {
          return db
            .insert(table)
            .values({
              id: randomUUID(),
              name: value.name,
              description: value.description,
            })
            .returning()
            .get();
        },
        schema,
      ),
      update: new ActionBuilder(
        "update",
        async (db, value: Entity) => {
          return db
            .update(table)
            .set(value)
            .where(eq(table.id, value.id))
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
      upsert: new ActionBuilder(
        "upsert",
        async (
          db,
          value: Pick<Entity, "name"> & Partial<Pick<Entity, "description">>,
        ) => {
          const systemTechnology = db
            .select()
            .from(table)
            .where(sql`${table.name} = ${value.name} COLLATE NOCASE`)
            .get();

          if (systemTechnology) {
            return systemTechnology;
          }

          return db
            .insert(table)
            .values({
              id: randomUUID(),
              name: value.name,
              description: value.description,
            })
            .returning()
            .get();
        },
        schema,
      ),
    };
  },
});

export const SystemTechnologySchema = SystemTechnologyEntity.schema;
export const SystemTechnologyIDSchema = SystemTechnologySchema.shape.id;

export type SystemTechnology = z.infer<typeof SystemTechnologySchema>;
