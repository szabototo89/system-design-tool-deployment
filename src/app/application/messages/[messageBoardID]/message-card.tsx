import { Button, Image, Text } from "@mantine/core";
import { db } from "@/db/schema";
import { ActionButton } from "@/components/action-button";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import React from "react";
import {
  EntityCard,
  EntityCardFooter,
  EntityCardHeader,
} from "@/components/entity-card";
import { NextImage } from "@/components/next-image";
import { Messages } from "@/db/entities/messages/tables";
import { Message } from "@/db/entities/messages/types";

type Props = {
  message: Message;
};

export async function MessageCard(props: Props) {
  const image = await props.message.image();

  return (
    <EntityCard
      header={
        <EntityCardHeader
          title="Message from anonymous"
          time={props.message.createdAt}
          image={
            <Image
              component={NextImage}
              src={image?.imageSrc()}
              alt="Message header image"
              width={640}
              height={180}
            />
          }
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
