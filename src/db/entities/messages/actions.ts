import { MessageBoard } from "../message-boards/types";
import { Image } from "../images/types";
import {
  db as appDb,
  Message,
  messageQuery,
  MessageSchema,
  MessagesTable,
} from "../../schema";
import { eq } from "drizzle-orm";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { imageAction } from "@/db/entities/images/actions";
import { reactionAction } from "@/db/entities/reaction/actions";
import { UserContext } from "@/app/api/auth/[...nextauth]/auth-options";
import { reactionQuery } from "@/db/entities/reaction/queries";

export async function createMessage(
  userContext: UserContext,
  data: {
    messageBoard: Pick<MessageBoard, "id">;
    content: string;
    image: Pick<Image, "id"> | null;
  },
) {
  const [message] = await appDb
    .insert(MessagesTable)
    .values({
      content: data.content,
      messageBoardID: data.messageBoard.id,
      imageID: data.image?.id ?? null,
      createdBy: userContext.user().id,
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
      await imageAction.delete({ id: message.imageID }, tx);
    }

    const reactions = await messageQuery.queryReactionsFrom(message);
    await Promise.all(
      reactions.map((reaction) => reactionAction.delete(reaction, tx)),
    );
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
      await Promise.all(messages.map((message) => deleteMessage(message, tx)));
    });
  },

  async toggleReaction(
    userContext: UserContext,
    message: Pick<Message, "id">,
    db: BetterSQLite3Database = appDb,
  ) {
    const reactions = await reactionQuery.queryAllFromSource(
      message.id,
      "messages",
    );

    if (reactions.length === 0) {
      return await this.addReaction(userContext, message, db);
    }

    return await this.deleteReaction(message, db);
  },

  async addReaction(
    userContext: UserContext,
    message: Pick<Message, "id">,
    db: BetterSQLite3Database = appDb,
  ) {
    await reactionAction.create(userContext, message.id, "messages", db);
  },

  async deleteReaction(
    message: Pick<Message, "id">,
    db: BetterSQLite3Database = appDb,
  ) {
    const reactions = await reactionQuery.queryAllFromSource(
      message.id,
      "messages",
    );

    await Promise.all(
      reactions.map((reaction) => reactionAction.delete(reaction, db)),
    );
  },
};
