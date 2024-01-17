import { db, db as appDb, DrizzleDatabase } from "@/db/schema";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import { UserContext } from "@/app/api/auth/[...nextauth]/auth-options";
import { ActionBuilder, createSQLiteBackedEntity } from "@/entity-framework";

console.clear();

const PersonEntity = createSQLiteBackedEntity({
  table() {
    return sqliteTable("person", {
      id: text("id").primaryKey(),
      name: text("name"),
    });
  },

  entitySchema(table) {
    return createSelectSchema(table);
  },

  actions({ table, schema }) {
    return {
      create: new ActionBuilder(
        "create",
        (tx, name: string) => {
          return tx.insert(table).values({
            id: "1",
            name,
          });
        },
        schema,
      ),
    };
  },

  queries({ table, schema, queryBuilder }) {
    return {
      queryByID: queryBuilder
        .implementation(
          (
            _: UserContext,
            id: z.infer<typeof schema>["id"],
            db: DrizzleDatabase = appDb,
          ) => {
            return db.select().from(table).where(eq(table.id, id));
          },
        )
        .output(schema.nullable()),

      queryAll: queryBuilder
        .implementation((_: UserContext, db: DrizzleDatabase = appDb) => {
          return db.select().from(table);
        })
        .output(z.array(schema)),
    };
  },
});
