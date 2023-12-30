"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GraphEditor } from "./graph-editor";
import { AppShell, Box, Button, Text } from "@mantine/core";
import {
  systemElementRelationCreate,
  queryAll as systemElementRelationQueryAll,
} from "@/db/entities/system-element-relation/server-actions";
import { Node } from "reactflow";
import {
  SystemElement,
  SystemElementSchema,
} from "@/db/entities/system-element/schema";
import { useState } from "react";
import { CreateSystemElementModal } from "./create-system-element-modal";
import { EditSystemElementModal } from "./edit-system-element-modal";
import { ModalLauncher } from "@/components/modal-launcher";
import { EditSystemElementRelationModal } from "./edit-system-element-relation-modal";
import {
  SystemElementRelation,
  SystemElementRelationIDSchema,
} from "@/db/entities/system-element-relation/schema";
import {
  useQueryAllSystemElements,
  useUpdateSystemElementParent,
} from "./system-element-hooks";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";

export function DesignToolEditorPage() {
  const queryClient = useQueryClient();
  const [isEditElementModalOpened, { open, close }] = useDisclosure(false);

  const systemElements = useQueryAllSystemElements();

  const systemElementRelations = useQuery({
    queryKey: ["system-element-relation"],
    async queryFn() {
      return await systemElementRelationQueryAll();
    },
  });

  const createSystemElementRelation = useMutation({
    mutationFn: systemElementRelationCreate,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["system-element-relation"],
      });
    },
  });

  const updateSystemElementParent = useUpdateSystemElementParent();

  const [selectedSystemElementID, setSelectedSystemElementID] = useState<
    SystemElement["id"] | null
  >(null);

  const [selectedSystemElementRelationID, setSelectedSystemElementRelationID] =
    useState<SystemElementRelation["id"] | null>(null);

  const selectedSystemElement = systemElements.data?.find(
    (systemElement) => systemElement.id === selectedSystemElementID,
  );

  const selectedSystemElementRelation = systemElementRelations.data?.find(
    (relation) => relation.id === selectedSystemElementRelationID,
  );

  if (systemElements.isLoading || systemElementRelations.isLoading) {
    return <Text>Loading ...</Text>;
  }

  const openConfirmModalOnParentUpdate = (
    sourceNode: Node,
    targetNode: Node | null,
  ) =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">
          Are you sure that you want to add the selected element to this element
          as a parent?
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      // onCancel: () => console.log("Cancel"),
      onConfirm: () => {
        updateSystemElementParent.mutate({
          entity: {
            id: sourceNode.id,
          },
          parentEntity: targetNode != null ? { id: targetNode.id } : null,
        });
      },
    });

  return (
    <>
      <AppShell.Aside>
        <Button.Group>
          <ModalLauncher
            variant="default"
            renderModal={({ isOpened, close }) => (
              <CreateSystemElementModal opened={isOpened} onClose={close} />
            )}
          >
            Add element
          </ModalLauncher>
          <Button
            variant="default"
            onClick={open}
            disabled={selectedSystemElement == null}
          >
            Edit element
          </Button>
        </Button.Group>
      </AppShell.Aside>

      <AppShell.Main
        style={{ position: "relative" }}
        pos="relative"
        h="calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px))"
      >
        <Box
          pos="absolute"
          w="calc(100vw - var(--app-shell-navbar-width, 0px)"
          h="calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px))"
        >
          <GraphEditor
            systemElements={systemElements.data ?? []}
            systemElementRelations={systemElementRelations.data ?? []}
            onConnect={({ source, target }) => {
              createSystemElementRelation.mutate({
                label: "Give me a label",
                sourceID: source,
                targetID: target,
              });
            }}
            onEdgeClick={(event, edge) =>
              setSelectedSystemElementRelationID(
                SystemElementRelationIDSchema.parse(edge.id),
              )
            }
            onNodeClick={(event, node) => {
              setSelectedSystemElementID(
                SystemElementSchema.shape.id.parse(node.id),
              );
            }}
            onNodeDoubleClick={(event, node) => {
              setSelectedSystemElementID(
                SystemElementSchema.shape.id.parse(node.id),
              );
              open();
            }}
            onNodeDrop={(sourceNode, targetNode) => {
              if (sourceNode.id === targetNode?.id) {
                return;
              }

              if (sourceNode.parentNode === targetNode?.id) {
                return;
              }

              if (targetNode?.parentNode === sourceNode.id) {
                return;
              }

              openConfirmModalOnParentUpdate(sourceNode, targetNode);
            }}
          />
        </Box>
        {selectedSystemElementRelation != null && (
          <EditSystemElementRelationModal
            key={selectedSystemElementRelationID ?? ""}
            opened={selectedSystemElementRelationID != null}
            systemElementRelation={selectedSystemElementRelation}
            onClose={() => setSelectedSystemElementRelationID(null)}
          />
        )}
        {selectedSystemElement != null && (
          <EditSystemElementModal
            systemElement={selectedSystemElement}
            opened={isEditElementModalOpened}
            onClose={close}
          />
        )}
      </AppShell.Main>
    </>
  );
}