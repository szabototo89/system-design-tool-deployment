import { Images } from "@/db/entities/images/table";
import { ImageSchema } from "@/db/entities/images/types";
import { db } from "@/db/schema";
import { z } from "zod";

export const SupportedImageFileSchema = z
  .custom<File>()
  .refine(
    (file) => ["image/png", "image/jpg", "image/jpeg"].includes(file.type),
    (file) => ({
      message: `${file.type} is not supported. Only PNG and JPG image files are supported.`,
    }),
  )
  .brand("SupportedImageFile");

type SupportedImageFile = z.infer<typeof SupportedImageFileSchema>;

export async function createImageFromFile(imageFile: SupportedImageFile) {
  const fileContent = new Uint8Array(await imageFile.arrayBuffer());
  const fileName = imageFile.name;

  const [image] = await db
    .insert(Images)
    .values({
      fileName,
      fileContent,
    })
    .returning();

  return ImageSchema.parse(image);
}
