import {
  SystemElement,
  SystemElementEntity,
} from "@/db/entities/system-element/schema";
import { db } from "@/db/schema";
import {
  Text,
  Card,
  Group,
  Stack,
  List,
  ListItem,
  Anchor,
  SimpleGrid,
  Badge,
  ThemeIcon,
} from "@mantine/core";
import {
  IconArrowMoveLeft,
  IconArrowMoveRight,
  IconCaretRight,
} from "@tabler/icons-react";

import { AppShellMainContent } from "../../../../(components)/app-shell-main-content";
import React from "react";
import { RelativeTimestamp } from "@/components/relative-timestamp";
import Link from "next/link";
import { SystemTechnologyInfoHoverCard } from "../../../../(components)/system-technology-info-hover-card";
import { SystemElementRelationEntity } from "@/db/entities/system-element-relation/schema";
import { AbsoluteTimestamp } from "@/components/absolute-timestamp";
import { DeleteSystemElementButton } from "@/app/design-tool/(components)/delete-system-element-button";

type Props = {
  params: { systemElementID: SystemElement["id"] };
};

async function SystemElementAnchor(props: {
  systemElement: Pick<SystemElement, "id">;
}) {
  const systemElement = await SystemElementEntity.queries.queryById(
    db,
    props.systemElement,
  );

  if (systemElement == null) {
    return null;
  }

  return (
    <Anchor
      component={Link}
      key={systemElement.id}
      href={systemElement.id}
      target="_blank"
    >
      {systemElement.name}
    </Anchor>
  );
}

function CardInfoText(props: React.PropsWithChildren<{ label: string }>) {
  return (
    <Stack gap={0}>
      <Text tt="uppercase" size="xs" fw={500} c="dimmed">
        {props.label}
      </Text>
      {props.children}
    </Stack>
  );
}

export default async function SystemElementDetailsPage(props: Props) {
  const systemElement = await SystemElementEntity.queries.queryById(db, {
    id: props.params.systemElementID,
  });

  if (systemElement == null) {
    return null;
  }

  const children = await SystemElementEntity.queries.queryChildrenFrom(
    db,
    systemElement,
  );

  const incomingRelations =
    await SystemElementRelationEntity.queries.queryFromSystemElementTarget(
      db,
      systemElement,
    );

  const outgoingRelations =
    await SystemElementRelationEntity.queries.queryFromSystemElementSource(
      db,
      systemElement,
    );

  const parentSystemElement =
    systemElement.parentID != null
      ? await SystemElementEntity.queries.queryById(db, {
          id: systemElement.parentID,
        })
      : null;

  return (
    <AppShellMainContent
      title={systemElement.name ?? ""}
      subtitle="System element"
      endContent={
        <DeleteSystemElementButton systemElement={systemElement}>
          Delete
        </DeleteSystemElementButton>
      }
    >
      <SimpleGrid>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Details</Text>
          </Group>

          <Stack>
            <CardInfoText label="Type">
              <Text tt="capitalize">{systemElement.type}</Text>
            </CardInfoText>

            <CardInfoText label="Description">
              {systemElement.description}
            </CardInfoText>

            {systemElement.technologies.length > 0 && (
              <CardInfoText label="Technologies">
                <Group mt={4} gap="xs">
                  {systemElement.technologies.map((technology) => (
                    <SystemTechnologyInfoHoverCard
                      key={technology.id}
                      systemTechnology={technology}
                    >
                      <Badge variant="outline">{technology.name}</Badge>
                    </SystemTechnologyInfoHoverCard>
                  ))}
                </Group>
              </CardInfoText>
            )}

            <CardInfoText label="Created at">
              <AbsoluteTimestamp>{systemElement.createdAt}</AbsoluteTimestamp>
            </CardInfoText>

            {parentSystemElement != null && (
              <CardInfoText label="Part of">
                <SystemElementAnchor systemElement={parentSystemElement} />
                <Text size="xs" c="dimmed">
                  {parentSystemElement.description}
                </Text>
              </CardInfoText>
            )}
          </Stack>
        </Card>

        {children.length > 0 && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group gap="xs" align="baseline" mb="xs">
              <Text fw={500}>Children</Text>
              <Badge variant="light" size="lg">
                {children.length}
              </Badge>
            </Group>

            <List
              size="xs"
              icon={
                <ThemeIcon variant="light">
                  <IconCaretRight />
                </ThemeIcon>
              }
            >
              {children.map((child) => {
                return (
                  <ListItem key={child.id}>
                    <SystemElementAnchor systemElement={child} />
                    <Text size="xs" c="dimmed">
                      {child.description}
                    </Text>
                  </ListItem>
                );
              })}
            </List>
          </Card>
        )}

        <SimpleGrid cols={2}>
          {incomingRelations.length > 0 && (
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group gap="xs" align="baseline" mb="xs">
                <Text fw={500}>Incoming relations</Text>
                <Badge variant="light" size="lg">
                  {incomingRelations.length}
                </Badge>
              </Group>

              <List
                size="xs"
                icon={
                  <ThemeIcon variant="light">
                    <IconArrowMoveLeft />
                  </ThemeIcon>
                }
              >
                {incomingRelations.map((relation) => {
                  return (
                    <ListItem key={relation.id}>
                      <SystemElementAnchor
                        systemElement={{ id: relation.sourceID }}
                      />
                      <Text size="xs" c="dimmed">
                        {relation.label}
                      </Text>
                    </ListItem>
                  );
                })}
              </List>
            </Card>
          )}

          {outgoingRelations.length > 0 && (
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group gap="xs" align="baseline" mb="xs">
                <Text fw={500}>Outgoing relations</Text>
                <Badge variant="light" size="lg">
                  {outgoingRelations.length}
                </Badge>
              </Group>

              <List
                size="xs"
                icon={
                  <ThemeIcon variant="light">
                    <IconArrowMoveRight />
                  </ThemeIcon>
                }
              >
                {outgoingRelations.map((relation) => {
                  return (
                    <ListItem key={relation.id}>
                      <SystemElementAnchor
                        systemElement={{ id: relation.targetID }}
                      />
                      <Text size="xs" c="dimmed">
                        {relation.label}
                      </Text>
                    </ListItem>
                  );
                })}
              </List>
            </Card>
          )}
        </SimpleGrid>
      </SimpleGrid>
    </AppShellMainContent>
  );
}
