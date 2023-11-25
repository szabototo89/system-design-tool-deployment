import { createSelectSchema } from "drizzle-zod";
import { MessagesTable } from "../messages/tables";
import { ImageSchema } from "../images/types";
import { z } from "zod";
import { createdByUserPattern } from "../../patterns/created-by-user-pattern";

export const MessageSchema = createSelectSchema(MessagesTable, {
  id: (schema) => schema.id.brand<"MessageID">(),
  imageID: ImageSchema.shape.id,
  ...createdByUserPattern.forSchema(),
});

export type Message = z.infer<typeof MessageSchema>;
