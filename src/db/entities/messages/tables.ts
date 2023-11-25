import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { MessageBoardsTable } from "../message-boards/table";
import { ImagesTable } from "../images/tables";
import { ReactionTable } from "../reaction/tables";
import { createdByUserPattern } from "../../patterns/created-by-user-pattern";
import { createdAtPattern } from "../../patterns/created-at-pattern";

export const MessagesTable = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content"),
  messageBoardID: integer("message_board_id").references(
    () => MessageBoardsTable.id,
  ),
  imageID: integer("image_id").references(() => ImagesTable.id),
  ...createdAtPattern.forTable(),
  ...createdByUserPattern.forTable(),
});

export const MessageReactionTable = sqliteTable("message_reaction", {
  messageID: integer("message_id")
    .primaryKey()
    .references(() => MessagesTable.id),
  reactionID: integer("reaction_id").references(() => ReactionTable.id),
});
