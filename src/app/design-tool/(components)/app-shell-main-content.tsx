import {
  AppShellMain,
  Box,
  Text,
  Title,
  Divider,
  Flex,
  Space,
  Stack,
  Group,
} from "@mantine/core";

type Props = React.PropsWithChildren<{
  title: string;
  subtitle: string;
  endContent?: React.ReactNode;
}>;

export function AppShellMainContent(props: Props) {
  return (
    <AppShellMain
      mih="calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px))"
      pos="relative"
    >
      <Box px="xl" py="md" bg="gray.2" pos="relative" h="100%">
        <Group justify="space-between">
          <Stack gap={2}>
            <Title order={3}>{props.title}</Title>
            <Text>{props.subtitle}</Text>
          </Stack>

          <Box>{props.endContent}</Box>
        </Group>

        <Space h="md" />

        {props.children}
      </Box>
    </AppShellMain>
  );
}
