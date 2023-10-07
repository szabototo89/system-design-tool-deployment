import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

export const MessageBoards = sqliteTable("message_boards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  description: text("description"),
  status: text("status"),
});

export type MessageBoard = typeof MessageBoards.$inferSelect;

const sqliteClient = new Database("./app.db");
export const db = drizzle(sqliteClient);
