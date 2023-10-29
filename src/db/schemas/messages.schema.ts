import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { MessageBoard, MessageBoards } from "./messageBoards.schema";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { Images } from "../entities/images/table";
import { queryImageByID } from "../entities/images/queries";
import { Image, imageID } from "../entities/images/types";
import { db } from "@/db/schema";

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
}).transform((message) => {
  return {
    ...message,
    image() {
      if (message.imageID == null) {
        return null;
      }

      return queryImageByID(imageID(message.imageID));
    },
  };
});

export async function createMessage(data: {
  messageBoard: Pick<MessageBoard, "id">;
  content: string;
  image: Pick<Image, "id"> | null;
}) {
  const [message] = await db
    .insert(Messages)
    .values({
      content: data.content,
      messageBoardID: data.messageBoard.id,
      imageID: data.image?.id ?? null,
    })
    .returning();

  return MessageSchema.parse(message);
}

export type Message = z.infer<typeof MessageSchema>;
