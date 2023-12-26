import { Badge, Button, Card, Group, Text, Tooltip } from "@mantine/core";
import { NodeProps, NodeResizer, useNodeId } from "reactflow";
import { useQuerySystemElementByID } from "./system-element-hooks";
import { SystemElementIDSchema } from "@/db/entities/system-element/schema";
import { useExpandedGraphElements } from "../app-state";

export function SystemElementParentNode(props: NodeProps) {
  const id = SystemElementIDSchema.parse(useNodeId());
  const systemElement = useQuerySystemElementByID(id);
  const setExpanded = useExpandedGraphElements();

  if (systemElement.isLoading) {
    return null;
  }

  const childrenCount = systemElement.data?.children.length ?? 0;

  return (
    <>
      <NodeResizer isVisible={props.selected} minWidth={300} minHeight={300} />
      <Card
        padding="md"
        radius="md"
        w={"100%"}
        h={"100%"}
        miw={300}
        mih={300}
        withBorder
        style={{
          borderStyle: "dashed",
          borderWidth: "3px",
          backgroundColor: "rgba(255, 255, 255, 0.25)",
        }}
      >
        <Group gap="sm" align="flex-end" justify="flex-start" h={"100%"}>
          <Group gap={4} align="baseline">
            <Text size="xs" fw={500}>
              {systemElement.data?.name}
            </Text>
            {childrenCount > 0 && (
              <Tooltip label="Number of children" openDelay={1000}>
                <Text size="xs" c="dimmed">
                  ({childrenCount})
                </Text>
              </Tooltip>
            )}
          </Group>
          <Badge size="xs" variant="light">
            {systemElement.data?.type}
          </Badge>
        </Group>
        {props.selected && (
          <Card.Section>
            <Group justify="end">
              <Button
                size="compact-xs"
                variant="transparent"
                onClick={() => setExpanded(id, false)}
              >
                Collapse
              </Button>
            </Group>
          </Card.Section>
        )}
      </Card>
    </>
  );
}
