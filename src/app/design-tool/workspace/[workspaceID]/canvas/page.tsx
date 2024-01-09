"use client";

import { useMemo } from "react";
import { DesignToolEditorPage } from "../../../(components)/design-tool-editor-page";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactFlowProvider } from "reactflow";
import { Workspace } from "@/db/entities/workspace/schema";

type Props = {
  params: {
    workspaceID: Workspace["id"];
  };
};

export default function DesignToolCanvasPage(props: Props) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
    [],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        <DesignToolEditorPage workspace={{ id: props.params.workspaceID }} />
      </ReactFlowProvider>
    </QueryClientProvider>
  );
}
