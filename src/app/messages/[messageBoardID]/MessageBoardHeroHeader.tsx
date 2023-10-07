import { MessageBoard } from "@/db/schema";
import { Button, Container, Title, Text, Flex } from "@mantine/core";

type Props = { messageBoard: MessageBoard };

function isMessageBoardDraft(messageBoard: MessageBoard) {
  return messageBoard.status === "draft";
}

export function MessageBoardHeroHeader(props: Props) {
  return (
    <Container size={1400}>
      <Flex direction="column" align="center" gap="md">
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
