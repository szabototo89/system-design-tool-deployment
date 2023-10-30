import { Button, Container, Title, Text, Flex, Image } from "@mantine/core";

import { MessageBoard } from "@/db/entities/message-boards/types";
import { NextImage } from "@/components/next-image";
import { messageBoardQuery } from "@/db/entities/message-boards/queries";

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
            src={headerImage.imageSrc()}
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
            <Button size="md" variant="default" color="gray">
              Delete
            </Button>
            <Button size="md">Publish</Button>
          </Flex>
        )}
      </Flex>
    </Container>
  );
}
