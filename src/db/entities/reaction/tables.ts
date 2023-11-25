import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdByUserPattern } from "../../patterns/created-by-user-pattern";
import { createdAtPattern } from "../../patterns/created-at-pattern";

export const ReactionTable = sqliteTable("reaction", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type"),
  ...createdAtPattern.forTable(),
  ...createdByUserPattern.forTable(),
});
