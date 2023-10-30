import { MessageBoard } from "../message-boards/types";
import {
  db as appDb,
  MessagesTable,
  MessageSchema,
  Message,
  imagesQuery,
} from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

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
};
