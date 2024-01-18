import { Reaction, ReactionSchema } from "./types";
import { db as appDb, DrizzleDatabase } from "../../schema";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { ReactionTable } from "./tables";

export const reactionQuery = {
  async queryByIDs(ids: Reaction["id"][], db: DrizzleDatabase = appDb) {
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
    db: DrizzleDatabase = appDb,
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
