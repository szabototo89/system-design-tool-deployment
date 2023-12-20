import { db } from "@/db/schema";
import { sql } from "drizzle-orm";
import { SystemElementRelationEntity } from "@/db/entities/system-element-relation/schema";
import { getTableConfig } from "drizzle-orm/sqlite-core";

const { name, columns } = getTableConfig(SystemElementRelationEntity.table);

console.clear();

// db.run(
//   sql.raw(`
//     DROP TABLE IF EXISTS ${name};
// `),
// );

// db.run(
//   sql.raw(`
//     CREATE TABLE IF NOT EXISTS ${name} (
//       id TEXT PRIMARY KEY,
//       label TEXT,
//       source_id TEXT NOT NULL,
//       target_id TEXT NOT NULL,
//       created_at INTEGER DEFAULT CURRENT_TIMESTAMP NOT NULL
//     );
//   `),
// );

db.run(
  sql.raw(`
    DROP TABLE IF EXISTS system_element__system_technology;
  `),
);

db.run(
  sql.raw(`
    CREATE TABLE IF NOT EXISTS system_element__system_technology (
      system_element_id NOT NULL,
      system_technology_id TEXT NOT NULL
    );
  `),
);
