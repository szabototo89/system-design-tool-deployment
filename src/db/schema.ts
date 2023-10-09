import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { sql } from "drizzle-orm";

export const MessageBoards = sqliteTable("message_boards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  description: text("description"),
  status: text("status").$type<MessageBoardStatus>(),
});

export const Messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content"),
  messageBoardID: integer("message_board_id").references(
    () => MessageBoards.id,
  ),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

type MessageBoardStatus = "draft" | "published";

export type MessageBoard = typeof MessageBoards.$inferSelect;
export type Message = typeof Messages.$inferSelect;

const sqliteClient = new Database("./app.db");
export const db = drizzle(sqliteClient);
