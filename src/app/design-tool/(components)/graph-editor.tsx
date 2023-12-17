"use client";

import Dagre from "@dagrejs/dagre";

import { SystemElement } from "@/db/entities/system-element/schema";
import ReactFlow, {
  useNodesState,
  type Node,
  type NodeTypes,
  useEdgesState,
  MarkerType,
  Edge,
  useReactFlow,
} from "reactflow";

import "reactflow/dist/style.css";
import { useCallback, useEffect, useTransition } from "react";
import { SystemElementNode } from "../system-element-node";
import { SystemElementRelation } from "@/db/entities/system-element-relation.schema";
import { systemElementCreate } from "@/db/entities/system-element/server-actions";

type Props = {
  initialSystemElements: readonly SystemElement[];
  initialRelations: readonly SystemElementRelation[];

  onConnect?(options: { source: string; target: string }): void;
};

const nodeTypes = {
  SystemElementNode,
} satisfies NodeTypes;

export function GraphEditor(props: Props) {
  const [isLoading, startTransition] = useTransition();
  // const getInitialNodes = useCallback(() => {
  //   if (props.initialSystemElements.length === 0) {
  //     return;
  //   }

  //   const graph = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  //   graph.setGraph({ rankdir: "TB" });

  //   props.initialSystemElements.forEach((systemElement) => {
  //     graph.setNode(systemElement.id, {
  //       width: 200,
  //       height: 100,
  //     });
  //   });

  //   props.initialRelations.forEach((relation) =>
  //     graph.setEdge(relation.sourceID, relation.targetID),
  //   );

  //   Dagre.layout(graph);

  //   return props.initialSystemElements.map((systemElement) => {
  //     const { x, y, width, height } = graph.node(systemElement.id);

  //     return {
  //       id: systemElement.id,
  //       position: { x, y },
  //       width,
  //       height,
  //       type: SystemElementNode.name,
  //       data: {
  //         ...systemElement,
  //         isParent: false,
  //       },
  //     } satisfies Node;
  //   });
  // }, [props.initialSystemElements, props.initialRelations]);

  // const [nodes, setNodes, onNodesChange] = useNodesState(getInitialNodes());
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    props.initialRelations.map((relation) => {
      return {
        id: relation.id,
        source: relation.sourceID,
        target: relation.targetID,
        label: relation.label,
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
    }),
  );

  if (isLoading) {
    return <>Loading ...</>;
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(connection) => {
          setEdges((previousEdges) => [
            ...previousEdges,
            {
              id: `${connection.source ?? ""}__${connection.target ?? ""}`,
              source: connection.source ?? "",
              target: connection.target ?? "",
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
            },
          ]);

          startTransition(() => {
            props.onConnect?.({
              source: connection.source ?? "",
              target: connection.target ?? "",
            });
          });
        }}
        nodeTypes={nodeTypes}
      >
        {props.initialSystemElements.map((systemElement) => (
          <SystemElementReactFlowNode
            key={systemElement.id}
            systemElement={systemElement}
          />
        ))}
      </ReactFlow>
    </div>
  );
}

function SystemElementReactFlowNode(props: { systemElement: SystemElement }) {
  const reactFlowInstance = useReactFlow();

  useEffect(() => {
    reactFlowInstance.addNodes({
      id: props.systemElement.id,
      position: { x: 0, y: 0 },
      width: 200,
      height: 200,
      type: SystemElementNode.name,
      data: {
        ...props.systemElement,
      },
    } satisfies Node);

    return () =>
      reactFlowInstance.deleteElements({ nodes: [{ id: "test-id" }] });
  }, []);

  return null;
}
