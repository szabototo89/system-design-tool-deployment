import { createSQLiteBackedEntity } from "../../../entity-framework";
import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAtPattern } from "../../patterns/created-at-pattern";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { db } from "../../../db/schema";
import { eq } from "drizzle-orm";

export const {
  schema: ImageSchema,
  table: ImageTable,
  queries: imageQuery,
} = createSQLiteBackedEntity({
  table() {
    return sqliteTable("images", {
      id: integer("id").primaryKey({ autoIncrement: true }),
      fileName: text("content"),
      fileContent: blob("file_content"),
      ...createdAtPattern.forTable(),
    });
  },

  entitySchema(table) {
    return createSelectSchema(table, {
      id: () => z.coerce.number().brand<"ImageID">(),
      fileContent: () => z.custom<Uint8Array>().optional(),
    });
  },

  queries({ schema, table, queryBuilder }) {
    type ImageType = z.infer<typeof schema>;
    type ID = ImageType["id"];

    return {
      queryByID: queryBuilder.implementation((id: ID) => {
        return db.select().from(table).where(eq(table.id, id));
      }),
      getImageSrc: queryBuilder
        .implementation(async (image: Pick<ImageType, "id">) => {
          return "/application/images/" + image.id;
        })
        .output(z.string()),
    };
  },
});

export type Image = z.infer<typeof ImageSchema>;

export const ImageIDSchema = ImageSchema.shape.id;

export const imageID = ImageIDSchema.parse;
