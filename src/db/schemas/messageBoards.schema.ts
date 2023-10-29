import {
  integer,
  QueryBuilder,
  SQLiteSelect,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { db } from "../schema";
import { eq, Query, sql } from "drizzle-orm";

export const MessageBoards = sqliteTable("message_boards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  description: text("description"),
  status: text("status"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const messageBoardStatusList = ["draft", "published"] as const;

export const MessageBoardSchema = createSelectSchema(MessageBoards, {
  id: z.coerce.number().brand<"MessageBoardID">(),
  status: z.enum(messageBoardStatusList),
});

export type MessageBoard = z.infer<typeof MessageBoardSchema>;

export async function queryMessageBoards() {
  const messageBoards = await db.select().from(MessageBoards);

  return z.array(MessageBoardSchema).parse(messageBoards);
}

export const messageBoardID = MessageBoardSchema.shape.id.parse;

export async function queryMessageBoardBy(options: { id: MessageBoard["id"] }) {
  const [messageBoardFromDb] = await db
    .select()
    .from(MessageBoards)
    .where(eq(MessageBoards.id, messageBoardID(options.id)));

  return MessageBoardSchema.parse(messageBoardFromDb);
}
