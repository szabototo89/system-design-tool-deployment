import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { MessageBoardTable } from "./table";
import { createdByUserPattern } from "../../patterns/created-by-user-pattern";
import { ImageIDSchema } from "../images/entity";

export const messageBoardStatusList = ["draft", "published"] as const;
export const MessageBoardSchema = createSelectSchema(MessageBoardTable, {
  id: z.coerce.number().brand<"MessageBoardID">(),
  status: z.enum(messageBoardStatusList),
  imageID: ImageIDSchema.nullable(),
  ...createdByUserPattern.forSchema(),
});

export type MessageBoard = z.infer<typeof MessageBoardSchema>;

export const messageBoardID = MessageBoardSchema.shape.id.parse;
