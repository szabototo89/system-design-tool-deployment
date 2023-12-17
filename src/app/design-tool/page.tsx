"use client";

import { useMemo } from "react";
import { DesignToolEditorPage } from "./design-tool-editor-page";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactFlowProvider } from "reactflow";
import { CreateSystemElementModal } from "./(components)/create-system-element-modal";
import { useDisclosure } from "@mantine/hooks";
import { Button } from "@mantine/core";

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

  const [isOpened, { open, close }] = useDisclosure(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        <Button onClick={open}>Add element</Button>
        <CreateSystemElementModal opened={isOpened} onClose={close} />
        <DesignToolEditorPage />
      </ReactFlowProvider>
    </QueryClientProvider>
  );
}
