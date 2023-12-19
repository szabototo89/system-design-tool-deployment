"use client";

import { SystemElement } from "@/db/entities/system-element/schema";
import ReactFlow, {
  useNodesState,
  type Node,
  type NodeTypes,
  useEdgesState,
  MarkerType,
  Edge,
  useReactFlow,
  Background,
} from "reactflow";

import { useEffect, useTransition } from "react";
import { SystemElementNode } from "../system-element-node";
import { SystemElementRelation } from "@/db/entities/system-element-relation.schema";

import "reactflow/dist/style.css";

type Props = {
  systemElements: readonly SystemElement[];
  systemElementRelations: readonly SystemElementRelation[];

  onConnect?(options: { source: string; target: string }): void;
} & Pick<React.ComponentProps<typeof ReactFlow>, "onEdgeClick" | "onNodeClick">;

const nodeTypes = {
  SystemElementNode,
} satisfies NodeTypes;

function makeReactFlowNodeFromSystemElement(
  systemElement: SystemElement,
): Node {
  return {
    id: systemElement.id,
    width: 200,
    height: 200,
    type: SystemElementNode.name,
    selectable: true,
    data: {},
    position: { x: 0, y: 0 },
  };
}

function makeReactFlowEdgeFromSystemElementRelation(
  systemElementRelation: SystemElementRelation,
) {
  return {
    id: systemElementRelation.id,
    source: systemElementRelation.sourceID,
    target: systemElementRelation.targetID,
    label: systemElementRelation.label,
    type: "smoothstep",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 10,
      height: 10,
      color: "black",
    },
    style: {
      strokeWidth: 2,
      stroke: "black",
    },
  } satisfies Edge<unknown>;
}

export function GraphEditor(props: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    props.systemElements.map((systemElement, index) => {
      return {
        ...makeReactFlowNodeFromSystemElement(systemElement),
        position: { x: index * 210, y: 0 },
      } satisfies Node;
    }),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    props.systemElementRelations.map(
      makeReactFlowEdgeFromSystemElementRelation,
    ),
  );

  useEffect(() => {
    setNodes((previousNodes) => {
      const previousNodesByID = Object.fromEntries(
        previousNodes.map((node) => [node.id, node]),
      );

      return props.systemElements
        .map(makeReactFlowNodeFromSystemElement)
        .map((systemElement) => {
          if (systemElement.id in previousNodesByID) {
            return previousNodesByID[systemElement.id];
          }

          return systemElement;
        });
    });
  }, [props.systemElements]);

  useEffect(() => {
    setEdges((previousEdges) => {
      const previousEdgesByID = Object.fromEntries(
        previousEdges.map((edge) => [edge.id, edge]),
      );

      return props.systemElementRelations
        .map(makeReactFlowEdgeFromSystemElementRelation)
        .map((systemElementRelation) => {
          if (systemElementRelation.id in previousEdgesByID) {
            return {
              ...previousEdgesByID[systemElementRelation.id],
              label: systemElementRelation.label,
            };
          }

          return systemElementRelation;
        });
    });
  }, [props.systemElementRelations]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        snapToGrid
        onConnect={(connection) => {
          props.onConnect?.({
            source: connection.source ?? "",
            target: connection.target ?? "",
          });
        }}
        nodeTypes={nodeTypes}
        onEdgeClick={props.onEdgeClick}
        onNodeClick={props.onNodeClick}
      >
        <Background />
      </ReactFlow>
    </div>
  );
}
