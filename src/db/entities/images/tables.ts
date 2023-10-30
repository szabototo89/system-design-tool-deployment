import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const ImagesTable = sqliteTable("images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fileName: text("content"),
  fileContent: blob("file_content"),
});
