import { ButtonGroup } from "@mantine/core";
import { FocusElementCanvasToolbarButton } from "./focus-element-canvas-toolbar-button";
import { ToggleElementCanvasToolbarButton } from "./toggle-element-canvas-toolbar-button";

export function CanvasToolbar() {
  return (
    <ButtonGroup>
      <FocusElementCanvasToolbarButton />
      <ToggleElementCanvasToolbarButton />
    </ButtonGroup>
  );
}
