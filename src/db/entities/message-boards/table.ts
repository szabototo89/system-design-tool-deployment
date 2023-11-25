import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { ImagesTable } from "../images/tables";
import { createdByUserPattern } from "../../patterns/created-by-user-pattern";

export const MessageBoardsTable = sqliteTable("message_boards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  description: text("description"),
  status: text("status"),
  imageID: integer("image_id").references(() => ImagesTable.id),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  ...createdByUserPattern.forTable(),
});
