import { z } from "zod";
import {
  MessageBoards,
  MessageBoardSchema,
} from "./schemas/messageBoards.schema";
import { Messages, MessageSchema } from "./schemas/messages.schema";
import fs, { PathOrFileDescriptor } from "fs";
import { db, Images, ImageSchema } from "./schema";

const SeedFileSchema = z.object({
  messageBoards: z.array(MessageBoardSchema.partial()),
  messages: z.array(MessageSchema.partial()),
  images: z.array(
    z.object({
      id: z.number(),
      imageName: z.string(),
    }),
  ),
});
type SeedFile = z.infer<typeof SeedFileSchema>;

export function readSeedFile(seedFilePath: PathOrFileDescriptor): SeedFile {
  const fileContent = fs.readFileSync(seedFilePath, "utf-8");
  const rawFileContentAsJson = JSON.parse(fileContent);

  return SeedFileSchema.parse(rawFileContentAsJson);
}

export async function seedDatabase(seedFile: SeedFile) {
  await db.delete(Messages);
  await db.delete(MessageBoards);
  await db.delete(Images);

  const images = await Promise.all(
    seedFile.images.map(async (image) => {
      const fileContent = await fetch(
        `https://picsum.photos/seed/${image.imageName}/600/400`,
      )
        .then((response) => response.arrayBuffer())
        .then((buffer) => new Uint8Array(buffer));

      return ImageSchema.parse({
        id: image.id,
        fileName: image.imageName,
        fileContent,
      });
    }),
  );

  await db.insert(Images).values(images);
  await db.insert(MessageBoards).values(seedFile.messageBoards);
  await db.insert(Messages).values(seedFile.messages);
}
