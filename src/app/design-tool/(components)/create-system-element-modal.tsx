import { Modal } from "@mantine/core";
import React from "react";
import { SystemElementEditorForm } from "./system-element-editor-form";
import { useCreateSystemElement } from "./system-element-hooks";

type Props = Pick<React.ComponentProps<typeof Modal>, "opened" | "onClose">;

export function CreateSystemElementModal(props: Props) {
  const createSystemElement = useCreateSystemElement();

  return (
    <Modal {...props} title="Create an element" centered>
      <SystemElementEditorForm
        isSubmitting={createSystemElement.isPending}
        onSubmit={async ({ name, description, type, technologies }) => {
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
