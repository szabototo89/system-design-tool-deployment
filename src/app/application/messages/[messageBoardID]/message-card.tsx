import { Card, CardSection, Text, Image, Stack } from "@mantine/core";
import { db, imageID, queryImageByID } from "@/db/schema";
import { Button } from "@mantine/core";
import { ActionButton } from "@/components/action-button";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { Message, Messages } from "@/db/schemas/messages.schema";
import React from "react";
import {
  EntityCard,
  EntityCardFooter,
  EntityCardHeader,
} from "@/components/entity-card";

type Props = {
  message: Message;
};

export async function MessageCard(props: Props) {
  const image =
    props.message.imageID != null
      ? await queryImageByID(imageID(props.message.imageID))
      : null;

  return (
    <EntityCard
      header={
        <EntityCardHeader
          title="Message from anonymous"
          time={props.message.createdAt}
          image={<Image src={image?.imageSrc()} alt="Message header image" />}
        />
      }
      footer={
        <EntityCardFooter>
          <Button variant="default">Copy link</Button>
          <ActionButton
            onClick={async () => {
              "use server";

              await db
                .delete(Messages)
                .where(eq(Messages.id, props.message.id));
              revalidatePath("/messages/[messageBoardID]/page");
            }}
          >
            Delete
          </ActionButton>
        </EntityCardFooter>
      }
    >
      <Text size="sm">{props.message.content}</Text>
    </EntityCard>
  );
}
