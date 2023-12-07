import { createSQLiteBackedEntity } from "../../entity-framework";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAtPattern } from "../patterns/created-at-pattern";
import { createSelectSchema } from "drizzle-zod";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { z } from "zod";

export const SystemElementRelation = createSQLiteBackedEntity({
  table() {
    return sqliteTable("system_element_relation", {
      id: text("id").primaryKey(),
      label: text("label"),
      sourceID: text("source_id"),
      targetID: text("target_id"),
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
});
