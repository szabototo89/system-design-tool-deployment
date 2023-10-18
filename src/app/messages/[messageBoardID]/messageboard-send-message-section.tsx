import {
  Button,
  Center,
  Stack,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import React from "react";
import { db } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { zfd } from "zod-form-data";
import { MessageBoard } from "@/db/schemas/messageBoards.schema";
import { Messages } from "@/db/schemas/messages.schema";

type Props = {
  messageBoard: MessageBoard;
};

const SendMessageFormDataSchema = zfd.formData({
  content: zfd.text(),
});

export function MessageboardSendMessageSection(props: Props) {
  const sendMessage = async (formData: FormData) => {
    "use server";
    const data = SendMessageFormDataSchema.parse(formData);

    await db.insert(Messages).values({
      content: data.content,
      messageBoardID: props.messageBoard.id,
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
        <Stack align="end">
          <Button type="submit">Send message</Button>
        </Stack>
      </Stack>
    </form>
  );
}
