import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { MessageBoards } from "./table";
import { ImageIDSchema } from "../images/types";
import { imagesQuery } from "../images/queries";

export const messageBoardStatusList = ["draft", "published"] as const;
export const MessageBoardSchema = createSelectSchema(MessageBoards, {
  id: z.coerce.number().brand<"MessageBoardID">(),
  status: z.enum(messageBoardStatusList),
  imageID: ImageIDSchema.nullable(),
}).transform((messageBoard) => {
  return {
    ...messageBoard,
    image() {
      if (messageBoard.imageID == null) {
        return null;
      }

      return imagesQuery.queryByID(messageBoard.imageID);
    },
  };
});

export type MessageBoard = z.infer<typeof MessageBoardSchema>;

export const messageBoardID = MessageBoardSchema.innerType().shape.id.parse;
