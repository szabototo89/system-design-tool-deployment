import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const ReactionTable = sqliteTable("reaction", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
