import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const MessageBoards = sqliteTable("message_boards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  description: text("description"),
  status: text("status"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
