import {
  MessageBoard,
  MessageBoardSchema,
} from "@/db/entities/message-boards/types";
import { db, imagesQuery, MessageBoardsTable, messageQuery } from "@/db/schema";
import { eq } from "drizzle-orm";
import { messageAction } from "@/db/entities/messages/actions";
import { imageAction } from "@/db/entities/images/actions";

export const messageBoardAction = {
  async publishMessageBoard(messageBoard: Pick<MessageBoard, "id">) {
    const statusFieldSchema = MessageBoardSchema.shape.status;

    await db
      .update(MessageBoardsTable)
      .set({ status: statusFieldSchema.parse("published") })
      .where(eq(MessageBoardsTable.id, messageBoard.id));
  },

  async delete(messageBoard: MessageBoard) {
    await db.transaction(async (tx) => {
      const messages = await messageQuery.queryFromMessageBoard(
        messageBoard,
        tx,
      );

      await Promise.all(
        [
          ...messages.map((message) => messageAction.delete(message, tx)),
          messageBoard.imageID &&
            imageAction.deleteByID(messageBoard.imageID, tx),
        ].filter(Boolean),
      );

      await tx
        .delete(MessageBoardsTable)
        .where(eq(MessageBoardsTable.id, messageBoard.id));
    });
  },
};
