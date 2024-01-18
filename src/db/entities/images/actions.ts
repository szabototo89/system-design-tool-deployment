import { db as appDb, DrizzleDatabase } from "@/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { Image, ImageSchema, ImageTable } from "@/db/entities/images/entity";

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
    .insert(ImageTable)
    .values({
      fileName,
      fileContent,
    })
    .returning();

  return ImageSchema.parse(image);
}

export const imageAction = {
  create: createImage,
  createFromFile: createImageFromFile,

  async delete(image: Pick<Image, "id">, db: DrizzleDatabase = appDb) {
    await db.delete(ImageTable).where(eq(ImageTable.id, image.id));
  },
};
