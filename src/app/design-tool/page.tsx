"use client";

import { useMemo } from "react";
import { CreateSystemElementForm } from "./create-system-element-form";
import { DesignToolEditorPage } from "./design-tool-editor-page";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactFlowProvider } from "reactflow";

export default function DesignToolLandingPage() {
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
        <CreateSystemElementForm />
        <DesignToolEditorPage />
      </ReactFlowProvider>
    </QueryClientProvider>
  );
}
