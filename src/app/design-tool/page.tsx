import { SystemElementEntity } from "@/db/entities/system-element/schema";
import { db } from "@/db/schema";
import { Button, Select, Stack, Text, TextInput } from "@mantine/core";
import { zfd } from "zod-form-data";
import { revalidatePath } from "next/cache";
import { GraphEditor } from "./graph-editor";
import { SystemElementRelationEntity } from "@/db/entities/system-element-relation.schema";

export default async function DesignToolLandingPage() {
  const systemElements = await SystemElementEntity.queries.queryAll(db);
  const systemElementRelations =
    await SystemElementRelationEntity.queries.queryAll(db);

  return (
    <Stack>
      <form
        action={async (formData: FormData) => {
          "use server";

          const input = zfd
            .formData(
              SystemElementEntity.schema.pick({
                name: true,
                description: true,
                type: true,
              }),
            )
            .parse(formData);

          await SystemElementEntity.actions.create(db, input);
          revalidatePath("/design-tool");
        }}
      >
        <TextInput name="name" label="Element name" size="xs" />
        <TextInput name="description" label="Description" size="xs" />
        <Select
          name="type"
          label="Type"
          placeholder="Select element type ..."
          data={["system", "person", "container", "component"]}
          size="xs"
        />
        <Button type="submit">Create element</Button>
      </form>

      <GraphEditor
        systemElements={systemElements}
        relations={systemElementRelations}
        onConnect={async ({ source, target }) => {
          "use server";

          await SystemElementRelationEntity.actions.create(db, {
            sourceID: source,
            targetID: target,
            label: "test label",
          });
        }}
      />
    </Stack>
  );
}
