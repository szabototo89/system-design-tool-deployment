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
import { SystemElement, SystemElementIDSchema } from "../system-element/schema";
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

  edges({ sourceSchema }) {
    return {
      systemElements: createSQLiteBackedEntity({
        table() {
          return sqliteTable("workspace__system_element", {
            systemElementID: text("system_element_id").notNull(),
            workspaceID: text("workspace_id").notNull(),
            ...createdAtPattern.forTable(),
          });
        },

        entitySchema(table) {
          return createSelectSchema(table, {
            workspaceID: sourceSchema.shape.id,
            systemElementID: SystemElementIDSchema,
          });
        },

        queries({ schema, table, queryBuilder }) {
          return {
            queryAll: queryBuilder
              .implementation((db: BetterSQLite3Database) => {
                return db.select().from(table);
              })
              .output(z.array(schema)),

            queryFromSystemElement: queryBuilder
              .implementation(
                (
                  db: BetterSQLite3Database,
                  systemElement: Pick<SystemElement, "id">,
                ) => {
                  return db
                    .select()
                    .from(table)
                    .where(eq(table.systemElementID, systemElement.id));
                },
              )
              .output(z.array(schema)),

            queryFromWorkspace: queryBuilder
              .implementation(
                (
                  db: BetterSQLite3Database,
                  workspace: Pick<z.infer<typeof sourceSchema>, "id">,
                ) => {
                  return db
                    .select()
                    .from(table)
                    .where(eq(table.workspaceID, workspace.id));
                },
              )
              .output(z.array(schema)),
          };
        },

        actions({ schema, table }) {
          type Entity = z.infer<typeof schema>;

          return {};
        },
      }),
    };
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
    };
  },
});

export const WorkspaceSchema = WorkspaceEntity.schema;
export const WorkspaceIDSchema = WorkspaceSchema.shape.id;

export type Workspace = z.infer<typeof WorkspaceSchema>;
