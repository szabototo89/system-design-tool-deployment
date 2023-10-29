import {
  Button,
  Center,
  FileInput,
  Stack,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import React from "react";
import { db, Images, ImageSchema } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { zfd } from "zod-form-data";
import { MessageBoard } from "@/db/schemas/messageBoards.schema";
import { Messages } from "@/db/schemas/messages.schema";

type Props = {
  messageBoard: MessageBoard;
};

const SendMessageFormDataSchema = zfd.formData({
  content: zfd.text(),
  image: zfd.file().nullable(),
});

export function MessageboardSendMessageSection(props: Props) {
  const sendMessage = async (formData: FormData) => {
    "use server";
    const data = SendMessageFormDataSchema.parse(formData);

    async function insertImage(imageFile: File | null) {
      if (imageFile == null) {
        return null;
      }

      const [image] = await db
        .insert(Images)
        .values({
          fileName: imageFile.name,
          fileContent: new Uint8Array(await imageFile.arrayBuffer()),
        })
        .returning();

      return ImageSchema.parse(image);
    }

    const image = await insertImage(data.image);

    await db.insert(Messages).values({
      content: data.content,
      messageBoardID: props.messageBoard.id,
      imageID: image.id,
    });

    revalidatePath("/messages/[messageBoardID]/page");
  };

  return (
    <form action={sendMessage}>
      <Stack>
        <Textarea
          label="Message"
          placeholder="Leave a message here ..."
          name="content"
        />
        <FileInput
          name="image"
          label="Image"
          placeholder="Click to upload an image"
          accept="image/png,image/jpeg"
        />
        <Stack align="end">
          <Button type="submit">Send message</Button>
        </Stack>
      </Stack>
    </form>
  );
}
