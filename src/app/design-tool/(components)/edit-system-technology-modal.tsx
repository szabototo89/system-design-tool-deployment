import {
  Button,
  Group,
  Modal,
  Select,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import { SystemTechnology } from "@/db/entities/system-technology/schema";
import { systemTechnologyUpdate } from "@/db/entities/system-technology/server-actions";
import { getSystemElementQueryKey } from "./system-element-hooks";
import { DeleteSystemTechnologyButton } from "./delete-system-technology-button";

type Props = {
  systemTechnology: Pick<
    SystemTechnology,
    "id" | "name" | "description"
  > | null;
} & Pick<React.ComponentProps<typeof Modal>, "opened" | "onClose">;

export function EditSystemTechnologyModal(props: Props) {
  const form = useForm<Pick<SystemTechnology, "name" | "description">>({
    initialValues: {
      name: props.systemTechnology?.name ?? "",
      description: props.systemTechnology?.description ?? "",
    },
  });

  const queryClient = useQueryClient();
  const updateSystemTechnology = useMutation({
    mutationFn: systemTechnologyUpdate,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: getSystemElementQueryKey(),
      });
    },
  });

  return (
    <Modal {...props} title="Edit technology" centered>
      <form
        onSubmit={async (ev) => {
          ev.preventDefault();

          if (props.systemTechnology == null) {
            return;
          }

          await updateSystemTechnology.mutateAsync({
            id: props.systemTechnology.id,
            name: form.values.name,
            description: form.values.description,
          });

          props.onClose();
        }}
      >
        <Stack>
          <Stack gap="sm">
            <TextInput label="Name" size="xs" {...form.getInputProps("name")} />
            <Textarea
              label="Description"
              size="xs"
              autosize
              minRows={4}
              maxRows={8}
              {...form.getInputProps("description")}
            />
          </Stack>
          <Group justify="flex-end">
            {props.systemTechnology != null && (
              <DeleteSystemTechnologyButton
                variant="outline"
                color="red"
                systemTechnology={props.systemTechnology}
              >
                Delete
              </DeleteSystemTechnologyButton>
            )}
            <Button
              disabled={updateSystemTechnology.isPending}
              loading={updateSystemTechnology.isPending}
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
