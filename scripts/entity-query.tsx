import {
  db as appDb,
  ImageTable,
  MessageBoardTable,
  MessageTable,
} from "@/db/schema";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAtPattern } from "@/db/patterns/created-at-pattern";
import { createdByUserPattern } from "@/db/patterns/created-by-user-pattern";
import { createSelectSchema } from "drizzle-zod";
import { UserContext } from "@/app/api/auth/[...nextauth]/auth-options";
import { createSQLiteBackedEntity } from "@/entity-framework";

async function main() {
  console.clear();
  const result = await appDb.select().from(MessageTable);

  const MessageEntity = await createSQLiteBackedEntity({
    table() {
      return sqliteTable("message_entity", {
        id: integer("id").primaryKey({ autoIncrement: true }),
        content: text("content"),
        messageBoardID: integer("message_board_id").references(
          () => MessageBoardTable.id,
        ),
        imageID: integer("image_id").references(() => ImageTable.id),
        ...createdAtPattern.forTable(),
        ...createdByUserPattern.forTable(),
      });
    },

    entitySchema(table) {
      return createSelectSchema(table);
    },

    queries({ table, schema, queryBuilder }) {
      return {
        queryByID: queryBuilder
          .implementation(
            (
              _: UserContext,
              id: z.infer<typeof schema>["id"],
              db: BetterSQLite3Database = appDb,
            ) => {
              return db.select().from(table).where(eq(table.id, id));
            },
          )
          .output(schema.nullable()),
        queryAll: queryBuilder
          .implementation(
            (_: UserContext, db: BetterSQLite3Database = appDb) => {
              return db.select().from(table);
            },
          )
          .output(z.array(schema)),
      };
    },
  });
}

main();
