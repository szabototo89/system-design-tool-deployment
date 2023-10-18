import { readSeedFile, seedDatabase } from "./seed-script-utils";

export const seedFile = readSeedFile("./src/db/seeds/real-life-seed.json");
await seedDatabase(seedFile);
