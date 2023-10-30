import { MessageBoardsTable } from "./table";
import { db, imagesQuery } from "../../schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { MessageBoard, messageBoardID, MessageBoardSchema } from "./types";

async function queryMessageBoards() {
  const messageBoards = await db.select().from(MessageBoardsTable);
  return z.array(MessageBoardSchema).parse(messageBoards);
}
async function queryMessageBoardBy(options: { id: MessageBoard["id"] }) {
  const [messageBoardFromDb] = await db
    .select()
    .from(MessageBoardsTable)
    .where(eq(MessageBoardsTable.id, messageBoardID(options.id)));
  return MessageBoardSchema.parse(messageBoardFromDb);
}

async function queryImage(messageBoard: MessageBoard) {
  if (messageBoard.imageID == null) {
    return null;
  }

  return imagesQuery.queryByID(messageBoard.imageID);
}

export const messageBoardQuery = {
  queryAll: queryMessageBoards,
  queryBy: queryMessageBoardBy,
  queryImage,
};
