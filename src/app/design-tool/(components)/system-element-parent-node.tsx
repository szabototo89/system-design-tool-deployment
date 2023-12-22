import { Badge, Card, Group, Text } from "@mantine/core";
import { NodeResizer, useNodeId } from "reactflow";
import { useQuerySystemElementByID } from "./system-element-hooks";
import { SystemElementIDSchema } from "@/db/entities/system-element/schema";

export function SystemElementParentNode(props: { selected: boolean }) {
  const id = useNodeId();
  const systemElement = useQuerySystemElementByID(
    SystemElementIDSchema.parse(id),
  );

  if (systemElement.isLoading) {
    return null;
  }

  return (
    <>
      <NodeResizer isVisible={props.selected} minWidth={100} minHeight={30} />
      <Card
        padding="md"
        radius="md"
        w={"100%"}
        h={"100%"}
        withBorder
        style={{
          borderStyle: "dashed",
          borderWidth: "3px",
          backgroundColor: "rgba(255, 255, 255, 0.25)",
        }}
      >
        <Group gap="sm" align="flex-end" justify="flex-start" h={"100%"}>
          <Text size="xs" fw={500}>
            {systemElement.data?.name}
          </Text>
          <Badge size="xs" variant="light">
            {systemElement.data?.type}
          </Badge>
        </Group>
      </Card>
    </>
  );
}
