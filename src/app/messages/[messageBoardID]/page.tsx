import { db, MessageBoard, MessageBoards, Messages } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { MessageBoardHeroHeader } from "@/app/messages/[messageBoardID]/MessageBoardHeroHeader";
import { MessageCard } from "@/app/messages/[messageBoardID]/MessageCard";
import { SimpleGrid, Stack, Title } from "@mantine/core";
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
    .where(eq(Messages.messageBoardID, messageBoard.id))
    .orderBy(desc(Messages.createdAt));

  // const deleteMessage = async (message: Message) => {
  //   "use server";
  //
  //   await db.delete(Messages).where(eq(Messages.id, message.id));
  //
  //   revalidatePath("/messages/[messageBoardID]/page");
  // };

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
