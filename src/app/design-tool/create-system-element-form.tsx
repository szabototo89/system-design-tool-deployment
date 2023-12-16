"use client";
import { SystemElement } from "@/db/entities/system-element/schema";
import { create as systemElementCreate } from "@/db/entities/system-element/server-actions";
import { TextInput, Select, Button, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useReactFlow } from "reactflow";

export function CreateSystemElementForm() {
  const queryClient = useQueryClient();

  const createSystemElement = useMutation({
    mutationFn: systemElementCreate,
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: ["system-element"],
      });
    },
  });

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
        createSystemElement.mutate({
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
        <Button disabled={createSystemElement.isPending} type="submit">
          Create element
        </Button>
      </Stack>
    </form>
  );
}
