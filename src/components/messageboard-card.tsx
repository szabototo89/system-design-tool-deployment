import { Badge, Button, Card, CardSection, Group, Text } from "@mantine/core";
import { db } from "@/db/schema";
import { MessageBoard, MessageBoards } from "@/db/schemas/messageBoards.schema";

type Props = { messageBoard: MessageBoard };

export function MessageBoardCard(props: Props) {
  return (
    <Card withBorder radius="md" p="md">
      <CardSection>
        {/*<Image src={image} alt={title} height={180} />*/}
      </CardSection>

      <CardSection mt="md">
        <Group justify="apart">
          <Text fz="lg" fw={500}>
            {props.messageBoard.title}
          </Text>
          <Badge size="sm" variant="light">
            {props.messageBoard.status}
          </Badge>
        </Group>
        <Text fz="sm" mt="xs">
          {props.messageBoard.description}
        </Text>
      </CardSection>

      {/*<CardSection>*/}
      {/*  <Text mt="md" c="dimmed">*/}
      {/*    Perfect for you, if you enjoy*/}
      {/*  </Text>*/}
      {/*  <Group gap={7} mt={5}>*/}
      {/*    {features}*/}
      {/*  </Group>*/}
      {/*</CardSection>*/}

      <Group mt="xs">
        <Button
          radius="md"
          style={{ flex: 1 }}
          component="a"
          href={`/messages/${props.messageBoard.id}`}
        >
          Show details
        </Button>
      </Group>
    </Card>
  );
}
