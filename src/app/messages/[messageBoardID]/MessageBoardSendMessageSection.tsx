import { Button, Stack, TextInput } from "@mantine/core";
import React from "react";
import { db, MessageBoard, Messages } from "@/db/schema";
import { sql } from "drizzle-orm";
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
        <TextInput
          label="Message"
          placeholder="Leave a message here ..."
          name="content"
        />
        <Button type="submit">Send message</Button>
      </Stack>
    </form>
  );
}
