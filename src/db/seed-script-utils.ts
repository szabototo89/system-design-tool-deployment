import { z } from "zod";
import { MessageBoardTable } from "./entities/message-boards/table";
import fs, { PathOrFileDescriptor } from "fs";
import { db } from "./schema";
import { MessageBoardSchema } from "@/db/entities/message-boards/types";
import { MessageTable } from "@/db/entities/messages/tables";
import { MessageSchema } from "@/db/entities/messages/types";
import { ImageSchema, ImageTable } from "@/db/entities/images/entity";
import { UserWithPasswordSchema, UsersTable } from "./entities/users/tables";

const SeedFileSchema = z.object({
  messageBoards: z.array(MessageBoardSchema.partial()),
  messages: z.array(MessageSchema.partial()),
  images: z.array(
    z.object({
      id: z.number(),
      imageName: z.string(),
    }),
  ),
  users: z.array(
    UserWithPasswordSchema.pick({
      id: true,
      name: true,
      password: true,
      email: true,
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
  await db.delete(MessageTable);
  await db.delete(MessageBoardTable);
  await db.delete(ImageTable);
  await db.delete(UsersTable);

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

  await db.insert(UsersTable).values(seedFile.users);
  await db.insert(ImageTable).values(images);
  await db.insert(MessageBoardTable).values(seedFile.messageBoards);
  await db.insert(MessageTable).values(seedFile.messages);
}
