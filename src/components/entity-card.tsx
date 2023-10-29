import { Card, CardSection, Group, Stack, Text } from "@mantine/core";
import { RelativeTimestamp } from "@/components/relative-timestamp";
import { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<{
  header?: ReactNode;
  footer?: ReactNode;
}>;

export function EntityCardHeader(props: {
  title: string;
  time?: Date | null;
  badge?: ReactNode;
  image?: ReactNode;
}) {
  return (
    <>
      {props.image != null && (
        <CardSection inheritPadding={false}>{props.image}</CardSection>
      )}
      <Stack gap={2}>
        <Text fz="lg" fw={500} truncate>
          {props.title}
        </Text>

        <Group justify="space-between">
          {props.time != null && (
            <Text size="xs" c="dimmed">
              Created <RelativeTimestamp>{props.time}</RelativeTimestamp> ago
            </Text>
          )}

          {props.badge}
        </Group>
      </Stack>
    </>
  );
}

export function EntityCardFooter(props: PropsWithChildren<{}>) {
  return (
    <Group mt="xs" justify="end" gap={4}>
      {props.children}
    </Group>
  );
}

export function EntityCard(props: Props) {
  return (
    <Card withBorder radius="md" px="md" pb="md">
      <Stack gap={16}>
        {props.header}

        {props.children}

        {props.footer}
      </Stack>
    </Card>
  );
}
