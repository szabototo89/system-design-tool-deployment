import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createdByUserPattern } from "../../patterns/created-by-user-pattern";

export const ReactionTable = sqliteTable("reaction", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  ...createdByUserPattern.forTable(),
});
