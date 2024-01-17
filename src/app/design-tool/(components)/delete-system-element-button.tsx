"use client";

import { Button, Text } from "@mantine/core";
import { useDeleteSystemElement } from "./system-element-hooks";
import { openConfirmModal } from "@mantine/modals";
import { SystemElement } from "@/db/entities/system-element/schema";

type Props = Omit<React.ComponentProps<typeof Button<"button">>, "onClick"> & {
  onDelete?(): void;
  systemElement: Pick<SystemElement, "id">;
};

export function DeleteSystemElementButton(props: Props) {
  const deleteSystemElement = useDeleteSystemElement();

  return (
    <Button
      {...props}
      color="red"
      loading={props.loading || deleteSystemElement.isPending}
      disabled={props.disabled || deleteSystemElement.isPending}
      onClick={async () => {
        openConfirmModal({
          title: "Please confirm your action",
          children: <Text size="sm">Are you sure to delete this element?</Text>,
          labels: { confirm: "Confirm", cancel: "Cancel" },
          onConfirm: async () => {
            await deleteSystemElement.mutateAsync(props.systemElement);
            props.onDelete?.();
          },
        });
      }}
    >
      {props.children}
    </Button>
  );
}
