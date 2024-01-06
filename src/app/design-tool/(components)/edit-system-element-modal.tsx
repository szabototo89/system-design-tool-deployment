import { Button, Modal } from "@mantine/core";
import React from "react";
import { SystemElementEditorForm } from "./system-element-editor-form";
import { SystemElement } from "@/db/entities/system-element/schema";
import {
  useDeleteSystemElement,
  useUpdateSystemElement,
} from "./system-element-hooks";
import { SystemTechnology } from "@/db/entities/system-technology/schema";

type Props = {
  systemElement: Pick<
    SystemElement,
    "id" | "name" | "description" | "type" | "isExternal"
  > & { technologies: SystemTechnology[] };
} & Pick<React.ComponentProps<typeof Modal>, "opened" | "onClose">;

export function EditSystemElementModal(props: Props) {
  const updateSystemElement = useUpdateSystemElement();
  const deleteSystemElement = useDeleteSystemElement();

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
