import { createSelectSchema } from "drizzle-zod";
import { MessagesTable } from "../messages/tables";
import { imagesQuery } from "../images/queries";
import { imageID } from "../images/types";
import { z } from "zod";

export const MessageSchema = createSelectSchema(MessagesTable, {
  id: (schema) => schema.id.brand<"MessageID">(),
}).transform((message) => {
  return {
    ...message,
    image() {
      if (message.imageID == null) {
        return null;
      }

      return imagesQuery.queryByID(imageID(message.imageID));
    },
  };
});

export type Message = z.infer<typeof MessageSchema>;
