import { SystemElementIDSchema } from "@/db/entities/system-element/schema";
import { systemElementQueryById } from "@/db/entities/system-element/server-actions";
import { systemTechnologyQueryAll } from "@/db/entities/system-technology/server-actions";
import { Badge, Card, Group, HoverCard, Text } from "@mantine/core";
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
      <Card shadow="sm" padding="md" radius="md" withBorder maw={300}>
        <Card.Section inheritPadding>
          <Group justify="space-between" mt="md" mb="md">
            <Text size="xs" fw={500}>
              {systemElement.data?.name}
            </Text>
            <Badge size="xs" variant="light">
              {systemElement.data?.type}
            </Badge>
          </Group>
        </Card.Section>

        <Text size="xs" c="dimmed" lineClamp={4}>
          {systemElement.data?.description}
        </Text>

        <Group mt="md" gap={2}>
          {systemElement.data?.technologies.map((technology) => (
            <HoverCard
              width={280}
              shadow="md"
              key={technology.id}
              openDelay={1000}
            >
              <HoverCard.Target>
                <Badge size="xs" variant="white">
                  {technology.name}
                </Badge>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <Text>{technology.name}</Text>
                <Text size="xs">{technology.description}</Text>
              </HoverCard.Dropdown>
            </HoverCard>
          ))}
        </Group>
      </Card>
      <>
        <Handle position={Position.Top} type="target" />
        <Handle position={Position.Bottom} type="source" />
      </>
    </>
  );
}
