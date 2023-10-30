import { Button, FileInput, Stack, Textarea } from "@mantine/core";
import React from "react";
import { revalidatePath } from "next/cache";
import { zfd } from "zod-form-data";
import { imagesAction } from "@/db/entities/images/actions";

import { MessageBoard } from "@/db/entities/message-boards/types";
import { createMessage, messageAction } from "@/db/entities/messages/actions";

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

    const image =
      data.image != null ? await imagesAction.createFromFile(data.image) : null;

    await messageAction.create({
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
          placeholder="Type your message..."
          description="Write your message here. Share thoughts, greetings, or information with others."
          name="content"
        />
        <FileInput
          name="image"
          label="Upload Picture"
          description="You can include a picture along with your message. Accepted file types: .jpg, .png, .jpeg. Max file size: 5MB."
          placeholder="Choose file ..."
          accept="image/png,image/jpg,image/jpeg"
        />
        <Stack align="end">
          <Button type="submit">Send message</Button>
        </Stack>
      </Stack>
    </form>
  );
}
