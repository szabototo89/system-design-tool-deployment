import {
  MessageBoard,
  MessageBoardSchema,
} from "@/db/entities/message-boards/types";
import { db, MessageBoards } from "@/db/schema";
import { eq } from "drizzle-orm";

export const messageBoardAction = {
  async publishMessageBoard(messageBoard: Pick<MessageBoard, "id">) {
    const statusFieldSchema = MessageBoardSchema.shape.status;

    await db
      .update(MessageBoards)
      .set({ status: statusFieldSchema.parse("published") })
      .where(eq(MessageBoards.id, messageBoard.id));
  },
};
