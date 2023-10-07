import { db, MessageBoard, MessageBoards, Messages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { MessageBoardHeroHeader } from "@/app/messages/[messageBoardID]/MessageBoardHeroHeader";
import { MessageCard } from "@/app/messages/[messageBoardID]/MessageCard";
import { Button, Flex, Stack, TextInput } from "@mantine/core";
import React from "react";

type Props = {
  params: { messageBoardID: MessageBoard["id"] };
};

export default async function MessageBoardDetailsPage(props: Props) {
  const [messageBoard] = await db
    .select()
    .from(MessageBoards)
    .where(eq(MessageBoards.id, props.params.messageBoardID));

  if (messageBoard == null) {
    throw new Error("Requested message board cannot be loaded.");
  }

  const messages = await db
    .select()
    .from(Messages)
    .where(eq(Messages.messageBoardID, messageBoard.id));

  return (
    <Stack>
      <MessageBoardHeroHeader messageBoard={messageBoard} />

      <Stack>
        <TextInput label="Message" placeholder="Leave a message here ..." />
        <Button>Send message</Button>
      </Stack>

      {messages.map((message) => (
        <MessageCard key={message.id} message={message} />
      ))}
    </Stack>
  );
}
