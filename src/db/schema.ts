import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { SystemElementEntity } from "./entities/system-element/schema";
import { SystemElementRelationEntity } from "./entities/system-element-relation/schema";

export * from "./entities/message-boards/table";
export * from "./entities/message-boards/types";
export * from "./entities/message-boards/queries";
export * from "./entities/messages/tables";
export * from "./entities/messages/types";
export * from "./entities/messages/queries";
export * from "./entities/reaction/tables";
export * from "./entities/users/tables";
export * from "./entities/images/entity";

export const SystemElementTable = SystemElementEntity.table;
export const SystemElementRelationTable = SystemElementRelationEntity.table;

const sqliteClient = new Database("./app.db", { verbose: console.log });
export const db = drizzle(sqliteClient);
