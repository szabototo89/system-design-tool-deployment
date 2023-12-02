import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { MessageBoardTable } from "../message-boards/table";
import { createdByUserPattern } from "../../patterns/created-by-user-pattern";
import { createdAtPattern } from "../../patterns/created-at-pattern";
import { ImageTable } from "../images/entity";

export const tableName = "messages" as const;

export const MessageTable = sqliteTable(tableName, {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content"),
  messageBoardID: integer("message_board_id").references(
    () => MessageBoardTable.id,
  ),
  imageID: integer("image_id").references(() => ImageTable.id),
  ...createdAtPattern.forTable(),
  ...createdByUserPattern.forTable(),
});
