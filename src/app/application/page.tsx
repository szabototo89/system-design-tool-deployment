import { MessageBoardCard } from "@/components/messageboard-card";
import { db } from "@/db/schema";
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
import { MessageBoardsTable } from "@/db/entities/message-boards/table";
import { messageBoardQuery } from "@/db/entities/message-boards/queries";
import { withComponentLogger } from "@/logging/logger";
import { getUserContext } from "@/app/api/auth/[...nextauth]/auth-options";

export default withComponentLogger(async function Home() {
  const messageBoards = await messageBoardQuery.queryAll();

  const createMessageBoard = async (formData: FormData) => {
    "use server";
    const userContext = await getUserContext({ redirectToLoginPage: true });

    const CreateMessageBoardFormDataSchema = zfd.formData({
      title: zfd.text(),
      description: zfd.text(),
    });
    const input = CreateMessageBoardFormDataSchema.parse(formData);

    await db.insert(MessageBoardsTable).values({
      status: "draft",
      ...input,
      createdBy: userContext.user().id,
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
});
