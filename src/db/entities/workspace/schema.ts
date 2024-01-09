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
import { createdAtPattern } from "@/db/patterns/created-at-pattern";

export const WorkspaceEntity = createSQLiteBackedEntity({
  table() {
    return sqliteTable("workspace", {
      id: text("id").notNull().primaryKey(),
      name: text("name").notNull(),
      description: text("description").notNull().default(""),
      ...createdAtPattern.forTable(),
    });
  },

  entitySchema(table) {
    return createSelectSchema(table, {
      id: (schema) => schema.id.brand("WorkspaceID"),
    });
  },

  queries({ schema, table, queryBuilder }) {
    return {
      queryAll: queryBuilder
        .implementation((db: BetterSQLite3Database) => {
          return db.select().from(table);
        })
        .output(z.array(schema)),

      queryByID: queryBuilder.implementation(
        (
          db: BetterSQLite3Database,
          entity: Pick<z.infer<typeof schema>, "id">,
        ) => {
          return db.select().from(table).where(eq(table.id, entity.id));
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
            .returning();
        },
        schema,
      ),
      update: new ActionBuilder(
        "update",
        async (db, entity: Pick<Entity, "id">, value: Omit<Entity, "id">) => {
          return db
            .update(table)
            .set(value)
            .where(eq(table.id, entity.id))
            .returning()
            .get();
        },
        schema,
      ),
    };
  },
});

export const WorkspaceSchema = WorkspaceEntity.schema;
export const WorkspaceIDSchema = WorkspaceSchema.shape.id;

export type Workspace = z.infer<typeof WorkspaceSchema>;
