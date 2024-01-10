import { SystemTechnology } from "@/db/entities/system-technology/schema";
import { systemTechnologyDelete } from "@/db/entities/system-technology/server-actions";
import { Button } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function DeleteSystemTechnologyButton({
  systemTechnology,
  ...buttonProps
}: React.ComponentProps<typeof Button<"button">> & {
  systemTechnology: Pick<SystemTechnology, "id">;
}) {
  const queryClient = useQueryClient();

  const deleteSystemTechnology = useMutation({
    async mutationFn(systemTechnology: Pick<SystemTechnology, "id">) {
      return await systemTechnologyDelete(systemTechnology);
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["system-technology"],
      });
    },
  });

  return (
    <Button
      {...buttonProps}
      disabled={deleteSystemTechnology.isPending || buttonProps.disabled}
      onClick={() => {
        openConfirmModal({
          title: "Are you sure to delete this technology?",
          confirmProps: {
            color: "red",
          },
          labels: {
            cancel: "Cancel",
            confirm: "Confirm",
          },
          async onConfirm() {
            await deleteSystemTechnology.mutateAsync(systemTechnology);
          },
        });
      }}
    />
  );
}
