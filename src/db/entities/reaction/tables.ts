import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { createdByUserPattern } from "../../patterns/created-by-user-pattern";
import { createdAtPattern } from "../../patterns/created-at-pattern";

export const ReactionTable = sqliteTable(
  "reaction",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    type: text("type"),
    sourceID: integer("source_id").notNull(),
    sourceType: text("source_type").notNull(),
    ...createdAtPattern.forTable(),
    ...createdByUserPattern.forTable(),
  },
  (table) => ({
    unique: unique().on(table.id, table.sourceID, table.sourceType, table.type),
  }),
);
