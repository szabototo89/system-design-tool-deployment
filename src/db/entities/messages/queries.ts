import { MessageBoard } from "../message-boards/types";

import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { MessagesTable } from "./tables";
import { Message, MessageSchema } from "./types";
import { imagesQuery } from "../images/queries";
import { db as appDb } from "../../schema";
import { reactionQuery } from "../reaction/queries";

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
    const reactions = await reactionQuery.queryAllFromSource(
      message.id,
      "messages",
      db,
    );

    return reactions;
  },
};
