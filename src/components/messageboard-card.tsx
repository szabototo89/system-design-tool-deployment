import { Badge, Button, Card, Group, Image, Text } from "@mantine/core";
import { RelativeTimestamp } from "@/components/relative-timestamp";

import { MessageBoard } from "@/db/entities/message-boards/types";
import { NextImage } from "@/components/next-image";
import { messageBoardQuery } from "@/db/entities/message-boards/queries";
import { imageQuery } from "@/db/entities/images/entity";

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

export async function MessageBoardCard(props: Props) {
  const image = await messageBoardQuery.queryImage(props.messageBoard);

  return (
    <Card withBorder radius="md" p="md">
      {image != null && (
        <Image
          component={NextImage}
          src={await imageQuery.getImageSrc(image)}
          alt="Message board header image"
          width={640}
          height={180}
        />
      )}

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
