import { MessageBoardCard } from "@/components/MessageBoardCard";
import { db, MessageBoardSchema } from "@/db/schema";
import { MessageBoards } from "@/db/schemas/messageBoards.schema";
import { Button, Textarea, TextInput } from "@mantine/core";
import { zfd } from "zod-form-data";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export default async function Home() {
  const messageBoards = z
    .array(MessageBoardSchema)
    .parse(await db.select().from(MessageBoards));

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
    <>
      <form action={createMessageBoard}>
        <TextInput name="title" label="Title" />
        <Textarea name="description" label="Description" />
        <Button type="submit">Submit</Button>
      </form>

      {messageBoards.map((messageBoard) => (
        <MessageBoardCard key={messageBoard.id} messageBoard={messageBoard} />
      ))}
    </>
  );
}
