import { MessageBoard } from "../message-boards/types";
import { db, Messages, MessageSchema } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

async function queryFromMessageBoard(messageBoard: MessageBoard) {
  const messagesFromDb = await db
    .select()
    .from(Messages)
    .where(eq(Messages.messageBoardID, messageBoard.id))
    .orderBy(desc(Messages.createdAt));

  return z.array(MessageSchema).parse(messagesFromDb);
}

export const messageQuery = {
  queryFromMessageBoard,
};
