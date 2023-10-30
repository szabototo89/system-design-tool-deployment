import { db } from "../../schema";
import { eq } from "drizzle-orm";
import { ImagesTable } from "./tables";
import { Image, ImageSchema } from "./types";

async function queryImageByID(id: Image["id"]) {
  const [image] = await db
    .select()
    .from(ImagesTable)
    .where(eq(ImagesTable.id, id));
  return ImageSchema.parse(image);
}

export const imagesQuery = {
  queryByID: queryImageByID,

  getImageSrc(image: Image) {
    return "/application/images/" + image.id;
  },
};
