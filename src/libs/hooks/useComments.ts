import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import agent from "@/libs/api/agent";

export const useComments = (activityId: string) => {
  const queryClient = useQueryClient();
  const {
    data: comments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comments", activityId],
    queryFn: async () => {
      const response = await agent.get<ActivityComment[]>("comments", {
        params: {
          activityId,
        },
      });
      return response.data;
    },
    enabled: !!activityId,
  });

  const { mutate: createComment, isPending: isCreatingComment } = useMutation({
    mutationFn: async (comment: { body: string; activityId: string }) => {
      const response = await agent.post<ActivityComment>("comments", comment);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", activityId] });
    },
  });
  return { comments, isLoading, error, createComment, isCreatingComment };
};
