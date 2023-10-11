import {
  Button,
  Center,
  Stack,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import React from "react";
import { db, MessageBoard, Messages } from "@/db/schema";
import { revalidatePath } from "next/cache";

type Props = {
  messageBoard: MessageBoard;
};

export function MessageBoardSendMessageSection(props: Props) {
  const sendMessage = async (formData: FormData) => {
    "use server";

    const content = formData.get("content") as string;

    await db.insert(Messages).values({
      content,
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
