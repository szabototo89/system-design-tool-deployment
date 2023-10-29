import { db } from "../../schema";
import { eq } from "drizzle-orm";
import { Images } from "./table";
import { Image, ImageSchema } from "./types";

export async function queryImageByID(id: Image["id"]) {
  const [image] = await db.select().from(Images).where(eq(Images.id, id));
  return ImageSchema.parse(image);
}
