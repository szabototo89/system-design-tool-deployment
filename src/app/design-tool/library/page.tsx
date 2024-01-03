import {
  SystemElementEntity,
  SystemElementSchema,
} from "@/db/entities/system-element/schema";
import { db } from "@/db/schema";
import {
  Card,
  SimpleGrid,
  Text,
  TabsPanel,
  ThemeIcon,
  Group,
} from "@mantine/core";
import { SystemElementCardItem } from "../elements/(components)/system-element-card-item";
import { SystemTechnologyEntity } from "@/db/entities/system-technology/schema";
import { SystemElementRelationEntity } from "@/db/entities/system-element-relation/schema";
import { IconArrowNarrowRight } from "@tabler/icons-react";

function sortBy<TValue>(
  elements: Iterable<TValue>,
  getter: (value: TValue) => number | string,
): ReadonlyArray<TValue> {
  return Array.from(elements).sort((left, right) => {
    return getter(left) < getter(right) ? -1 : 1;
  });
}

export default async function DesignToolElementsPage() {
  const systemElements = await SystemElementEntity.queries.queryAll(db);
  const systemElementsSortedByName = sortBy(
    systemElements,
    (element) => element?.name ?? "",
  );

  const systemElementRelations = sortBy(
    await SystemElementRelationEntity.queries
      .queryAll(db)
      .then(async (relations) => {
        return await Promise.all(
          relations.map(async (relation) => {
            const [sourceElement, targetElement] = await Promise.all([
              SystemElementEntity.queries.queryById(db, {
                id: relation.sourceID,
              }),
              SystemElementEntity.queries.queryById(db, {
                id: relation.targetID,
              }),
            ]);

            return {
              ...relation,
              sourceElement,
              targetElement,
            };
          }),
        );
      }),
    (relation) => relation.label ?? "",
  );

  const technologies = sortBy(
    await SystemTechnologyEntity.queries.queryAll(db),
    (technology) => technology.name,
  );

  return (
    <>
      <TabsPanel value="elements">
        <SimpleGrid cols={{ sm: 2, md: 3 }}>
          {systemElementsSortedByName.map((systemElement) => (
            <SystemElementCardItem
              key={systemElement.id}
              systemElement={systemElement}
            />
          ))}
        </SimpleGrid>
      </TabsPanel>

      <TabsPanel value="relations">
        <SimpleGrid cols={{ sm: 2, md: 3 }}>
          {systemElementRelations.map((relation) => {
            return (
              <Card key={relation.id}>
                <Group gap={4}>
                  <Text size="sm" c="dimmed">
                    {relation.sourceElement?.name}
                  </Text>
                  <ThemeIcon variant="white" color="gray" size="sm">
                    <IconArrowNarrowRight />
                  </ThemeIcon>
                  <Text size="sm" c="dimmed">
                    {relation.targetElement?.name}
                  </Text>
                </Group>

                <Text fw={500} lineClamp={1} title={relation.label ?? ""}>
                  {relation.label}
                </Text>
              </Card>
            );
          })}
        </SimpleGrid>
      </TabsPanel>

      <TabsPanel value="technologies">
        <SimpleGrid cols={{ sm: 2, md: 3 }}>
          {technologies.map((technology) => (
            <Card key={technology.id}>
              <Text fw={500}>{technology.name}</Text>
              <Text
                size="sm"
                c="dimmed"
                lineClamp={1}
                title={technology.description}
              >
                {technology.description
                  ? technology.description
                  : "No description."}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </TabsPanel>
    </>
  );
}
