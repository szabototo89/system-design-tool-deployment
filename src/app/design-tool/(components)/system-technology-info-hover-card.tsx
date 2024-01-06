"use client";

import {
  ActionIcon,
  Badge,
  Button,
  Group,
  HoverCard,
  ScrollArea,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import { EditSystemTechnologyModal } from "./edit-system-technology-modal";
import { SystemTechnology } from "@/db/entities/system-technology/schema";
import React, { useState } from "react";
import { IconPencil } from "@tabler/icons-react";

type Props = React.PropsWithChildren<{
  systemTechnology: SystemTechnology;
}>;

export function SystemTechnologyInfoHoverCard(props: Props) {
  const [isHoverCardShown, setHoverCardShown] = useState(false);
  const [isModalOpened, setModalOpened] = useState(false);

  return (
    <>
      <HoverCard
        width={280}
        shadow="md"
        initiallyOpened={isHoverCardShown}
        openDelay={1000}
        closeDelay={100}
        onOpen={() => setHoverCardShown(true)}
        onClose={() => setHoverCardShown(false)}
      >
        <HoverCard.Target>{props.children}</HoverCard.Target>
        <HoverCard.Dropdown>
          <Stack gap="md">
            <Group justify="space-between">
              <Stack gap={0}>
                <Text size="xs" fw={500}>
                  {props.systemTechnology.name}
                </Text>
                <Text c="dimmed" size="xs">
                  technology
                </Text>
              </Stack>
              <ActionIcon
                variant="light"
                size={24}
                onClick={() => {
                  setHoverCardShown(false);
                  setModalOpened(true);
                }}
              >
                <IconPencil style={{ width: rem(16), height: rem(16) }} />
              </ActionIcon>
            </Group>
            {!!props.systemTechnology.description && (
              <ScrollArea h={100} scrollHideDelay={500}>
                <Text size="xs" c="dimmed">
                  {props.systemTechnology.description}
                </Text>
              </ScrollArea>
            )}
          </Stack>
        </HoverCard.Dropdown>
      </HoverCard>
      <EditSystemTechnologyModal
        systemTechnology={props.systemTechnology}
        opened={isModalOpened}
        onClose={() => setModalOpened(false)}
      />
    </>
  );
}
