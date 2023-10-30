import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { MessageBoardsTable } from "./table";
import { ImageIDSchema } from "../images/types";

export const messageBoardStatusList = ["draft", "published"] as const;
export const MessageBoardSchema = createSelectSchema(MessageBoardsTable, {
  id: z.coerce.number().brand<"MessageBoardID">(),
  status: z.enum(messageBoardStatusList),
  imageID: ImageIDSchema.nullable(),
});

export type MessageBoard = z.infer<typeof MessageBoardSchema>;

export const messageBoardID = MessageBoardSchema.shape.id.parse;
