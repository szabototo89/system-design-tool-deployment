import { SystemElement } from "@/db/entities/system-element/schema";
import { Card, Group, Text, CardSection, Button, Stack } from "@mantine/core";
import { SystemElementTypeBadge } from "../../../../(components)/system-element-type-badge";
import Link from "next/link";

type Props = { systemElement: SystemElement };

export function SystemElementCardItem(props: Props) {
  return (
    <Card
      component={Link}
      href={"/design-tool/elements/" + props.systemElement.id}
      target="_blank"
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
    >
      <CardSection inheritPadding>
        <Group justify="space-between" mb="md">
          <Group gap={4} align="baseline">
            <Text fw={500} inline>
              {props.systemElement.name}
            </Text>
          </Group>

          <SystemElementTypeBadge
            size="md"
            systemElement={props.systemElement}
          />
        </Group>
      </CardSection>

      <Stack h="100%" justify="space-between">
        <Text size="sm" c="dimmed" lineClamp={4}>
          {props.systemElement.description}
        </Text>
      </Stack>
    </Card>
  );
}
