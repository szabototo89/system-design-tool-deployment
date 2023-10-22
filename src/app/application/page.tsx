import { MessageBoardCard } from "@/components/messageboard-card";
import { db, queryMessageBoards } from "@/db/schema";
import { MessageBoards } from "@/db/schemas/messageBoards.schema";
import {
  Button,
  Divider,
  SimpleGrid,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { zfd } from "zod-form-data";
import { revalidatePath } from "next/cache";

export default async function Home() {
  const messageBoards = await queryMessageBoards();

  const createMessageBoard = async (formData: FormData) => {
    "use server";

    const CreateMessageBoardFormDataSchema = zfd.formData({
      title: zfd.text(),
      description: zfd.text(),
    });
    const input = CreateMessageBoardFormDataSchema.parse(formData);

    await db.insert(MessageBoards).values({
      status: "draft",
      ...input,
    });

    revalidatePath("/");
  };

  return (
    <Stack gap={16}>
      <form action={createMessageBoard}>
        <TextInput name="title" label="Title" />
        <Textarea name="description" label="Description" />
        <Button type="submit">Submit</Button>
      </form>

      <Divider labelPosition="center" label="Browse your message boards" />

      <SimpleGrid cols={3}>
        {messageBoards.map((messageBoard) => (
          <MessageBoardCard key={messageBoard.id} messageBoard={messageBoard} />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
