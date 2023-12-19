"use client";
import { SystemElement } from "@/db/entities/system-element/schema";
import { TextInput, Select, Button, Stack, Group } from "@mantine/core";
import { useForm } from "@mantine/form";

type FormData = Pick<SystemElement, "name" | "description" | "type">;

type Props = {
  initialValue?: FormData;
  onSubmit(values: FormData): void;
  isSubmitting: boolean;
  submitButtonLabel: string;
  startContent?: React.ReactNode;
};

export function SystemElementEditorForm(props: Props) {
  const form = useForm<Pick<SystemElement, "name" | "description" | "type">>({
    initialValues: {
      name: props.initialValue?.name ?? "",
      description: props.initialValue?.description ?? "",
      type: props.initialValue?.type ?? "system",
    },
  });

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();

        props.onSubmit({
          name: form.values.name,
          description: form.values.description,
          type: form.values.type,
        });
      }}
    >
      <Stack>
        <Stack gap="sm">
          <TextInput
            name="name"
            label="Element name"
            size="xs"
            {...form.getInputProps("name")}
          />
          <TextInput
            name="description"
            label="Description"
            size="xs"
            {...form.getInputProps("description")}
          />
          <Select
            name="type"
            label="Type"
            placeholder="Select element type ..."
            data={["system", "person", "container", "component"]}
            size="xs"
            {...form.getInputProps("type")}
          />
        </Stack>
        <Group justify="space-between">
          {props.startContent}
          <Button
            disabled={props.isSubmitting}
            loading={props.isSubmitting}
            type="submit"
          >
            {props.submitButtonLabel}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
