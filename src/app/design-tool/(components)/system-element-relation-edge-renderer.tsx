"use client";

import {
  EdgeProps,
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useStore,
  getBezierPath,
  Position,
  type Node,
} from "reactflow";

import { Box, Stack, Text, useMantineTheme } from "@mantine/core";
import { SystemElementRelationIDSchema } from "@/db/entities/system-element-relation/schema";
import { useQuery } from "@tanstack/react-query";
import { systemElementRelationQueryByID } from "@/db/entities/system-element-relation/server-actions";
import { useSystemElementSelectionState } from "../workspace/app-state";
import { useCallback } from "react";

type Props = EdgeProps<{}>;

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(
  intersectionNode: Node<any>,
  targetNode: Node<any>,
) {
  // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
  const intersectionNodeWidth = intersectionNode.width ?? 0;
  const intersectionNodeHeight = intersectionNode.height ?? 0;
  const targetPosition = targetNode.positionAbsolute ?? { x: 0, y: 0 };
  const intersectionNodePosition = intersectionNode.positionAbsolute ?? {
    x: 0,
    y: 0,
  };

  const w = intersectionNodeWidth / 2;
  const h = intersectionNodeHeight / 2;

  const x2 = intersectionNodePosition.x + w;
  const y2 = intersectionNodePosition.y + h;
  const x1 = targetPosition.x + (targetNode.width ?? 0) / 2;
  const y1 = targetPosition.y + (targetNode.height ?? 0) / 2;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

// returns the position (top,right,bottom or right) passed node compared to the intersection point
function getEdgePosition(
  node: Node<any>,
  intersectionPoint: Node<any>["position"],
) {
  const n = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    ...node.positionAbsolute,
    ...node,
  };
  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + (n.width ?? 0) - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= n.y + (n.height ?? 0) - 1) {
    return Position.Bottom;
  }

  return Position.Top;
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source: Node<any>, target: Node<any>) {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}

export function SystemElementRelationEdgeRenderer(props: Props) {
  const sourceNode = useStore(
    useCallback(
      (store) => store.nodeInternals.get(props.source),
      [props.source],
    ),
  );
  const targetNode = useStore(
    useCallback(
      (store) => store.nodeInternals.get(props.target),
      [props.target],
    ),
  );

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode,
  );

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  const theme = useMantineTheme();

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
          markerEnd: isHighlighted ? highlightColor : "#A9B0BF",
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
