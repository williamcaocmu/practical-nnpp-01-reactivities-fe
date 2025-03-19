import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import agent from "@/libs/api/agent";

const activityQueryKeys = {
  all: ["activities"],
  list: () => [...activityQueryKeys.all, "list"],
  details: (id?: string) => [...activityQueryKeys.all, "details", id],
} as const;

export const useActivities = (id?: string) => {
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: activityQueryKeys.list(),
    queryFn: async () => {
      const response = await agent.get<CursorPagedList<Activity>>(
        `/activities`
      );
      return response.data;
    },
  });

  const { data: activity, isLoading: isLoadingActivity } = useQuery({
    queryKey: activityQueryKeys.details(id),
    queryFn: async () => {
      console.log(id);
      const response = await agent.get<Activity>(`/activities/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const createActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      const response = await agent.post(`/activities`, activity);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.all });
    },
  });

  const activities = data?.items;
  const activityPageInfo = data?.pageInfo;

  return {
    activities,
    activity,
    activityPageInfo,
    isPending,
    isLoadingActivity,
    createActivity,
  };
};
