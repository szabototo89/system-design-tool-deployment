import { ActionIcon } from "@mantine/core";
import {
  useExpandedGraphElements,
  useIsGraphElementExpanded,
  useSystemElementSelectionState,
} from "../../../app-state";
import { IconArrowsMaximize, IconArrowsMinimize } from "@tabler/icons-react";

export function ToggleElementCanvasToolbarButton() {
  const [selectedElementID] = useSystemElementSelectionState();
  const setExpanded = useExpandedGraphElements();
  const getGraphElementExpanded = useIsGraphElementExpanded();

  const isExpanded =
    selectedElementID != null && getGraphElementExpanded(selectedElementID);

  return (
    <ActionIcon
      variant="default"
      title="Expand/collapse"
      disabled={selectedElementID == null}
      onClick={() => {
        if (selectedElementID == null) {
          return;
        }

        setExpanded(selectedElementID, !isExpanded);
      }}
    >
      {!isExpanded ? <IconArrowsMaximize /> : <IconArrowsMinimize />}
    </ActionIcon>
  );
}
