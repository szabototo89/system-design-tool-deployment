import fs, { PathOrFileDescriptor } from "fs";
import { z } from "zod";
import {
  MessageBoards,
  MessageBoardSchema,
} from "../db/schemas/messageBoards.schema";
import { db, MessageInsertSchema, Messages } from "../db/schema";

const SeedFileSchema = z.object({
  messageBoards: z.array(MessageBoardSchema),
  messages: z.array(MessageInsertSchema),
});

type SeedFile = z.infer<typeof SeedFileSchema>;

function readSeedFile(seedFilePath: PathOrFileDescriptor): SeedFile {
  const fileContent = fs.readFileSync(seedFilePath, "utf-8");
  const rawFileContentAsJson = JSON.parse(fileContent);

  return SeedFileSchema.parse(rawFileContentAsJson);
}

async function seedDatabase(seedFile: SeedFile) {
  await db.delete(Messages);
  await db.delete(MessageBoards);
  await db.insert(MessageBoards).values(seedFile.messageBoards);
  await db.insert(Messages).values(seedFile.messages);
}

const seedFile = readSeedFile("./src/db/seeds/real-life-seed.json");
await seedDatabase(seedFile);
