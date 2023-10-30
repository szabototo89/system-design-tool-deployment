import { MessageBoard } from "../message-boards/types";
import { Image } from "../images/types";
import { db, MessagesTable, MessageSchema } from "../../schema";

export async function createMessage(data: {
  messageBoard: Pick<MessageBoard, "id">;
  content: string;
  image: Pick<Image, "id"> | null;
}) {
  const [message] = await db
    .insert(MessagesTable)
    .values({
      content: data.content,
      messageBoardID: data.messageBoard.id,
      imageID: data.image?.id ?? null,
    })
    .returning();

  return MessageSchema.parse(message);
}

export const messageAction = {
  create: createMessage,
};
