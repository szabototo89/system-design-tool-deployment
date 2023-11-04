import { ImagesTable } from "@/db/entities/images/tables";
import { Image, ImageSchema } from "@/db/entities/images/types";
import { db as appDb } from "@/db/schema";
import { z } from "zod";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";

const FIVE_MB = 5 * 1024 * 1024;
export const SupportedImageFileSchema = z
  .custom<File>()
  .refine(
    (file) => ["image/png", "image/jpg", "image/jpeg"].includes(file.type),
    (file) => ({
      message: `${file.type} is not supported. Only PNG and JPG image files are supported.`,
    }),
  )
  .refine((file) => file.size <= FIVE_MB, {
    message: "File size cannot be more than 5MB.",
  })
  .brand("SupportedImageFile");

type SupportedImageFile = z.infer<typeof SupportedImageFileSchema>;

export async function createImageFromFile(file: File) {
  const imageFile = SupportedImageFileSchema.parse(file);
  return imageAction.create(imageFile);
}

export async function createImage(imageFile: SupportedImageFile) {
  const fileContent = new Uint8Array(await imageFile.arrayBuffer());
  const fileName = imageFile.name;

  const [image] = await appDb
    .insert(ImagesTable)
    .values({
      fileName,
      fileContent,
    })
    .returning();

  return ImageSchema.parse(image);
}

async function deleteByID(
  imageID: Image["id"],
  db: BetterSQLite3Database = appDb,
) {
  await db.delete(ImagesTable).where(eq(ImagesTable.id, imageID));
}

export const imageAction = {
  create: createImage,
  createFromFile: createImageFromFile,

  async delete(image: Image, db: BetterSQLite3Database = appDb) {
    await deleteByID(image.id, db);
  },

  deleteByID,
};
