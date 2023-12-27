import {
  Button,
  Group,
  Modal,
  Select,
  Stack,
  TagsInput,
  TextInput,
} from "@mantine/core";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SystemElementRelation } from "@/db/entities/system-element-relation/schema";
import {
  SystemElementRelationDelete,
  SystemElementRelationUpdate,
} from "@/db/entities/system-element-relation/server-actions";
import { useForm } from "@mantine/form";

type Props = {
  systemElementRelation: Pick<
    SystemElementRelation,
    "id" | "label" | "technologies"
  > | null;
} & Pick<React.ComponentProps<typeof Modal>, "opened" | "onClose">;

export function EditSystemElementRelationModal(props: Props) {
  const form = useForm<
    Pick<SystemElementRelation, "label"> & {
      technologies: readonly SystemElementRelation["technologies"][number]["name"][];
    }
  >({
    initialValues: {
      label: props.systemElementRelation?.label ?? "",
      technologies:
        props.systemElementRelation?.technologies.map(
          (technology) => technology.name,
        ) ?? [],
    },
  });

  const queryClient = useQueryClient();
  const updateSystemElementRelation = useMutation({
    mutationFn: SystemElementRelationUpdate,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["system-element-relation"],
      });
    },
  });
  const deleteSystemElementRelation = useMutation({
    mutationFn: SystemElementRelationDelete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["system-element-relation"],
      });
    },
  });

  return (
    <Modal {...props} title="Edit relation" centered>
      <form
        onSubmit={async (ev) => {
          ev.preventDefault();

          if (props.systemElementRelation == null) {
            return;
          }

          await updateSystemElementRelation.mutateAsync({
            entity: props.systemElementRelation,
            params: {
              label: form.values.label,
              technologies: form.values.technologies,
            },
          });

          props.onClose();
        }}
      >
        <Stack>
          <Stack gap="sm">
            <TextInput
              label="Label"
              size="xs"
              {...form.getInputProps("label")}
            />
            <TagsInput
              label="Technologies"
              description="List of key associated technologies."
              size="xs"
              {...form.getInputProps("technologies")}
            />
          </Stack>
          <Group justify="space-between">
            <Button
              variant="outline"
              color="red"
              loading={deleteSystemElementRelation.isPending}
              disabled={deleteSystemElementRelation.isPending}
              onClick={async () => {
                if (props.systemElementRelation == null) {
                  return;
                }

                await deleteSystemElementRelation.mutate(
                  props.systemElementRelation,
                );
                props.onClose();
              }}
            >
              Delete
            </Button>

            <Button
              disabled={updateSystemElementRelation.isPending}
              loading={updateSystemElementRelation.isPending}
              type="submit"
            >
              Save changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
