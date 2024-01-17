import { Modal } from "@mantine/core";
import React from "react";
import { SystemElementEditorForm } from "./system-element-editor-form";
import { SystemElement } from "@/db/entities/system-element/schema";
import { useUpdateSystemElement } from "./system-element-hooks";
import { SystemTechnology } from "@/db/entities/system-technology/schema";
import { DeleteSystemElementButton } from "./delete-system-element-button";

type Props = {
  systemElement: Pick<
    SystemElement,
    "id" | "name" | "description" | "type" | "isExternal" | "workspaceID"
  > & { technologies: SystemTechnology[] };
} & Pick<React.ComponentProps<typeof Modal>, "opened" | "onClose">;

export function EditSystemElementModal(props: Props) {
  const updateSystemElement = useUpdateSystemElement();

  return (
    <Modal {...props} title="Edit element" centered>
      <SystemElementEditorForm
        initialValue={{
          name: props.systemElement.name,
          description: props.systemElement.description,
          type: props.systemElement.type,
          isExternal: props.systemElement.isExternal,
          technologies: props.systemElement.technologies.map(
            (technology) => technology.name,
          ),
        }}
        isSubmitting={updateSystemElement.isPending}
        onSubmit={async ({
          name,
          description,
          type,
          technologies,
          isExternal,
        }) => {
          await updateSystemElement.mutateAsync({
            entity: { id: props.systemElement.id },
            value: {
              name,
              description,
              type,
              parentID: null,
              isExternal,
              technologies: technologies.map((technologyName) => {
                return {
                  name: technologyName,
                };
              }),
              workspaceID: props.systemElement.workspaceID,
            },
          });

          props.onClose();
        }}
        submitButtonLabel="Save changes"
        startContent={
          <DeleteSystemElementButton
            variant="outline"
            color="red"
            systemElement={props.systemElement}
            onDelete={props.onClose}
          >
            Delete
          </DeleteSystemElementButton>
        }
      />
    </Modal>
  );
}
