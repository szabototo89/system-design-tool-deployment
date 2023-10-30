import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { MessageBoards } from "./table";

export const messageBoardStatusList = ["draft", "published"] as const;
export const MessageBoardSchema = createSelectSchema(MessageBoards, {
  id: z.coerce.number().brand<"MessageBoardID">(),
  status: z.enum(messageBoardStatusList),
});
export type MessageBoard = z.infer<typeof MessageBoardSchema>;
export const messageBoardID = MessageBoardSchema.shape.id.parse;
