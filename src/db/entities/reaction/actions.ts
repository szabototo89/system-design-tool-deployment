import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { db as appDb, DrizzleDatabase, ReactionTable } from "@/db/schema";
import { Reaction, ReactionSchema } from "./types";
import { and, eq } from "drizzle-orm";
import { UserContext } from "@/app/api/auth/[...nextauth]/auth-options";

export const reactionAction = {
  async create(
    userContext: UserContext,
    sourceID: Reaction["sourceID"],
    sourceType: Reaction["sourceType"],
    db: DrizzleDatabase = appDb,
  ) {
    const [reaction] = await db
      .insert(ReactionTable)
      .values({
        type: "like",
        createdBy: userContext.user().id,
        sourceID,
        sourceType,
      })
      .returning();

    return ReactionSchema.parse(reaction);
  },

  async delete(reaction: Pick<Reaction, "id">, db: DrizzleDatabase = appDb) {
    const [deletedReaction] = await db
      .delete(ReactionTable)
      .where(eq(ReactionTable.id, reaction.id))
      .returning();

    return ReactionSchema.parse(deletedReaction);
  },
};
