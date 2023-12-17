"use client";
import { SystemElement } from "@/db/entities/system-element/schema";
import { TextInput, Select, Button, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

type FormData = Pick<SystemElement, "name" | "description" | "type">;

type Props = {
  onSubmit(values: FormData): void;
  isSubmitting: boolean;
};

export function CreateSystemElementForm(props: Props) {
  const form = useForm<Pick<SystemElement, "name" | "description" | "type">>({
    initialValues: {
      name: "",
      description: "",
      type: "system",
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
        <Button disabled={props.isSubmitting} type="submit">
          Create element
        </Button>
      </Stack>
    </form>
  );
}
