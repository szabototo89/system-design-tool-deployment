import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
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

const sqliteClient = createClient({
  // url: "file:app.db",
  url: "libsql://system-design-tool-szabototo89.turso.io",
  authToken:
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIyMDI0LTAxLTE4VDIxOjA4OjQwLjYyMDM5NjA0NFoiLCJpZCI6ImU3NWJhY2NmLWFkNmEtMTFlZS04NDljLWRlNTQ3NWY0NjQ5ZiJ9.3neUySc9F_Kv9q1gKXD2kdFjcYGyWxBOWVIj1nlirKw2wViTre8PZviRTVs78I5ZLrwrRzdCQMGk524TKBWqAw",
});

export const db = drizzle(sqliteClient);

export type DrizzleDatabase = typeof db;
