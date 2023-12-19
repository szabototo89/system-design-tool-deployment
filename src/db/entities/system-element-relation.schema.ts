import {
  ActionBuilder,
  createSQLiteBackedEntity,
} from "../../entity-framework";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAtPattern } from "../patterns/created-at-pattern";
import { createSelectSchema } from "drizzle-zod";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { z } from "zod";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

export const SystemElementRelationEntity = createSQLiteBackedEntity({
  table() {
    return sqliteTable("system_element_relation", {
      id: text("id").primaryKey(),
      label: text("label"),
      sourceID: text("source_id").notNull(),
      targetID: text("target_id").notNull(),
      ...createdAtPattern.forTable(),
    });
  },

  entitySchema(table) {
    return createSelectSchema(table);
  },

  queries({ table, queryBuilder, schema }) {
    return {
      queryAll: queryBuilder
        .implementation((db: BetterSQLite3Database) => db.select().from(table))
        .output(z.array(schema)),
    };
  },

  actions({ schema, table }) {
    type Entity = z.infer<typeof schema>;

    return {
      create: new ActionBuilder(
        "create",
        async (db, params: Omit<Entity, "id" | "createdAt">) => {
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
        schema,
      ),
      update: new ActionBuilder(
        "update",
        async (
          db,
          options: {
            entity: Pick<Entity, "id">;
            params: Pick<Entity, "label">;
          },
        ) => {
          return db
            .update(table)
            .set({
              label: options.params.label,
            })
            .where(eq(table.id, options.entity.id))
            .returning()
            .get();
        },
        schema,
      ),
    };
  },
});

export type SystemElementRelation = z.infer<
  (typeof SystemElementRelationEntity)["schema"]
>;
