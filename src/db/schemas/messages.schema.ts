import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { MessageBoards } from "@/db/schemas/messageBoards.schema";
import { sql } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const Messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content"),
  messageBoardID: integer("message_board_id").references(
    () => MessageBoards.id,
  ),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const MessageSelectSchema = createSelectSchema(Messages, {
  id: (schema) => schema.id.brand<"MessageID">(),
});

export type Message = z.infer<typeof MessageSelectSchema>;
