import {
  MessageBoard,
  MessageBoardSchema,
} from "@/db/entities/message-boards/types";
import { db, MessageBoardsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const messageBoardAction = {
  async publishMessageBoard(messageBoard: Pick<MessageBoard, "id">) {
    const statusFieldSchema = MessageBoardSchema.shape.status;

    await db
      .update(MessageBoardsTable)
      .set({ status: statusFieldSchema.parse("published") })
      .where(eq(MessageBoardsTable.id, messageBoard.id));
  },
};
