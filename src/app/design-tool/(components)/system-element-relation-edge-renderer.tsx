"use client";

import {
  EdgeProps,
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useStore,
} from "reactflow";

import { Box, Stack, Text, useMantineTheme } from "@mantine/core";
import { SystemElementRelationIDSchema } from "@/db/entities/system-element-relation/schema";
import { useQuery } from "@tanstack/react-query";
import { systemElementRelationQueryByID } from "@/db/entities/system-element-relation/server-actions";
import { useSystemElementSelectionState } from "../workspace/app-state";

type Props = EdgeProps<{}>;

export function SystemElementRelationEdgeRenderer(props: Props) {
  const theme = useMantineTheme();
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition,
  });

  const [selectedSystemElementID] = useSystemElementSelectionState();
  const showLessDetails = useStore((state) => state.transform["2"] < 0.75);

  const systemElementRelation = useQuery({
    queryKey: ["system-element-relation", { id: props.id }] as const,
    async queryFn() {
      return systemElementRelationQueryByID(
        SystemElementRelationIDSchema.parse(props.id),
      );
    },
  });

  if (systemElementRelation.data == null) {
    return null;
  }

  const technologies = systemElementRelation.data.technologies;

  const isHighlighted =
    selectedSystemElementID != null &&
    [
      systemElementRelation.data.sourceID,
      systemElementRelation.data.targetID,
    ].includes(selectedSystemElementID);

  const highlightColor = theme.colors.blue["7"];
  const textColor = isHighlighted ? highlightColor : undefined;

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        style={{
          strokeWidth: isHighlighted ? 3 : 2,
          stroke: isHighlighted ? highlightColor : "#A9B0BF",
        }}
      />
      <EdgeLabelRenderer>
        <Box
          pos="absolute"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            zIndex: isHighlighted ? 1000 : 0,
          }}
          p="xs"
          bg={`rgba(255, 255, 255, ${isHighlighted ? 0.95 : 0.75})`}
        >
          <Stack gap={0} align="center" justify="center" maw={200}>
            <Text
              size={showLessDetails ? "lg" : "xs"}
              ta="center"
              c={textColor}
              fw={isHighlighted ? 500 : undefined}
            >
              {systemElementRelation.data.label}
            </Text>
            {!showLessDetails && technologies.length > 0 && (
              <Text size="xs" fs="italic" ta="center" c={textColor}>
                [{technologies.map((technology) => technology.name).join(", ")}]
              </Text>
            )}
          </Stack>
        </Box>
      </EdgeLabelRenderer>
    </>
  );
}
