import { MessageBoard } from "../message-boards/types";

import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { MessageReactionTable, MessagesTable } from "./tables";
import { Message, MessageSchema } from "./types";
import { imagesQuery } from "../images/queries";
import { db as appDb } from "../../schema";
import { reactionQuery } from "../reaction/queries";
import { ReactionIDSchema } from "../reaction/types";

async function queryFromMessageBoard(
  messageBoard: MessageBoard,
  db: BetterSQLite3Database = appDb,
) {
  const messagesFromDb = await db
    .select()
    .from(MessagesTable)
    .where(eq(MessagesTable.messageBoardID, messageBoard.id))
    .orderBy(desc(MessagesTable.createdAt));

  return z.array(MessageSchema).parse(messagesFromDb);
}

export const messageQuery = {
  queryFromMessageBoard,

  async queryImage(message: Message) {
    if (message.imageID == null) {
      return null;
    }

    return imagesQuery.queryByID(message.imageID);
  },

  async queryReactionsFrom(
    message: Message,
    db: BetterSQLite3Database = appDb,
  ) {
    const results = await db
      .select()
      .from(MessageReactionTable)
      .where(eq(MessageReactionTable.messageID, message.id));

    const reactionIDs = results.map((row) =>
      ReactionIDSchema.parse(row.reactionID),
    );

    return await reactionQuery.queryByIDs(reactionIDs);
  },
};
