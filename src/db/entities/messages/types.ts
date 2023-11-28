import { createSelectSchema } from "drizzle-zod";
import { MessageTable } from "../messages/tables";
import { ImageSchema } from "../images/types";
import { z } from "zod";
import { createdByUserPattern } from "../../patterns/created-by-user-pattern";

export const MessageSchema = createSelectSchema(MessageTable, {
  id: (schema) => schema.id.brand<"MessageID">(),
  imageID: ImageSchema.shape.id,
  ...createdByUserPattern.forSchema(),
});

export type Message = z.infer<typeof MessageSchema>;
