import { Button, Container, Title, Text, Flex, Image } from "@mantine/core";

import { MessageBoard } from "@/db/entities/message-boards/types";
import { NextImage } from "@/components/next-image";
import { messageBoardQuery } from "@/db/entities/message-boards/queries";
import { ActionButton } from "@/components/action-button";
import { messageBoardAction } from "@/db/entities/message-boards/actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { imagesQuery } from "@/db/entities/images/queries";

type Props = { messageBoard: MessageBoard };

function isMessageBoardDraft(messageBoard: MessageBoard) {
  return messageBoard.status === "draft";
}

export async function MessageboardHeroHeader(props: Props) {
  const headerImage = await messageBoardQuery.queryImage(props.messageBoard);

  return (
    <Container size={1400}>
      <Flex direction="column" align="center" gap="md">
        {headerImage != null && (
          <Image
            component={NextImage}
            height={180}
            width={640}
            src={imagesQuery.getImageSrc(headerImage)}
            alt="Message board header image"
          />
        )}
        <Title>{props.messageBoard.title}</Title>

        <Container p={0} size={600}>
          <Text size="lg" c="dimmed">
            {props.messageBoard.description}
          </Text>
        </Container>

        {isMessageBoardDraft(props.messageBoard) && (
          <Flex direction="row" gap="md">
            <ActionButton
              size="md"
              variant="default"
              color="gray"
              onClick={async () => {
                "use server";

                await messageBoardAction.delete(props.messageBoard);

                redirect("/application/");
              }}
            >
              Delete
            </ActionButton>
            <ActionButton
              onClick={async () => {
                "use server";

                await messageBoardAction.publishMessageBoard(
                  props.messageBoard,
                );

                revalidatePath(
                  `/application/messages/${props.messageBoard.id}/`,
                );
              }}
              size="md"
            >
              Publish
            </ActionButton>
          </Flex>
        )}
      </Flex>
    </Container>
  );
}
