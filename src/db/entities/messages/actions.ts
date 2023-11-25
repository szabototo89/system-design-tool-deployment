import { MessageBoard } from "../message-boards/types";
import { Image } from "../images/types";
import {
  db as appDb,
  Message,
  messageQuery,
  MessageReactionTable,
  MessageSchema,
  MessagesTable,
  ReactionTable,
} from "../../schema";
import { and, eq } from "drizzle-orm";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { imageAction } from "@/db/entities/images/actions";
import { reactionAction } from "@/db/entities/reaction/actions";
import { Reaction, ReactionSchema } from "@/db/entities/reaction/types";
import { applicationLogger } from "@/logging/logger";
import { UserContext } from "@/app/api/auth/[...nextauth]/auth-options";

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
    const user = userContext.user();

    const [result] = await db
      .select()
      .from(MessageReactionTable)
      .innerJoin(
        ReactionTable,
        eq(MessageReactionTable.reactionID, ReactionTable.id),
      )
      .where(
        and(
          eq(MessageReactionTable.messageID, message.id),
          eq(ReactionTable.createdBy, user.id),
        ),
      );

    if (result == null) {
      return await this.addReaction(userContext, message, db);
    }

    const reaction = ReactionSchema.parse(result.reaction);

    return await this.deleteReaction(message, reaction, db);
  },

  async addReaction(
    userContext: UserContext,
    message: Pick<Message, "id">,
    db: BetterSQLite3Database = appDb,
  ) {
    const reaction = await reactionAction.create(userContext);

    await db.insert(MessageReactionTable).values({
      messageID: message.id,
      reactionID: reaction.id,
    });
  },

  async deleteReaction(
    message: Pick<Message, "id">,
    reaction: Pick<Reaction, "id">,
    db: BetterSQLite3Database = appDb,
  ) {
    const deletedReactions = await db
      .delete(MessageReactionTable)
      .where(
        and(
          eq(MessageReactionTable.messageID, message.id),
          eq(MessageReactionTable.reactionID, reaction.id),
        ),
      )
      .returning();

    if (deletedReactions.length === 0) {
      applicationLogger.warn(
        {
          action: {
            name: "deleteReaction",
            messageID: message.id,
            reactionID: reaction.id,
          },
        },
        "Invalid reaction deletion on message",
      );
      return;
    }

    await reactionAction.delete(reaction, db);
  },
};
