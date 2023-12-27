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
  Checkbox,
  Fieldset,
} from "@mantine/core";
import { useForm } from "@mantine/form";

type FormData = Pick<
  SystemElement,
  "name" | "description" | "type" | "isExternal"
> & {
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
      technologies: props.initialValue?.technologies ?? [],
      isExternal: props.initialValue?.isExternal ?? false,
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
          isExternal: form.values.isExternal,
        });
      }}
    >
      <Stack>
        <Stack gap="sm">
          <Select
            name="type"
            label="Type"
            description="Category of the element (e.g., container, component, person, system)."
            placeholder="Select element type ..."
            data={["system", "person", "container", "component"]}
            size="xs"
            {...form.getInputProps("type")}
          />
          <TextInput
            name="name"
            label="Name"
            description="Unique label for the element."
            size="xs"
            {...form.getInputProps("name")}
          />
          <Textarea
            name="description"
            label="Description"
            description="Brief info about the element's purpose or functionality."
            size="xs"
            {...form.getInputProps("description")}
          />
          {doesSupportTechnologies && (
            <TagsInput
              label="Technologies"
              description="List of key associated technologies."
              size="xs"
              {...form.getInputProps("technologies")}
            />
          )}
          <Fieldset variant="unstyled" legend="Modifiers">
            <Checkbox
              label="Is external?"
              description="Mark as external if system element is not part of this organization"
              size="xs"
              {...form.getInputProps("isExternal", { type: "checkbox" })}
            />
          </Fieldset>
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
