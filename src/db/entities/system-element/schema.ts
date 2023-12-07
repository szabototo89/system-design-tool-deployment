import {
  ActionBuilder,
  createSQLiteBackedEntity,
} from "../../../entity-framework";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAtPattern } from "../../patterns/created-at-pattern";
import { createSelectSchema } from "drizzle-zod";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { z } from "zod";
import { randomUUID } from "crypto";
import { eq, InferInsertModel } from "drizzle-orm";

export const SystemElement = createSQLiteBackedEntity({
  table() {
    return sqliteTable("system_element", {
      id: text("id").primaryKey(),
      name: text("name"),
      type: text("type"),
      description: text("description"),
      ...createdAtPattern.forTable(),
    });
  },

  // edges({ edgeBuilder }) {
  //   return {
  //     // relations: edgeBuilder.junction({
  //     //   table() {
  //     //     return sqliteTable("system_element__relation", {
  //     //       systemElementID: text("system_element_id"),
  //     //       systemElementRelationID: text("system_element_relation_id"),
  //     //     });
  //     //   },
  //     //
  //     //   junctionSchema(table) {
  //     //     return createSelectSchema(table);
  //     //   },
  //     // }),
  //
  //     Relations: edgeBuilder.reference(SystemElementRelation, "relation"),
  //   };
  // },

  entitySchema(table) {
    return createSelectSchema(table, {
      id: (schema) => schema.id.brand("SystemElementID"),
      type: z.enum(["system", "container", "component", "person"] as const),
      name: z.string().min(1, "System element name cannot be empty"),
    });
  },

  queries({ table, queryBuilder, schema }) {
    return {
      queryAll: queryBuilder
        .implementation((db: BetterSQLite3Database) => db.select().from(table))
        .output(z.array(schema)),

      queryById: queryBuilder
        .implementation(
          (
            db: BetterSQLite3Database,
            { id }: Pick<z.infer<typeof schema>, "id">,
          ) => db.select().from(table).where(eq(table.id, id)).get(),
        )
        .output(z.nullable(schema)),
    };
  },

  actions({ schema, table }) {
    return {
      create: new ActionBuilder(
        "create",
        async (db, value: Omit<InferInsertModel<typeof table>, "id">) => {
          return db
            .insert(table)
            .values({
              ...value,
              id: randomUUID(),
            })
            .returning()
            .get();
        },
        schema,
      ),
    };
  },
});
