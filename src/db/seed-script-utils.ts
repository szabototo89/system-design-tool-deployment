import { z } from "zod";
import { MessageBoardsTable } from "./entities/message-boards/table";
import fs, { PathOrFileDescriptor } from "fs";
import { db, ImagesTable, ImageSchema } from "./schema";
import { MessageBoardSchema } from "@/db/entities/message-boards/types";
import { MessagesTable } from "@/db/entities/messages/tables";
import { MessageSchema } from "@/db/entities/messages/types";

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
  await db.delete(MessagesTable);
  await db.delete(MessageBoardsTable);
  await db.delete(ImagesTable);

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

  await db.insert(ImagesTable).values(images);
  await db.insert(MessageBoardsTable).values(seedFile.messageBoards);
  await db.insert(MessagesTable).values(seedFile.messages);
}
