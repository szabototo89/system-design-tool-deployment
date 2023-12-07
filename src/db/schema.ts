import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { SystemElement } from "./entities/system-element/schema";
import { SystemElementRelation } from "./entities/system-element-relation.schema";

export * from "./entities/message-boards/table";
export * from "./entities/message-boards/types";
export * from "./entities/message-boards/queries";
export * from "./entities/messages/tables";
export * from "./entities/messages/types";
export * from "./entities/messages/queries";
export * from "./entities/reaction/tables";
export * from "./entities/users/tables";
export * from "./entities/images/entity";

export const SystemElementTable = SystemElement.table;
export const SystemElementRelationTable = SystemElementRelation.table;

const sqliteClient = new Database("./app.db");
export const db = drizzle(sqliteClient);
