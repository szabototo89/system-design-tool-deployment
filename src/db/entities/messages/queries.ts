import { MessageBoard } from "../message-boards/types";
import { db, MessagesTable, MessageSchema } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

async function queryFromMessageBoard(messageBoard: MessageBoard) {
  const messagesFromDb = await db
    .select()
    .from(MessagesTable)
    .where(eq(MessagesTable.messageBoardID, messageBoard.id))
    .orderBy(desc(MessagesTable.createdAt));

  return z.array(MessageSchema).parse(messagesFromDb);
}

export const messageQuery = {
  queryFromMessageBoard,
};
