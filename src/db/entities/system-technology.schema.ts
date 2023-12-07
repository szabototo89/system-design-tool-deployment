import { ActionBuilder, createSQLiteBackedEntity } from "@/entity-framework";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { randomUUID } from "crypto";

export const SystemTechnology = createSQLiteBackedEntity({
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
        .implementation((db) => {
          return db.select().from(table);
        })
        .output(z.array(schema)),
    };
  },

  actions({ schema, table }) {
    return {
      create: new ActionBuilder(
        "create",
        async (tx, value: { name: string; description: string }) => {
          return tx
            .insert(table)
            .values({
              id: randomUUID(),
              name: value.name,
              description: value.description,
            })
            .returning();
        },
        schema,
      ),
    };
  },
});
