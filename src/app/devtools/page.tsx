import { readSeedFile, seedDatabase } from "@/db/seed-script-utils";
import { ActionButton } from "@/components/action-button";
import {
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";

export default function DevToolsPage() {
  const resetDatabase = async () => {
    "use server";
    const seedFile = readSeedFile("src/db/seeds/real-life-seed.json");
    await seedDatabase(seedFile);
  };

  return (
    <Container>
      <Stack>
        <Title>Development tools</Title>

        <SimpleGrid cols={2}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text fw={500}>Database tools</Text>

            <Text size="sm" c="dimmed">
              Provides two essential functions: Drizzle Studio for easy database
              management, and a quick reset option with test data for
              streamlined testing and development. Manage your database
              effortlessly in one place.
            </Text>

            <Group>
              <Button
                component="a"
                target="_blank"
                href="http://localhost:4983/"
                variant="light"
                color="blue"
                mt="md"
                radius="md"
              >
                Open Drizzle Studio
              </Button>
              <ActionButton
                variant="outline"
                color="red"
                mt="md"
                radius="md"
                onClick={resetDatabase}
              >
                Reset database
              </ActionButton>
            </Group>
          </Card>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
