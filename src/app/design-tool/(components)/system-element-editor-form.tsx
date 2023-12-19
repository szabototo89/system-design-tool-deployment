"use client";
import { SystemElement } from "@/db/entities/system-element/schema";
import {
  TextInput,
  Select,
  Button,
  Stack,
  Group,
  Textarea,
  TagsInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

type FormData = Pick<SystemElement, "name" | "description" | "type"> & {
  technologies: readonly string[];
};

type Props = {
  initialValue?: FormData;
  onSubmit(values: FormData): void;
  isSubmitting: boolean;
  submitButtonLabel: string;
  startContent?: React.ReactNode;
};

export function SystemElementEditorForm(props: Props) {
  const form = useForm<FormData>({
    initialValues: {
      name: props.initialValue?.name ?? "",
      description: props.initialValue?.description ?? "",
      type: props.initialValue?.type ?? "system",
      technologies: [],
    },
  });

  const doesSupportTechnologies = ["container", "component"].includes(
    form.values.type ?? "",
  );

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();

        props.onSubmit({
          name: form.values.name,
          description: form.values.description,
          type: form.values.type,
          technologies: form.values.technologies,
        });
      }}
    >
      <Stack>
        <Stack gap="sm">
          <Select
            name="type"
            label="Type"
            placeholder="Select element type ..."
            data={["system", "person", "container", "component"]}
            size="xs"
            {...form.getInputProps("type")}
          />
          <TextInput
            name="name"
            label="Name"
            size="xs"
            {...form.getInputProps("name")}
          />
          <Textarea
            name="description"
            label="Description"
            size="xs"
            {...form.getInputProps("description")}
          />
          {doesSupportTechnologies && (
            <TagsInput
              label="Technologies"
              size="xs"
              {...form.getInputProps("technologies")}
            />
          )}
        </Stack>
        <Group justify="flex-end">
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
