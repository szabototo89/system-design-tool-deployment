import { Tabs, TabsList, TabsTab } from "@mantine/core";
import { IconHierarchy2, IconLine, IconCodeCircle2 } from "@tabler/icons-react";
import { AppShellMainContent } from "../(components)/app-shell-main-content";

export default function DesignToolLibraryPageLayout(
  props: React.PropsWithChildren<{}>,
) {
  return (
    <AppShellMainContent
      title="Library"
      subtitle="Browse among workspace elements, relations and technologies"
    >
      <Tabs defaultValue="elements">
        <TabsList my="md">
          <TabsTab value="elements" leftSection={<IconHierarchy2 />}>
            System elements
          </TabsTab>
          <TabsTab value="relations" leftSection={<IconLine />}>
            Relations
          </TabsTab>
          <TabsTab value="technologies" leftSection={<IconCodeCircle2 />}>
            Technologies
          </TabsTab>
        </TabsList>

        {props.children}
      </Tabs>
    </AppShellMainContent>
  );
}
