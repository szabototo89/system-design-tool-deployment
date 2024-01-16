"use client";

import { useEffect, useMemo, useRef } from "react";
import { Node, Edge, useNodesInitialized, useReactFlow } from "reactflow";
import ELK, { ElkExtendedEdge, ElkNode } from "elkjs";

function* flattenElkNode(elkNode: ElkNode): Iterable<ElkNode> {
  for (const child of elkNode.children ?? []) {
    yield* flattenElkNode(child);
  }
  yield elkNode;
}

export function ElkCanvasLayout() {
  const nodesInitialized = useNodesInitialized();
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();

  const elk = useMemo(
    () =>
      new ELK({
        defaultLayoutOptions: {
          algorithm: "layered",
          "elk.direction": "DOWN",
          "layered.spacing.nodeNodeBetweenLayers": "250",
          "spacing.nodeNode": "250",
          "elk.edgeRouting": "POLYLINE",
          // separateConnectedComponents: "false",
          // "spacing.componentComponent": "250",
        },
      }),
    [],
  );
  const nodes = getNodes();
  const edges = getEdges();

  function createElkNode(node: Node<any>): ElkNode {
    const children = nodes
      .filter((childNode) => childNode.parentNode === node.id)
      .map(createElkNode);

    const elkNode: ElkNode = {
      id: node.id,
      width: node.width ?? 100,
      height: node.height ?? 100,
      x: node.position.x,
      y: node.position.y,
      children,
    };

    const width =
      children.length > 0
        ? Math.max(
            ...children.map((child) => (child.x ?? 0) + (child.width ?? 0)),
          )
        : node.width ?? 100;
    const height =
      children.length > 0
        ? Math.max(
            ...children.map((child) => (child.y ?? 0) + (child.height ?? 0)),
          )
        : node.height ?? 100;

    return {
      ...elkNode,
      width,
      height,

      layoutOptions: {
        "elk.padding": "[top=50,left=50,bottom=50,right=50]",
      },
    };
  }

  useEffect(() => {
    if (!nodesInitialized) {
      return;
    }

    elk
      .layout({
        id: "root",
        children: nodes
          .filter((node) => node.parentNode == null)
          .map(createElkNode),
        edges: edges.map((edge) => {
          return {
            id: edge.id,
            sources: [edge.source],
            targets: [edge.target],
          } satisfies ElkExtendedEdge;
        }),
        layoutOptions: {
          direction: "DOWN",
        },
      })
      .then((rootNode) => {
        const elkNodes = Array.from(flattenElkNode(rootNode));

        const nodesWithNewPosition = nodes.map((node) => {
          const elkNode = elkNodes.find((elkNode) => elkNode.id === node.id);

          return {
            ...node,
            position: {
              x: elkNode?.x ?? node.position?.x ?? 0,
              y: elkNode?.y ?? node.position?.y ?? 0,
            },
            width: elkNode?.width,
            height: elkNode?.height,
          } satisfies Node<any>;
        });

        setNodes(nodesWithNewPosition);
      });
  }, [nodesInitialized]);

  return null;
}
