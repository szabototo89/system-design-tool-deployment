import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { ImageTable } from "./tables";

export const ImageSchema = createSelectSchema(ImageTable, {
  id: () => z.coerce.number().brand<"ImageID">(),
  fileContent: () => z.custom<Uint8Array>().optional(),
});

export const ImageIDSchema = ImageSchema.shape.id;

export type Image = z.output<typeof ImageSchema>;

export const imageID = ImageIDSchema.parse;
