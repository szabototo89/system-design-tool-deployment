import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAtPattern } from "../../patterns/created-at-pattern";

export const ImageTable = sqliteTable("images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fileName: text("content"),
  fileContent: blob("file_content"),
  ...createdAtPattern.forTable(),
});
