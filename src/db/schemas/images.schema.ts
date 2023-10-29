import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { db } from "../schema";
import { eq } from "drizzle-orm";

export const Images = sqliteTable("images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fileName: text("content"),
  fileContent: blob("file_content"),
});

export const ImageSchema = createSelectSchema(Images, {
  id: () => z.coerce.number().brand<"ImageID">(),
  fileContent: () => z.custom<Uint8Array>().optional(),
}).transform((image) => {
  const imageID = image.id;

  return {
    ...image,
    imageSrc() {
      return "/application/images/" + imageID;
    },
  };
});

export type Image = z.output<typeof ImageSchema>;

export const imageID = ImageSchema.innerType().shape.id.parse;

export async function queryImageByID(id: Image["id"]) {
  const [image] = await db.select().from(Images).where(eq(Images.id, id));
  return ImageSchema.parse(image);
}
