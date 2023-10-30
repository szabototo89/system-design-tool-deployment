import { createSelectSchema } from "drizzle-zod";
import { MessagesTable } from "../messages/tables";
import { imagesQuery } from "../images/queries";
import { imageID, ImageSchema } from "../images/types";
import { z } from "zod";

export const MessageSchema = createSelectSchema(MessagesTable, {
  id: (schema) => schema.id.brand<"MessageID">(),
  imageID: ImageSchema.shape.id,
});

export type Message = z.infer<typeof MessageSchema>;
