import { db } from "../../schema";
import { eq } from "drizzle-orm";
import { Images } from "./tables";
import { Image, ImageSchema } from "./types";

async function queryImageByID(id: Image["id"]) {
  const [image] = await db.select().from(Images).where(eq(Images.id, id));
  return ImageSchema.parse(image);
}

export const imagesQuery = {
  queryByID: queryImageByID,
};
