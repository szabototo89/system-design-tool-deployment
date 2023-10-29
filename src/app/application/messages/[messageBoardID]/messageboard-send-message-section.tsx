import { Button, FileInput, Stack, Textarea } from "@mantine/core";
import React from "react";
import { createMessage } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { zfd } from "zod-form-data";
import { MessageBoard } from "@/db/schemas/messageBoards.schema";
import {
  createImageFromFile,
  SupportedImageFileSchema,
} from "@/db/entities/images/actions";

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

    const imageFile = SupportedImageFileSchema.nullable().parse(data.image);
    const image =
      imageFile != null ? await createImageFromFile(imageFile) : null;

    await createMessage({
      content: data.content,
      messageBoard: props.messageBoard,
      image,
    });

    revalidatePath(`/messages/${props.messageBoard.id}/page`);
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
