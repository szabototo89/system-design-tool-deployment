"use client";

import {
  AppShell,
  Stack,
  Group,
  Burger,
  Box,
  Button,
  TextInput,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useAsideState } from "./app-state";

function AppShellNavbarItem({
  children,
  ...restProps
}: React.PropsWithChildren<React.ComponentProps<typeof Link>>) {
  return (
    <Text
      component={Link}
      size="sm"
      py="xs"
      px="md"
      display="block"
      fw={500}
      {...restProps}
    >
      {children}
    </Text>
  );
}

export default function DesignToolIndexPageLayout(
  props: React.PropsWithChildren<{}>,
) {
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
  const [isNavbarOpened, setNavbarOpened] = useState(false);
  const [, setAsideOpened] = useAsideState();

  return (
    <QueryClientProvider client={queryClient}>
      <AppShell
        layout="alt"
        header={{ height: 70 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { desktop: !isNavbarOpened, mobile: !isNavbarOpened },
        }}
      >
        <AppShell.Navbar p="md">
          <Stack>
            <Group justify="space-between">
              <Text>System Design Tool</Text>
              <Burger
                opened={isNavbarOpened}
                onClick={() => setNavbarOpened((previous) => !previous)}
                size="sm"
              />
            </Group>

            <Box pl={0} mb="md">
              <Text tt="uppercase" size="xs" fw={500} mb="sm">
                Dashboard
              </Text>

              <AppShellNavbarItem href="/design-tool/canvas">
                Canvas
              </AppShellNavbarItem>
              <AppShellNavbarItem href="/design-tool/library">
                Library
              </AppShellNavbarItem>
            </Box>

            <Box pl={0} mb="md">
              <Text tt="uppercase" size="xs" fw={500} mb="sm">
                Settings
              </Text>
            </Box>
          </Stack>
        </AppShell.Navbar>

        <AppShell.Header px="md">
          <Group align="center" justify="space-between" h="100%">
            <Group align="center">
              {!isNavbarOpened && (
                <Burger
                  opened={isNavbarOpened}
                  onClick={() => setNavbarOpened((previous) => !previous)}
                  size="sm"
                />
              )}
              <TextInput placeholder="Search ..." />
            </Group>
            <Button onClick={() => setAsideOpened((previous) => !previous)}>
              Toggle
            </Button>
          </Group>
        </AppShell.Header>

        {props.children}
      </AppShell>
    </QueryClientProvider>
  );
}
