import { Button, Modal } from "@mantine/core";
import React from "react";
import { SystemElementEditorForm } from "./system-element-editor-form";
import {
  systemElementDelete,
  systemElementUpdate,
} from "@/db/entities/system-element/server-actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SystemElement } from "@/db/entities/system-element/schema";

type Props = {
  systemElement: Pick<SystemElement, "id" | "name" | "description" | "type">;
} & Pick<React.ComponentProps<typeof Modal>, "opened" | "onClose">;

export function EditSystemElementModal(props: Props) {
  const queryClient = useQueryClient();
  const updateSystemElement = useMutation({
    mutationFn: systemElementUpdate,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["system-element"],
      });
    },
  });

  const deleteSystemElement = useMutation({
    mutationFn: systemElementDelete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["system-element"],
      });
    },
  });

  return (
    <Modal {...props} title="Edit element" centered>
      <SystemElementEditorForm
        initialValue={{
          name: props.systemElement.name,
          description: props.systemElement.description,
          type: props.systemElement.type,
        }}
        isSubmitting={updateSystemElement.isPending}
        onSubmit={async ({ name, description, type }) => {
          await updateSystemElement.mutateAsync({
            entity: { id: props.systemElement.id },
            value: {
              name,
              description,
              type,
            },
          });

          props.onClose();
        }}
        submitButtonLabel="Save changes"
        startContent={
          <Button
            variant="outline"
            color="red"
            loading={deleteSystemElement.isPending}
            disabled={deleteSystemElement.isPending}
            onClick={async () => {
              await deleteSystemElement.mutate(props.systemElement);
              props.onClose();
            }}
          >
            Delete
          </Button>
        }
      />
    </Modal>
  );
}
