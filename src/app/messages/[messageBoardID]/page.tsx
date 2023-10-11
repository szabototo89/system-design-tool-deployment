import { db, MessageBoardSchema, MessageSelectSchema } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { MessageBoardHeroHeader } from "@/app/messages/[messageBoardID]/MessageBoardHeroHeader";
import { MessageCard } from "@/app/messages/[messageBoardID]/MessageCard";
import { SimpleGrid, Stack, Title } from "@mantine/core";
import React from "react";
import { MessageBoardSendMessageSection } from "@/app/messages/[messageBoardID]/MessageBoardSendMessageSection";
import { MessageBoard, MessageBoards } from "@/db/schemas/messageBoards.schema";
import { Messages } from "@/db/schemas/messages.schema";
import { z } from "zod";

type Props = {
  params: { messageBoardID: MessageBoard["id"] };
};

export default async function MessageBoardDetailsPage(props: Props) {
  const [messageBoardFromDb] = await db
    .select()
    .from(MessageBoards)
    .where(eq(MessageBoards.id, props.params.messageBoardID));

  const messageBoard = MessageBoardSchema.nullable().parse(messageBoardFromDb);

  if (messageBoard == null) {
    throw new Error("Requested message board cannot be loaded.");
  }

  const messagesFromDb = await db
    .select()
    .from(Messages)
    .where(eq(Messages.messageBoardID, messageBoard.id))
    .orderBy(desc(Messages.createdAt));

  const messages = z.array(MessageSelectSchema).parse(messagesFromDb);

  return (
    <Stack>
      <MessageBoardHeroHeader messageBoard={messageBoard} />

      <Title order={2}>Leave your message</Title>
      <MessageBoardSendMessageSection messageBoard={messageBoard} />

      <Title order={2}>Messages</Title>
      <SimpleGrid cols={3}>
        {messages.map((message) => (
          <MessageCard key={message.id} message={message} />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
