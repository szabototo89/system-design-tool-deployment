import { Modal } from "@mantine/core";
import React from "react";
import { SystemElementEditorForm } from "./system-element-editor-form";
import { useCreateSystemElement } from "./system-element-hooks";
import { Workspace } from "@/db/entities/workspace/schema";

type Props = Pick<React.ComponentProps<typeof Modal>, "opened" | "onClose"> & {
  workspace: Pick<Workspace, "id">;
};

export function CreateSystemElementModal(props: Props) {
  const createSystemElement = useCreateSystemElement();

  return (
    <Modal {...props} title="Create an element" centered>
      <SystemElementEditorForm
        isSubmitting={createSystemElement.isPending}
        onSubmit={async ({ name, description, type, isExternal }) => {
          await createSystemElement.mutateAsync({
            name,
            description,
            type,
            isExternal,
            parentID: null,
            workspaceID: props.workspace.id,
          });

          props.onClose();
        }}
        submitButtonLabel="Create element"
      />
    </Modal>
  );
}
