import { Modal } from "@mantine/core";
import React from "react";
import { SystemElementEditorForm } from "./system-element-editor-form";
import { systemElementCreate } from "@/db/entities/system-element/server-actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = Pick<React.ComponentProps<typeof Modal>, "opened" | "onClose">;

export function CreateSystemElementModal(props: Props) {
  const queryClient = useQueryClient();
  const createSystemElement = useMutation({
    mutationFn: systemElementCreate,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["system-element"],
      });
    },
  });

  return (
    <Modal {...props} title="Create an element" centered>
      <SystemElementEditorForm
        isSubmitting={createSystemElement.isPending}
        onSubmit={async ({ name, description, type }) => {
          await createSystemElement.mutateAsync({
            name,
            description,
            type,
          });

          props.onClose();
        }}
        submitButtonLabel="Create element"
      />
    </Modal>
  );
}
