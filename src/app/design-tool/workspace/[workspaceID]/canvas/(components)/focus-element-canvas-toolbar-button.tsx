import { ActionIcon } from "@mantine/core";
import { IconFocusCentered } from "@tabler/icons-react";
import { useReactFlow } from "reactflow";
import { useSystemElementSelectionState } from "../../../app-state";

export function FocusElementCanvasToolbarButton() {
  const [selectedElementID] = useSystemElementSelectionState();
  const instance = useReactFlow();

  return (
    <ActionIcon
      variant="default"
      title="Focus"
      disabled={selectedElementID == null}
      onClick={() => {
        if (selectedElementID == null) {
          return;
        }

        instance.fitView({
          nodes: [{ id: selectedElementID }],
          duration: 1000,
          maxZoom: 1.15,
        });
      }}
    >
      <IconFocusCentered />
    </ActionIcon>
  );
}
