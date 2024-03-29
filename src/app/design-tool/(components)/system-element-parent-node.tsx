import {
  Badge,
  Button,
  Card,
  Group,
  MantineSize,
  Text,
  Tooltip,
} from "@mantine/core";
import { NodeProps, NodeResizer, useNodeId, useStore } from "reactflow";
import { useQuerySystemElementByID } from "./system-element-hooks";
import { SystemElementIDSchema } from "@/db/entities/system-element/schema";
import { useExpandedGraphElements } from "../workspace/app-state";
import { SystemElementTypeBadge } from "./system-element-type-badge";

export function SystemElementParentNode(props: NodeProps<{}>) {
  const id = SystemElementIDSchema.parse(useNodeId());
  const systemElement = useQuerySystemElementByID(id);
  const setExpanded = useExpandedGraphElements();

  const showLessDetails = useStore((state) => state.transform["2"] < 0.75);
  const nodeInternal = useStore((state) => state.nodeInternals.get(id));

  const textSize: MantineSize = showLessDetails ? "xl" : "xs";

  if (systemElement.isLoading || systemElement.data == null) {
    return null;
  }

  const childrenCount = systemElement.data.children.length ?? 0;

  const width = nodeInternal?.width ?? undefined;
  const height = nodeInternal?.height ?? undefined;

  return (
    <>
      <NodeResizer
        isVisible={props.selected}
        minWidth={width}
        minHeight={height}
      />
      <Card
        padding="md"
        radius="md"
        withBorder
        w={width}
        h={height}
        style={{
          borderStyle: "dashed",
          borderWidth: "3px",
          backgroundColor: "rgba(255, 255, 255, 0.25)",
        }}
      >
        <Group gap="sm" align="flex-end" justify="flex-start" h={"100%"}>
          <Group gap={4} align="baseline">
            <Text size={textSize} fw={500}>
              {systemElement.data.name}
            </Text>
            {childrenCount > 0 && (
              <Tooltip label="Number of children" openDelay={1000}>
                <Text size={textSize} c="dimmed">
                  ({childrenCount})
                </Text>
              </Tooltip>
            )}
          </Group>
          <SystemElementTypeBadge
            size={textSize}
            systemElement={systemElement.data}
          />
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
