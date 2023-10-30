import { MessageBoard } from "../message-boards/types";
import { Image } from "../images/types";
import {
  db as appDb,
  Message,
  MessageSchema,
  MessagesTable,
} from "../../schema";
import { eq, inArray } from "drizzle-orm";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { imageAction } from "@/db/entities/images/actions";

export async function createMessage(data: {
  messageBoard: Pick<MessageBoard, "id">;
  content: string;
  image: Pick<Image, "id"> | null;
}) {
  const [message] = await appDb
    .insert(MessagesTable)
    .values({
      content: data.content,
      messageBoardID: data.messageBoard.id,
      imageID: data.image?.id ?? null,
    })
    .returning();

  return MessageSchema.parse(message);
}

async function deleteMessage(
  message: Message,
  db: BetterSQLite3Database = appDb,
) {
  await db.transaction(async (tx) => {
    await tx.delete(MessagesTable).where(eq(MessagesTable.id, message.id));

    if (message.imageID != null) {
      await imageAction.deleteByID(message.imageID, tx);
    }
  });
}

export const messageAction = {
  create: createMessage,
  delete: deleteMessage,
  async deleteMany(
    messages: readonly Message[],
    db: BetterSQLite3Database = appDb,
  ) {
    if (messages.length === 0) {
      return;
    }

    await db.transaction(async (tx) => {
      await Promise.all(messages.map((message) => deleteMessage(message, db)));
    });
  },
};
