import { SystemElement } from "@/db/entities/system-element/schema";
import { db } from "@/db/schema";
import { Button, Stack, Text, TextInput } from "@mantine/core";
import { zfd } from "zod-form-data";
import { revalidatePath } from "next/cache";

export default async function DesignToolLandingPage() {
  const systemElements = await SystemElement.queries.queryAll(db);

  return (
    <Stack>
      <form
        action={async (formData: FormData) => {
          "use server";

          const input = zfd
            .formData(
              SystemElement.schema.pick({
                name: true,
                description: true,
                type: true,
              }),
            )
            .parse(formData);

          await SystemElement.actions.create(db, input);
          revalidatePath("/design-tool");
        }}
      >
        <TextInput name="name" label="Element name" />
        <TextInput name="description" label="Description" />
        <TextInput name="type" label="Type" />
        <Button type="submit">Create element</Button>
      </form>

      {systemElements.map((systemElement) => (
        <Text key={systemElement.id}>{systemElement.name}</Text>
      ))}
    </Stack>
  );
}
