import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { MessageBoardsTable } from "../message-boards/table";
import { sql } from "drizzle-orm";
import { ImagesTable } from "../images/tables";

export const MessagesTable = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content"),
  messageBoardID: integer("message_board_id").references(
    () => MessageBoardsTable.id,
  ),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  imageID: integer("image_id").references(() => ImagesTable.id),
});
