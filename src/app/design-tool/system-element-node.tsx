import { SystemElementIDSchema } from "@/db/entities/system-element/schema";
import { systemElementQueryById } from "@/db/entities/system-element/server-actions";
import { Badge, Card, Group, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Handle, Position, useNodeId } from "reactflow";

export function SystemElementNode() {
  const id = useNodeId();
  const systemElement = useQuery({
    queryKey: ["system-element", { id }],
    queryFn() {
      return systemElementQueryById({
        id: SystemElementIDSchema.parse(id),
      });
    },
  });

  if (systemElement.isLoading) {
    return null;
  }

  return (
    <>
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Card.Section inheritPadding>
          <Group justify="space-between" mt="md" mb="md">
            <Text size="sm" fw={500}>
              {systemElement.data?.name}
            </Text>
            <Badge size="sm" variant="light">
              {systemElement.data?.type}
            </Badge>
          </Group>
        </Card.Section>

        <Text size="sm" c="dimmed">
          {systemElement.data?.description}
        </Text>
      </Card>
      <>
        <Handle position={Position.Top} type="target" />
        <Handle position={Position.Bottom} type="source" />
      </>
    </>
  );
}
