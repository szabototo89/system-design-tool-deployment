import { Card, Text } from "@mantine/core";
import { db } from "@/db/schema";
import { ActionButton } from "@/components/ActionButton";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { Message, Messages } from "@/db/schemas/messages.schema";

type Props = {
  message: Message;
};

export function MessageCard(props: Props) {
  return (
    <Card shadow="sm" padding="xl">
      <Text>{props.message.content}</Text>

      <ActionButton
        onClick={async () => {
          "use server";

          await db.delete(Messages).where(eq(Messages.id, props.message.id));
          revalidatePath("/messages/[messageBoardID]/page");
        }}
      >
        Delete
      </ActionButton>
    </Card>
  );
}
