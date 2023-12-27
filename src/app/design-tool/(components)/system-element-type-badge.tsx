import { SystemElement } from "@/db/entities/system-element/schema";
import { Badge, MantineColor } from "@mantine/core";

type Props = {
  systemElement: SystemElement;
};

const badgeColors = {
  system: "dark",
  container: "blue",
  component: "green",
  person: "orange",
} as const satisfies Record<NonNullable<SystemElement["type"]>, MantineColor>;

export function SystemElementTypeBadge(props: Props) {
  const badgeColor =
    props.systemElement.type != null
      ? badgeColors[props.systemElement.type]
      : "";

  return (
    <Badge size="xs" variant="light" color={badgeColor}>
      {props.systemElement.isExternal && <>External </>}
      {props.systemElement.type}
    </Badge>
  );
}
