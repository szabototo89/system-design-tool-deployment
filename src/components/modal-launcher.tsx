import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";

type RenderModalOptions = {
  isOpened: boolean;
  close(): void;
};

type ButtonProps = React.ComponentProps<typeof Button<"button">>;

type Props = {
  renderModal(options: RenderModalOptions): React.ReactNode;
} & ButtonProps;

export function ModalLauncher({ renderModal, ...buttonProps }: Props) {
  const [isOpened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button
        {...buttonProps}
        onClick={(event) => {
          open();
          buttonProps.onClick?.(event);
        }}
      />
      {renderModal({ isOpened, close })}
    </>
  );
}
