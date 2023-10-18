import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const MessageBoards = sqliteTable("message_boards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  description: text("description"),
  status: text("status"),
});

export const messageBoardStatusList = ["draft", "published"] as const;

export const MessageBoardSchema = createSelectSchema(MessageBoards, {
  id: (schema) => schema.id.brand<"MessageBoardID">(),
  status: z.enum(messageBoardStatusList),
});

export type MessageBoard = z.infer<typeof MessageBoardSchema>;
