import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

export * from "./entities/message-boards/table";
export * from "./entities/message-boards/types";
export * from "./entities/message-boards/queries";
export * from "./entities/messages/tables";
export * from "./entities/messages/types";
export * from "./entities/messages/queries";
export * from "./entities/images/types";
export * from "./entities/images/queries";
export * from "./entities/images/tables";
export * from "./entities/reaction/tables";

const sqliteClient = new Database("./app.db");
export const db = drizzle(sqliteClient);
