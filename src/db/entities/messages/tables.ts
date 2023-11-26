import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { MessageBoardsTable } from "../message-boards/table";
import { ImagesTable } from "../images/tables";
import { createdByUserPattern } from "../../patterns/created-by-user-pattern";
import { createdAtPattern } from "../../patterns/created-at-pattern";

export const tableName = "messages" as const;

export const MessagesTable = sqliteTable(tableName, {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content"),
  messageBoardID: integer("message_board_id").references(
    () => MessageBoardsTable.id,
  ),
  imageID: integer("image_id").references(() => ImagesTable.id),
  ...createdAtPattern.forTable(),
  ...createdByUserPattern.forTable(),
});
