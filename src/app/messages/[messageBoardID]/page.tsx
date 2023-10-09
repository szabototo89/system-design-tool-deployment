import { db, MessageBoard, MessageBoards, Messages } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { MessageBoardHeroHeader } from "@/app/messages/[messageBoardID]/MessageBoardHeroHeader";
import { MessageCard } from "@/app/messages/[messageBoardID]/MessageCard";
import { Button, Flex, Stack, TextInput } from "@mantine/core";
import React from "react";
import { MessageBoardSendMessageSection } from "@/app/messages/[messageBoardID]/MessageBoardSendMessageSection";

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
      <MessageBoardSendMessageSection messageBoard={messageBoard} />

      {messages.map((message) => (
        <MessageCard key={message.id} message={message} />
      ))}
    </Stack>
  );
}
