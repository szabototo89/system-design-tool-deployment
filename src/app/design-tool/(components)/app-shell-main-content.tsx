import { AppShellMain, Box, Text, Title, Divider, Flex } from "@mantine/core";

type Props = React.PropsWithChildren<{
  title: string;
  subtitle: string;
}>;

export function AppShellMainContent(props: Props) {
  return (
    <AppShellMain h="calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px))">
      <Flex h="100%">
        <Box px="xl" py="md" bg="gray.2" pos="relative" h="100%">
          <Title order={3}>{props.title}</Title>
          <Text>{props.subtitle}</Text>

          <Divider my="md" />

          {props.children}
        </Box>
      </Flex>
    </AppShellMain>
  );
}
