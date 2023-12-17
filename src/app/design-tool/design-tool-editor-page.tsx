"use client";

import { useQuery } from "@tanstack/react-query";
import { queryAll as systemElementQueryAll } from "@/db/entities/system-element/server-actions";
import { GraphEditor } from "./(components)/graph-editor";
import { Text } from "@mantine/core";
import { queryAll as systemElementRelationQueryAll } from "@/db/entities/system-element-relation.server-actions";

export function DesignToolEditorPage() {
  const systemElements = useQuery({
    queryKey: ["system-element"],
    async queryFn() {
      return await systemElementQueryAll();
    },
  });

  const systemElementRelations = useQuery({
    queryKey: ["system-element-relation"],
    async queryFn() {
      return await systemElementRelationQueryAll();
    },
  });

  if (systemElements.isLoading || systemElementRelations.isLoading) {
    return <Text>Loading ...</Text>;
  }

  return (
    <GraphEditor
      initialSystemElements={systemElements.data ?? []}
      initialRelations={systemElementRelations.data ?? []}
    />
  );
}
