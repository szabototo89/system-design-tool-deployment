import { z } from "zod";
import {
  MessageBoards,
  MessageBoardSchema,
} from "./schemas/messageBoards.schema";
import {
  MessageInsertSchema,
  Messages,
  MessageSchema,
} from "./schemas/messages.schema";
import fs, { PathOrFileDescriptor } from "fs";
import { db } from "./schema";

const SeedFileSchema = z.object({
  messageBoards: z.array(MessageBoardSchema),
  messages: z.array(MessageSchema.partial()),
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
  await db.insert(MessageBoards).values(seedFile.messageBoards);
  await db.insert(Messages).values(seedFile.messages);
}
