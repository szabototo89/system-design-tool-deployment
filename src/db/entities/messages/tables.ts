import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { MessageBoardsTable } from "../message-boards/table";
import { sql } from "drizzle-orm";
import { ImagesTable } from "../images/tables";
import { ReactionTable } from "../reaction/tables";

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

export const MessageReactionTable = sqliteTable("message_reaction", {
  messageID: integer("message_id")
    .primaryKey()
    .references(() => MessagesTable.id),
  reactionID: integer("reaction_id").references(() => ReactionTable.id),
});
