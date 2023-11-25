import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { ReactionTable } from "./tables";
import { createdByUserPattern } from "../../patterns/created-by-user-pattern";

export const ReactionSchema = createSelectSchema(ReactionTable, {
  id: (schema) => schema.id.brand<"ReactionID">(),
  type: z.enum(["like"]),
  ...createdByUserPattern.forSchema(),
});

export const ReactionIDSchema = ReactionSchema.shape.id;

export type Reaction = z.infer<typeof ReactionSchema>;
