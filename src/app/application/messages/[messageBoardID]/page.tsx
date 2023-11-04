import { Divider, SimpleGrid, Stack } from "@mantine/core";
import React from "react";
import { MessageboardHeroHeader } from "@/app/application/messages/[messageBoardID]/messageboard-hero-header";
import { MessageboardSendMessageSection } from "@/app/application/messages/[messageBoardID]/messageboard-send-message-section";
import { MessageCard } from "@/app/application/messages/[messageBoardID]/message-card";
import { messageBoardQuery } from "@/db/entities/message-boards/queries";
import { MessageBoard } from "@/db/entities/message-boards/types";
import { messageQuery } from "@/db/entities/messages/queries";
import { withComponentLogger } from "@/logging/logger";

type Props = {
  params: { messageBoardID: MessageBoard["id"] };
};

async function MessageboardDetailsPage(props: Props) {
  const messageBoard = await messageBoardQuery.queryBy({
    id: props.params.messageBoardID,
  });

  if (messageBoard == null) {
    throw new Error("Requested message board cannot be loaded.");
  }

  const messages = await messageQuery.queryFromMessageBoard(messageBoard);

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

export default withComponentLogger(MessageboardDetailsPage);
