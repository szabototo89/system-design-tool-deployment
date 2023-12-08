import { db } from "@/db/schema";
import { sql } from "drizzle-orm";
import { SystemElementRelationEntity } from "@/db/entities/system-element-relation.schema";
import { getTableConfig } from "drizzle-orm/sqlite-core";

const { name, columns } = getTableConfig(SystemElementRelationEntity.table);

console.clear();

db.run(
  sql.raw(`
    DROP TABLE IF EXISTS ${name};
`),
);

db.run(
  sql.raw(`
    CREATE TABLE IF NOT EXISTS ${name} (
      id TEXT PRIMARY KEY,
      label TEXT,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      created_at INTEGER DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `),
);
