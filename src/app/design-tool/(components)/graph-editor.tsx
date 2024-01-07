"use client";

import { SystemElement } from "@/db/entities/system-element/schema";
import ReactFlow, {
  useNodesState,
  type Node,
  type NodeTypes,
  useEdgesState,
  Edge,
  Background,
  ConnectionMode,
  useReactFlow,
  EdgeTypes,
  Controls,
} from "reactflow";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { SystemElementNode } from "./system-element-node";
import { SystemElementRelation } from "@/db/entities/system-element-relation/schema";

import "reactflow/dist/style.css";
import "../../../styles/app.reactflow.css";

import { SystemElementParentNode } from "./system-element-parent-node";
import { useAtomValue } from "jotai";
import {
  expandedGraphElementsAtom,
  useIsGraphElementExpanded,
} from "../app-state";
import { maximumBy } from "@/utils/maximumBy";
import { SystemElementRelationEdgeRenderer } from "./system-element-relation-edge-renderer";
import { CanvasLayout } from "./canvas-layout";

type Props = {
  systemElements: readonly SystemElement[];
  systemElementRelations: readonly SystemElementRelation[];
  onNodeDrop?(source: Node, target: Node | null): void;
  onConnect?(options: { source: string; target: string }): void;
} & Pick<
  React.ComponentProps<typeof ReactFlow>,
  | "onEdgeClick"
  | "onEdgeDoubleClick"
  | "onNodeClick"
  | "onNodeDoubleClick"
  | "onPaneClick"
>;

const nodeTypes = {
  SystemElementNode,
  SystemElementParentNode,
} satisfies NodeTypes;

const edgeTypes = {
  SystemElementRelationEdgeRenderer,
} satisfies EdgeTypes;

function makeReactFlowNodeFromSystemElement(
  systemElement: SystemElement,
  isParentNode: boolean,
  isExpanded: boolean,
  zIndex: number = 0,
): Node {
  return {
    id: systemElement.id,
    width: 200,
    height: 200,
    type:
      isParentNode && isExpanded
        ? SystemElementParentNode.name
        : SystemElementNode.name,
    selectable: true,
    data: {},
    position: { x: 0, y: 0 },
    parentNode: systemElement.parentID ?? undefined,
    expandParent: false,
    zIndex,
  };
}

function makeReactFlowEdgeFromSystemElementRelation(
  systemElementRelation: SystemElementRelation,
) {
  return {
    id: systemElementRelation.id,
    source: systemElementRelation.sourceID,
    target: systemElementRelation.targetID,
    type: SystemElementRelationEdgeRenderer.name,
  } satisfies Edge<{}>;
}

export function GraphEditor(props: Props) {
  const instance = useReactFlow();
  const expandedGraphElements = useAtomValue(expandedGraphElementsAtom);
  const isGraphElementExpanded = useIsGraphElementExpanded();
  const parentSystemElements = useMemo(
    () =>
      new Set(
        props.systemElements
          .map((systemElement) => systemElement.parentID)
          .filter(Boolean),
      ),
    [props.systemElements],
  );

  const systemElementsById = useMemo(() => {
    return Object.fromEntries(
      props.systemElements.map((systemElement) => [
        systemElement.id,
        systemElement,
      ]),
    );
  }, [props.systemElements]);

  function getSystemElementChildrenLevel(systemElement: SystemElement) {
    let currentSystemElement = systemElement;
    let level = 0;

    while (currentSystemElement.parentID != null) {
      level = level + 1;
      currentSystemElement = systemElementsById[currentSystemElement.parentID];
    }

    return level;
  }

  const systemElements = useMemo(
    () =>
      props.systemElements.filter((systemElement) => {
        if (systemElement.parentID == null) {
          return true;
        }

        return isGraphElementExpanded(systemElement.parentID);
      }),
    [props.systemElements, isGraphElementExpanded],
  );

  const systemElementRelations = useMemo(
    () =>
      props.systemElementRelations.filter((relation) => {
        const collapsedSystemElements = systemElements.filter(
          (systemElement) =>
            !(
              isGraphElementExpanded(systemElement.id) &&
              parentSystemElements.has(systemElement.id)
            ),
        );

        const isSourceElementVisible = collapsedSystemElements.some(
          (systemElement) => systemElement.id === relation.sourceID,
        );

        const isTargetElementVisible = collapsedSystemElements.some(
          (systemElement) => systemElement.id === relation.targetID,
        );

        return isSourceElementVisible && isTargetElementVisible;
      }),
    [systemElements, props.systemElementRelations, isGraphElementExpanded],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(
    systemElements.map((systemElement, index) => {
      return {
        ...makeReactFlowNodeFromSystemElement(
          systemElement,
          parentSystemElements.has(systemElement.id),
          expandedGraphElements.includes(systemElement.id),
        ),
        position: { x: index * 210, y: 0 },
      } satisfies Node;
    }),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    systemElementRelations.map(makeReactFlowEdgeFromSystemElementRelation),
  );

  useEffect(() => {
    setNodes((previousNodes) => {
      const previousNodesByID = Object.fromEntries(
        previousNodes.map((node) => [node.id, node]),
      );

      return systemElements
        .map((systemElement) =>
          makeReactFlowNodeFromSystemElement(
            systemElement,
            parentSystemElements.has(systemElement.id),
            expandedGraphElements.includes(systemElement.id),
            getSystemElementChildrenLevel(systemElement),
          ),
        )
        .map((systemElement) => {
          const previousSystemElement = previousNodesByID[systemElement.id];

          if (
            previousSystemElement &&
            previousSystemElement.type === systemElement.type &&
            previousSystemElement.parentNode === systemElement.parentNode
          ) {
            return previousSystemElement;
          }

          if (
            previousSystemElement &&
            previousSystemElement.type === systemElement.type
          ) {
            if (systemElement.parentNode) {
              return {
                ...systemElement,
                position: { x: 0, y: 0 },
              };
            } else {
              return {
                ...systemElement,
                position:
                  previousSystemElement.positionAbsolute ??
                  previousSystemElement.position,
              };
            }
          }

          if (previousSystemElement) {
            return {
              ...systemElement,
              position: previousSystemElement.position,
              positionAbsolute: previousSystemElement.positionAbsolute,
            };
          }

          return systemElement;
        });
    });
  }, [systemElements, parentSystemElements, expandedGraphElements]);

  useEffect(() => {
    setEdges(() => {
      return systemElementRelations.map(
        makeReactFlowEdgeFromSystemElementRelation,
      );
    });
  }, [systemElementRelations]);

  const [targetNode, setTargetNode] = useState<Node | null>(null);

  return (
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
      selectNodesOnDrag={false}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onPaneClick={props.onPaneClick}
      onEdgeClick={props.onEdgeClick}
      onEdgeDoubleClick={props.onEdgeDoubleClick}
      onNodeClick={props.onNodeClick}
      onNodeDoubleClick={props.onNodeDoubleClick}
      connectionMode={ConnectionMode.Loose}
      onNodeDrag={(event, draggedNode, ...args) => {
        const targetNodes = instance.getIntersectingNodes(draggedNode);

        const newTargetNode =
          maximumBy(
            targetNodes,
            (left, right) => (left.zIndex ?? 0) - (right.zIndex ?? 0),
          ) ?? null;

        setTargetNode(newTargetNode);
      }}
      onNodeDragStop={(event, node) => {
        props.onNodeDrop?.(node, targetNode);
      }}
    >
      <Background />
      <Controls />
      <CanvasLayout />
    </ReactFlow>
  );
}
