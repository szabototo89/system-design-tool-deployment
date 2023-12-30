import { SystemElementEntity } from "@/db/entities/system-element/schema";
import { db } from "@/db/schema";
import { SimpleGrid } from "@mantine/core";
import { SystemElementCardItem } from "./(components)/system-element-card-item";
import { AppShellMainContent } from "../(components)/app-shell-main-content";

export default async function DesignToolElementsPage() {
  const systemElements = await SystemElementEntity.queries.queryAll(db);
  const systemElementsSortedByName = systemElements.toSorted((left, right) =>
    (left.name ?? "") < (right.name ?? "") ? -1 : 1,
  );

  return (
    <AppShellMainContent
      title="Workspace elements"
      subtitle="Browse among workspace elements"
    >
      <SimpleGrid cols={{ sm: 2, md: 3 }}>
        {systemElementsSortedByName.map((systemElement) => (
          <SystemElementCardItem
            key={systemElement.id}
            systemElement={systemElement}
          />
        ))}
      </SimpleGrid>
    </AppShellMainContent>
  );
}
