import { SystemElement } from "@/db/entities/system-element/schema";
import {
  Card,
  Group,
  Text,
  CardSection,
  Button,
  Divider,
  Stack,
} from "@mantine/core";
import { SystemElementTypeBadge } from "../../(components)/system-element-type-badge";

type Props = { systemElement: SystemElement };

export function SystemElementCardItem(props: Props) {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <CardSection inheritPadding>
        <Group justify="space-between" mb="md">
          <Group gap={4} align="baseline">
            <Text fw={500} inline>
              {props.systemElement.name}
            </Text>
          </Group>

          <SystemElementTypeBadge
            size="md"
            systemElement={props.systemElement}
          />
        </Group>
      </CardSection>

      <Stack>
        <Text c="dimmed" lineClamp={4}>
          {props.systemElement.description}
        </Text>

        <Button>Details</Button>

        {/* <Group mt="md" gap={2}>
          {props.systemElement.technologies.map((technology) => (
            <SystemTechnologyInfoHoverCard
              key={technology.id}
              systemTechnology={technology}
            >
              <Badge size="xs" variant="white">
                {technology.name}
              </Badge>
            </SystemTechnologyInfoHoverCard>
          ))}
        </Group> */}
      </Stack>
    </Card>
  );
}
