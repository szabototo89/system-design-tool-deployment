import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { ImageTable } from "../images/tables";
import { createdByUserPattern } from "../../patterns/created-by-user-pattern";
import { createdAtPattern } from "../../patterns/created-at-pattern";

export const MessageBoardTable = sqliteTable("message_boards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  description: text("description"),
  status: text("status"),
  imageID: integer("image_id").references(() => ImageTable.id),
  ...createdAtPattern.forTable(),
  ...createdByUserPattern.forTable(),
});
