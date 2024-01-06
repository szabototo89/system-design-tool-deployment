"use client";

import { useEffect, useMemo, useRef } from "react";
import { Node, Edge, useNodesInitialized, useReactFlow } from "reactflow";
import dagre from "@dagrejs/dagre";

const getLayoutedElements = (
  dagreGraph: dagre.graphlib.Graph<{}>,
  nodes: Node[],
  edges: Edge[],
) => {
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: node.width ?? 200,
      height: node.height ?? 100,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph, {});

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    node.position = {
      x: nodeWithPosition.x - (node.width ?? 200) / 2,
      y: nodeWithPosition.y - (node.height ?? 100) / 2,
    };

    return node;
  });

  return { nodes, edges };
};

export function CanvasLayout() {
  const nodesInitialized = useNodesInitialized();
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  const dagreGraph = useMemo(() => {
    const graph = new dagre.graphlib.Graph();
    graph.setDefaultEdgeLabel(() => ({}));
    graph.setGraph({ rankdir: "TB", nodesep: 150, ranksep: 150 });
    return graph;
  }, []);

  useEffect(() => {
    if (!nodesInitialized) {
      return;
    }

    const { nodes, edges } = getLayoutedElements(
      dagreGraph,
      getNodes(),
      getEdges(),
    );

    setNodes(nodes);
    setEdges(edges);
  }, [nodesInitialized]);

  return null;
}
