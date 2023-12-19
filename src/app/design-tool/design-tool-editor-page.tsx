"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryAll as systemElementQueryAll } from "@/db/entities/system-element/server-actions";
import { GraphEditor } from "./(components)/graph-editor";
import { Button, Text } from "@mantine/core";
import {
  systemElementRelationCreate,
  queryAll as systemElementRelationQueryAll,
} from "@/db/entities/system-element-relation.server-actions";
import { SystemElement } from "@/db/entities/system-element/schema";
import { useState } from "react";
import { CreateSystemElementModal } from "./(components)/create-system-element-modal";
import { EditSystemElementModal } from "./(components)/edit-system-element-modal";
import { useOnSelectionChange } from "reactflow";
import { ModalLauncher } from "@/components/modal-launcher";
import { EditSystemElementRelationModal } from "./(components)/edit-system-element-relation-modal";
import { SystemElementRelation } from "@/db/entities/system-element-relation.schema";

export function DesignToolEditorPage() {
  const queryClient = useQueryClient();

  const systemElements = useQuery({
    queryKey: ["system-element"],
    async queryFn() {
      return await systemElementQueryAll();
    },
  });

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

  useOnSelectionChange({
    onChange({ nodes }) {
      setSelectedSystemElementID(nodes[0]?.id ?? null);
    },
  });

  if (systemElements.isLoading || systemElementRelations.isLoading) {
    return <Text>Loading ...</Text>;
  }

  return (
    <>
      <Button.Group>
        <ModalLauncher
          variant="default"
          renderModal={({ isOpened, close }) => (
            <CreateSystemElementModal opened={isOpened} onClose={close} />
          )}
        >
          Add element
        </ModalLauncher>
        <ModalLauncher
          variant="default"
          renderModal={({ isOpened, close }) => {
            if (selectedSystemElement == null) {
              return null;
            }

            return (
              <EditSystemElementModal
                systemElement={selectedSystemElement}
                opened={isOpened}
                onClose={close}
              />
            );
          }}
          disabled={selectedSystemElement == null}
        >
          Edit element
        </ModalLauncher>
      </Button.Group>
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
          setSelectedSystemElementRelationID(edge.id)
        }
      />
      <EditSystemElementRelationModal
        key={selectedSystemElementRelationID ?? ""}
        opened={selectedSystemElementRelationID != null}
        systemElementRelation={systemElementRelations.data?.find(
          (relation) => relation.id === selectedSystemElementRelationID,
        )}
        onClose={() => setSelectedSystemElementRelationID(null)}
      />
    </>
  );
}
