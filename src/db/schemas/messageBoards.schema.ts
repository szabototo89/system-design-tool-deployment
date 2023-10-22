import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { db } from "../schema";
import { eq } from "drizzle-orm";

export const MessageBoards = sqliteTable("message_boards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  description: text("description"),
  status: text("status"),
});

export const messageBoardStatusList = ["draft", "published"] as const;

export const MessageBoardSchema = createSelectSchema(MessageBoards, {
  // id: (schema) => schema.id.brand<"MessageBoardID">(),
  id: z.coerce.number().brand<"MessageBoardID">(),
  status: z.enum(messageBoardStatusList),
});

export type MessageBoard = z.infer<typeof MessageBoardSchema>;

export async function queryMessageBoards() {
  const messageBoards = await db.select().from(MessageBoards);

  return z.array(MessageBoardSchema).parse(messageBoards);
}

export const messageBoardID = MessageBoardSchema.shape.id.parse;

export async function queryMessageBoardBy<
  TThrowException extends boolean,
>(options: { id: MessageBoard["id"] }) {
  const [messageBoardFromDb] = await db
    .select()
    .from(MessageBoards)
    .where(eq(MessageBoards.id, messageBoardID(options.id)));

  return MessageBoardSchema.parse(messageBoardFromDb);
}
