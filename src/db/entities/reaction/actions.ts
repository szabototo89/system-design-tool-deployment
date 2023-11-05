import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { db as appDb, ReactionTable } from "@/db/schema";
import { Reaction, ReactionSchema } from "./types";
import { eq } from "drizzle-orm";

export const reactionAction = {
  async create(db: BetterSQLite3Database = appDb) {
    const [reaction] = await db
      .insert(ReactionTable)
      .values({
        type: "like",
      })
      .returning();

    return ReactionSchema.parse(reaction);
  },

  async delete(
    reaction: Pick<Reaction, "id">,
    db: BetterSQLite3Database = appDb,
  ) {
    const [deletedReaction] = await db
      .delete(ReactionTable)
      .where(eq(ReactionTable.id, reaction.id))
      .returning();

    return ReactionSchema.parse(deletedReaction);
  },
};
