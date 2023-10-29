import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { MessageBoards } from "./messageBoards.schema";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { Images } from "./images.schema";

export const Messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content"),
  messageBoardID: integer("message_board_id").references(
    () => MessageBoards.id,
  ),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  imageID: integer("image_id").references(() => Images.id),
});

export const MessageSchema = createSelectSchema(Messages, {
  id: (schema) => schema.id.brand<"MessageID">(),
});

export const MessageInsertSchema = createInsertSchema(Messages, {
  id: (schema) => schema.id.brand<"MessageID">(),
});

export type Message = z.infer<typeof MessageSchema>;
