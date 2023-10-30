import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { MessageBoards } from "../message-boards/table";
import { sql } from "drizzle-orm";
import { Images } from "../images/tables";

export const Messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content"),
  messageBoardID: integer("message_board_id").references(
    () => MessageBoards.id,
  ),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  imageID: integer("image_id").references(() => Images.id),
});
