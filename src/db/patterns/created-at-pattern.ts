import { integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const createdAtPattern = {
  forTable() {
    return {
      createdAt: integer("created_at", { mode: "timestamp_ms" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    };
  },
};
