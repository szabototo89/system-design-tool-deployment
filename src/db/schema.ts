import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

export * from "./schemas/messageBoards.schema";
export * from "./schemas/messages.schema";
export * from "./schemas/images.schema";

const sqliteClient = new Database("./app.db");
export const db = drizzle(sqliteClient);
