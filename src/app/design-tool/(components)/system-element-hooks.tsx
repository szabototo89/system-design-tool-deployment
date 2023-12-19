import {
  systemElementCreate,
  systemElementDelete,
  systemElementQueryAll,
  systemElementUpdate,
} from "@/db/entities/system-element/server-actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const getSystemElementQueryKey = () => ["system-element"] as const;

export const useQueryAllSystemElements = () => {
  return useQuery({
    queryKey: getSystemElementQueryKey(),
    async queryFn() {
      return await systemElementQueryAll();
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
