import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { Images } from "./tables";

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

export const ImageIDSchema = ImageSchema.innerType().shape.id;

export type Image = z.output<typeof ImageSchema>;

export const imageID = ImageIDSchema.parse;
