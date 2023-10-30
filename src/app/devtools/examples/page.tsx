import { MessageBoardCard } from "@/components/messageboard-card";
import React from "react";
import {
  Button,
  Card,
  Container,
  Group,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { messageBoardQuery } from "@/db/entities/message-boards/queries";
import {
  MessageBoard,
  messageBoardID,
  MessageBoardSchema,
} from "@/db/entities/message-boards/types";
import { z } from "zod";

type Params =
  | {
      type: "manual";
      title: MessageBoard["title"];
      status: MessageBoard["status"];
      description: MessageBoard["description"];
    }
  | { type: "database"; entity: MessageBoard["id"] };

type Props = {
  searchParams?: Params;
};

export default async function StoriesPage(props: Props) {
  const data =
    props.searchParams?.type !== "database"
      ? MessageBoardSchema.parse({
          title: props.searchParams?.title ?? "Test title",
          status: props.searchParams?.status ?? "draft",
          description: props.searchParams?.description ?? "test description",
          createdAt: new Date(),
          id: 12,
        })
      : await messageBoardQuery.queryBy({
          id: messageBoardID(props.searchParams?.entity),
        });

  const messageBoards = await messageBoardQuery.queryAll();

  return (
    <Group>
      <Card withBorder style={{ height: "100vh" }}>
        <Stack gap={16}>
          <form>
            <Stack gap={16}>
              <Text fw={500}>Test data</Text>
              <input type="hidden" name="type" value="database" />
              <Select
                label="Entity"
                name="entity"
                defaultValue={
                  props.searchParams?.type === "database"
                    ? props.searchParams?.entity.toString()
                    : null
                }
                data={messageBoards.map((messageBoard) => ({
                  value: messageBoard.id.toString(),
                  label: messageBoard.title ?? "No title",
                }))}
              />
              <Button type="submit">Load</Button>
            </Stack>
          </form>

          <form>
            <Stack gap={16}>
              <Text fw={500}>Properties</Text>
              <Stack gap={8}>
                <input type="hidden" name="type" value="manual" />

                <TextInput
                  name="title"
                  label="Title"
                  defaultValue={data.title ?? undefined}
                />
                <Textarea
                  name="description"
                  label="Description"
                  defaultValue={data.description ?? undefined}
                />
                <Select
                  name="status"
                  label="Status"
                  data={[
                    {
                      value: "draft",
                      label: "Draft",
                    },
                    { value: "published", label: "Published" },
                  ]}
                  defaultValue={data.status}
                />
              </Stack>

              <Button type="submit">Apply</Button>
            </Stack>
          </form>
        </Stack>
      </Card>
      <Container>
        <Stack>
          <MessageBoardCard messageBoard={data} />
        </Stack>
      </Container>
    </Group>
  );
}
