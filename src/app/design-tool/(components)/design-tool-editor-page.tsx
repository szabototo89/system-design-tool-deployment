"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GraphEditor } from "./graph-editor";
import {
  ActionIcon,
  AppShell,
  Box,
  Button,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import {
  systemElementRelationCreate,
  queryAll as systemElementRelationQueryAll,
} from "@/db/entities/system-element-relation/server-actions";
import { Node } from "reactflow";
import {
  SystemElement,
  SystemElementIDSchema,
  SystemElementSchema,
} from "@/db/entities/system-element/schema";
import { useMemo, useState } from "react";
import { CreateSystemElementModal } from "./create-system-element-modal";
import { EditSystemElementModal } from "./edit-system-element-modal";
import { ModalLauncher } from "@/components/modal-launcher";
import { EditSystemElementRelationModal } from "./edit-system-element-relation-modal";
import {
  SystemElementRelation,
  SystemElementRelationIDSchema,
} from "@/db/entities/system-element-relation/schema";
import {
  useSystemElementQueryFromWorkspace,
  useUpdateSystemElementParent,
} from "./system-element-hooks";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import {
  useAsideState,
  useSystemElementSelectionState,
} from "../workspace/app-state";
import { IconX } from "@tabler/icons-react";
import { Workspace } from "@/db/entities/workspace/schema";

type Props = {
  workspace: Pick<Workspace, "id">;
};

export function DesignToolEditorPage(props: Props) {
  const queryClient = useQueryClient();
  const [isAsideOpened, setAsideOpened] = useAsideState();
  const [isEditElementModalOpened, { open, close }] = useDisclosure(false);

  const systemElements = useSystemElementQueryFromWorkspace(props.workspace);

  const systemElementsById = useMemo(() => {
    return Object.fromEntries(
      systemElements.data?.map(
        (systemElement) => [systemElement.id, systemElement] as const,
      ) ?? [],
    );
  }, [systemElements.data]);

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

  const [selectedSystemElementID, setSelectedSystemElementID] =
    useSystemElementSelectionState();

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
      onConfirm: () => {
        updateSystemElementParent.mutate({
          entity: {
            id: SystemElementIDSchema.parse(sourceNode.id),
          },
          parentEntity:
            targetNode != null
              ? { id: SystemElementIDSchema.parse(targetNode.id) }
              : null,
        });
      },
    });

  return (
    <>
      {isAsideOpened && (
        <AppShell.Aside>
          <Stack p="xs">
            <Group justify="end">
              <ActionIcon
                variant="white"
                size="sm"
                onClick={() => setAsideOpened(false)}
              >
                <IconX />
              </ActionIcon>
            </Group>
            <Button.Group>
              <ModalLauncher
                variant="default"
                renderModal={({ isOpened, close }) => (
                  <CreateSystemElementModal
                    opened={isOpened}
                    onClose={close}
                    workspace={props.workspace}
                  />
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
          </Stack>
        </AppShell.Aside>
      )}

      <AppShell.Main
        style={{ position: "relative" }}
        pos="relative"
        h="calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px))"
      >
        {/* w="calc(100% - var(--app-shell-navbar-width, 0px))" */}
        <Box
          pos="absolute"
          w="100%"
          h="calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px))"
        >
          <GraphEditor
            systemElements={systemElements.data ?? []}
            systemElementRelations={systemElementRelations.data ?? []}
            onPaneClick={() => setSelectedSystemElementID(null)}
            onConnect={({ source, target }) => {
              createSystemElementRelation.mutate({
                label: "Give me a label",
                sourceID: SystemElementIDSchema.parse(source),
                targetID: SystemElementIDSchema.parse(target),
                workspaceID: props.workspace.id,
              });
            }}
            onEdgeDoubleClick={(event, edge) =>
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

              const sourceElement = systemElementsById[sourceNode.id];
              const targetElement =
                targetNode != null ? systemElementsById[targetNode.id] : null;

              const typesSupportHavingChildren = ["system", "container"];

              const typeRanks = ["person", "system", "container", "component"];

              if (targetElement != null) {
                if (
                  targetElement.type != null &&
                  !typesSupportHavingChildren.includes(targetElement.type)
                ) {
                  return;
                }

                if (targetElement.type === sourceElement.type) {
                  return;
                }

                if (
                  targetElement.type != null &&
                  sourceElement.type != null &&
                  typeRanks.indexOf(targetElement.type) >
                    typeRanks.indexOf(sourceElement.type)
                ) {
                  return;
                }
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
