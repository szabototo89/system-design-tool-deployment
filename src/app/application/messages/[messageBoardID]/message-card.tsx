import { Button, Image, Text } from "@mantine/core";
import { db, messageQuery } from "@/db/schema";
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
import { MessagesTable } from "@/db/entities/messages/tables";
import { Message } from "@/db/entities/messages/types";
import { messageAction } from "@/db/entities/messages/actions";
import { withComponentLogger } from "@/logging/logger";

type Props = {
  message: Message;
};

export const MessageCard = withComponentLogger(async function MessageCard(
  props: Props,
) {
  const image = await messageQuery.queryImage(props.message);

  return (
    <EntityCard
      header={
        <EntityCardHeader
          title="Message from anonymous"
          time={props.message.createdAt}
          image={
            <Image
              component={NextImage}
              src={"/application/images/" + image?.id}
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

              await messageAction.delete(props.message);

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
});
