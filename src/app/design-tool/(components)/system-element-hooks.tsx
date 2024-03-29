import {
  SystemElement,
  SystemElementIDSchema,
} from "@/db/entities/system-element/schema";
import {
  systemElementCreate,
  systemElementDelete,
  systemElementQueryFromWorkspace,
  systemElementQueryById,
  systemElementUpdate,
  systemElementUpdateParent,
} from "@/db/entities/system-element/server-actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { Workspace } from "@/db/entities/workspace/schema";

export const getSystemElementQueryKey = () => ["system-element"] as const;

export const useSystemElementQueryFromWorkspace = (
  workspace: Pick<Workspace, "id">,
) => {
  return useQuery({
    queryKey: getSystemElementQueryKey(),
    async queryFn() {
      return await systemElementQueryFromWorkspace(workspace);
    },
  });
};

export const useQuerySystemElementByID = (id: SystemElement["id"]) => {
  return useQuery({
    queryKey: ["system-element", { id }],
    queryFn() {
      return systemElementQueryById({
        id: SystemElementIDSchema.parse(id),
      });
    },
  });
};

export const useCreateSystemElement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: systemElementCreate,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: getSystemElementQueryKey(),
      });
    },
  });
};

export const useUpdateSystemElement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: systemElementUpdate,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: getSystemElementQueryKey(),
      });
    },
  });
};

export const useUpdateSystemElementParent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: systemElementUpdateParent,
    onSuccess(systemElement) {
      queryClient.invalidateQueries({
        queryKey: getSystemElementQueryKey(),
      });

      notifications.show({
        title: `${systemElement.name} updated successfully`,
        message: "Element parent was updated.",
      });
    },
  });
};

export const useDeleteSystemElement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: systemElementDelete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: getSystemElementQueryKey(),
      });
    },
  });
};
