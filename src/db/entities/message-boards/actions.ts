import {
  MessageBoard,
  MessageBoardSchema,
} from "@/db/entities/message-boards/types";
import { db, MessageBoardTable, messageQuery } from "@/db/schema";
import { eq } from "drizzle-orm";
import { messageAction } from "@/db/entities/messages/actions";
import { imageAction } from "@/db/entities/images/actions";

export const messageBoardAction = {
  async publishMessageBoard(messageBoard: Pick<MessageBoard, "id">) {
    const statusFieldSchema = MessageBoardSchema.shape.status;

    const [updatedMessageBoard] = await db
      .update(MessageBoardTable)
      .set({ status: statusFieldSchema.parse("published") })
      .where(eq(MessageBoardTable.id, messageBoard.id))
      .returning();

    return MessageBoardSchema.parse(updatedMessageBoard);
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
            imageAction.delete({ id: messageBoard.imageID }, tx),
        ].filter(Boolean),
      );

      await tx
        .delete(MessageBoardTable)
        .where(eq(MessageBoardTable.id, messageBoard.id));
    });
  },
};
