import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import agent from "@/libs/api/agent";

export const ACTIVITY_QUERY_KEYS = {
  all: ["activities"],
  list: () => [...ACTIVITY_QUERY_KEYS.all, "list"],
  details: (id?: string) => [...ACTIVITY_QUERY_KEYS.all, "details", id],
} as const;

export const useActivities = (id?: string) => {
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ACTIVITY_QUERY_KEYS.list(),
    queryFn: async () => {
      const response = await agent.get<CursorPagedList<Activity>>(
        `/activities`
      );
      return response.data;
    },
  });

  const { data: activity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ACTIVITY_QUERY_KEYS.details(id),
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
      queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.all });
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
