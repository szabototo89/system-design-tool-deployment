import { db, MessageSchema } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Divider, SimpleGrid, Stack, Title } from "@mantine/core";
import React from "react";
import { Messages } from "@/db/schemas/messages.schema";
import { z } from "zod";
import { MessageboardHeroHeader } from "@/app/application/messages/[messageBoardID]/messageboard-hero-header";
import { MessageboardSendMessageSection } from "@/app/application/messages/[messageBoardID]/messageboard-send-message-section";
import { MessageCard } from "@/app/application/messages/[messageBoardID]/message-card";
import { queryMessageBoardBy } from "@/db/entities/message-boards/queries";
import { MessageBoard } from "@/db/entities/message-boards/types";

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

      <Divider labelPosition="center" label="Messages" />

      <SimpleGrid cols={3}>
        {messages.map((message) => (
          <MessageCard key={message.id} message={message} />
        ))}
      </SimpleGrid>

      <Divider labelPosition="center" label="Leave your message below" />

      <MessageboardSendMessageSection messageBoard={messageBoard} />
    </Stack>
  );
}
