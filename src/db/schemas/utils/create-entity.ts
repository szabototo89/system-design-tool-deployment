import { SQLiteTable } from "drizzle-orm/sqlite-core";
import { z, ZodSchema } from "zod";
import { db } from "../../schema";

export function createEntity<
  TTable extends SQLiteTable,
  TEntitySchema extends ZodSchema,
>(options: { table: TTable; entitySchema: TEntitySchema }) {
  return {
    async queryAll() {
      const entities = await db.select().from(options.table);

      return z.array(options.entitySchema).parse(entities);
    },
  };
}
