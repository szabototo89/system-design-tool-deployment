import { db, queryMessageBoardBy, MessageSchema } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { SimpleGrid, Stack, Title } from "@mantine/core";
import React from "react";
import { MessageBoard } from "@/db/schemas/messageBoards.schema";
import { Messages } from "@/db/schemas/messages.schema";
import { z } from "zod";
import { MessageboardHeroHeader } from "@/app/application/messages/[messageBoardID]/messageboard-hero-header";
import { MessageboardSendMessageSection } from "@/app/application/messages/[messageBoardID]/messageboard-send-message-section";
import { MessageCard } from "@/app/application/messages/[messageBoardID]/message-card";

type Props = {
  params: { messageBoardID: MessageBoard["id"] };
};

export default async function MessageboardDetailsPage(props: Props) {
  const messageBoard = await queryMessageBoardBy({
    id: props.params.messageBoardID,
  });

  if (messageBoard == null) {
    throw new Error("Requested message board cannot be loaded.");
  }

  const messagesFromDb = await db
    .select()
    .from(Messages)
    .where(eq(Messages.messageBoardID, messageBoard.id))
    .orderBy(desc(Messages.createdAt));

  const messages = z.array(MessageSchema).parse(messagesFromDb);

  return (
    <Stack>
      <MessageboardHeroHeader messageBoard={messageBoard} />

      <Title order={2}>Leave your message</Title>
      <MessageboardSendMessageSection messageBoard={messageBoard} />

      <Title order={2}>Messages</Title>
      <SimpleGrid cols={3}>
        {messages.map((message) => (
          <MessageCard key={message.id} message={message} />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
