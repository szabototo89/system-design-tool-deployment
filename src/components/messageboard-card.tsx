import { Badge, Button, Card, Group, Text } from "@mantine/core";
import { MessageBoard } from "@/db/schemas/messageBoards.schema";
import { RelativeTimestamp } from "@/components/relative-timestamp";

type Props = { messageBoard: MessageBoard };

function MessageBoardStatusBadge(props: {
  messageBoard: Pick<MessageBoard, "status">;
}) {
  const color = props.messageBoard.status === "draft" ? "yellow" : "green";

  return (
    <Badge size="sm" variant="light" color={color}>
      {props.messageBoard.status}
    </Badge>
  );
}

export function MessageBoardCard(props: Props) {
  return (
    <Card withBorder radius="md" p="md">
      <Text fz="lg" fw={500} truncate>
        {props.messageBoard.title}
      </Text>

      <Group justify="space-between">
        <Text size="xs" c="dimmed">
          Created{" "}
          <RelativeTimestamp>{props.messageBoard.createdAt}</RelativeTimestamp>{" "}
          ago
        </Text>

        <MessageBoardStatusBadge messageBoard={props.messageBoard} />
      </Group>

      <Text
        fz="sm"
        mt="xs"
        lineClamp={3}
        title={props.messageBoard.description ?? ""}
        style={{ flex: 1 }}
      >
        {props.messageBoard.description}
      </Text>

      <Group mt="xs" justify="end" gap={4}>
        <Button
          component="a"
          radius="md"
          href={`application/messages/${props.messageBoard.id}`}
        >
          Show details
        </Button>
      </Group>
    </Card>
  );
}
