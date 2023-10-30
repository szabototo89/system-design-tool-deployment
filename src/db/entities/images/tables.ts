import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Images = sqliteTable("images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fileName: text("content"),
  fileContent: blob("file_content"),
});
