import { Reaction, ReactionSchema } from "./types";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { db as appDb, ReactionTable } from "../../schema";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";

export const reactionQuery = {
  async queryByIDs(ids: Reaction["id"][], db: BetterSQLite3Database = appDb) {
    if (ids.length === 0) {
      return [];
    }

    const reactions = await db
      .select()
      .from(ReactionTable)
      .where(inArray(ReactionTable.id, ids));

    return z.array(ReactionSchema).parse(reactions);
  },

  async queryAllFromSource(
    sourceID: Reaction["sourceID"],
    sourceType: Reaction["sourceType"],
    db: BetterSQLite3Database = appDb,
  ) {
    const reactions = await db
      .select()
      .from(ReactionTable)
      .where(
        and(
          eq(ReactionTable.sourceID, sourceID),
          eq(ReactionTable.sourceType, sourceType),
        ),
      );

    return z.array(ReactionSchema).parse(reactions);
  },
};
