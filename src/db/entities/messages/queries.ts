import { MessageBoard } from "../message-boards/types";

import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { MessageTable } from "./tables";
import { Message, MessageSchema } from "./types";
import { DrizzleDatabase, db as appDb } from "../../schema";
import { reactionQuery } from "../reaction/queries";
import { imageQuery } from "../images/entity";

async function queryFromMessageBoard(
  messageBoard: MessageBoard,
  db: DrizzleDatabase = appDb,
) {
  const messagesFromDb = await db
    .select()
    .from(MessageTable)
    .where(eq(MessageTable.messageBoardID, messageBoard.id))
    .orderBy(desc(MessageTable.createdAt));

  return z.array(MessageSchema).parse(messagesFromDb);
}

export const messageQuery = {
  queryFromMessageBoard,

  async queryImage(message: Message) {
    if (message.imageID == null) {
      return null;
    }

    return imageQuery.queryByID(message.imageID);
  },

  async queryReactionsFrom(message: Message, db: DrizzleDatabase = appDb) {
    const reactions = await reactionQuery.queryAllFromSource(
      message.id,
      "messages",
      db,
    );

    return reactions;
  },
};
