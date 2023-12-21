"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GraphEditor } from "./(components)/graph-editor";
import { AppShell, Button, Group, Text, TextInput, Title } from "@mantine/core";
import {
  systemElementRelationCreate,
  queryAll as systemElementRelationQueryAll,
} from "@/db/entities/system-element-relation/server-actions";
import {
  SystemElement,
  SystemElementSchema,
} from "@/db/entities/system-element/schema";
import { useState } from "react";
import { CreateSystemElementModal } from "./(components)/create-system-element-modal";
import { EditSystemElementModal } from "./(components)/edit-system-element-modal";
import { ModalLauncher } from "@/components/modal-launcher";
import { EditSystemElementRelationModal } from "./(components)/edit-system-element-relation-modal";
import {
  SystemElementRelation,
  SystemElementRelationIDSchema,
} from "@/db/entities/system-element-relation/schema";
import { useQueryAllSystemElements } from "./(components)/system-element-hooks";
import { useDisclosure } from "@mantine/hooks";

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

  return (
    <AppShell header={{ height: 70 }}>
      <AppShell.Header px="md">
        <Group justify="space-between" align="center" h="100%">
          <Title>Software Design Tool</Title>
          <TextInput placeholder="Search ..." />
        </Group>
      </AppShell.Header>

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

      <AppShell.Main style={{ position: "relative" }}>
        <div
          style={{
            height: "calc(100% - 70px)",
            width: "100%",
            position: "absolute",
          }}
        >
          <GraphEditor
            systemElements={systemElements.data ?? []}
            systemElementRelations={systemElementRelations.data ?? []}
            onConnect={({ source, target }) => {
              createSystemElementRelation.mutate({
                label: "this is a test",
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
          />
        </div>
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
    </AppShell>
  );
}
