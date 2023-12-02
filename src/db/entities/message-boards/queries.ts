import { MessageBoardTable } from "./table";
import { db } from "../../schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { MessageBoard, messageBoardID, MessageBoardSchema } from "./types";
import { imageQuery } from "../images/entity";

async function queryMessageBoards() {
  const messageBoards = await db.select().from(MessageBoardTable);
  return z.array(MessageBoardSchema).parse(messageBoards);
}
async function queryMessageBoardBy(options: { id: MessageBoard["id"] }) {
  const [messageBoardFromDb] = await db
    .select()
    .from(MessageBoardTable)
    .where(eq(MessageBoardTable.id, messageBoardID(options.id)));
  return MessageBoardSchema.parse(messageBoardFromDb);
}

async function queryImage(messageBoard: MessageBoard) {
  if (messageBoard.imageID == null) {
    return null;
  }

  return imageQuery.queryByID(messageBoard.imageID);
}

export const messageBoardQuery = {
  queryAll: queryMessageBoards,
  queryBy: queryMessageBoardBy,
  queryImage,
};
