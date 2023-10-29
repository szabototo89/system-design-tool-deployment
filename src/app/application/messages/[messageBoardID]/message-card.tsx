import { Card, CardSection, Text, Image, Stack } from "@mantine/core";
import { db, imageID, queryImageByID } from "@/db/schema";
import { ActionButton } from "@/components/action-button";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { Message, Messages } from "@/db/schemas/messages.schema";
import React from "react";

type Props = {
  message: Message;
};

export async function MessageCard(props: Props) {
  const image =
    props.message.imageID != null
      ? await queryImageByID(imageID(props.message.imageID))
      : null;

  return (
    <Card shadow="sm" radius="md" withBorder>
      {image != null && <MessageCardHeaderImage imageSrc={image.imageSrc()} />}

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
