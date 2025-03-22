import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import agent from "@/libs/api/agent";
import { ACCOUNT_QUERY_KEYS } from "./useAccount";

export const ACTIVITY_QUERY_KEYS = {
  all: ["activities"],
  list: () => [...ACTIVITY_QUERY_KEYS.all, "list"],
  details: (id?: string) => [...ACTIVITY_QUERY_KEYS.all, "details", id],
} as const;

export const useActivities = (id?: string) => {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<User>(ACCOUNT_QUERY_KEYS.user);

  const { data, isPending } = useQuery({
    queryKey: ACTIVITY_QUERY_KEYS.list(),
    queryFn: async () => {
      const response = await agent.get<CursorPagedList<Activity>>(
        `/activities`
      );
      return response.data;
    },
    select: (data) => {
      return data.items.map((activity) => ({
        ...activity,
        isGoing: activity.attendees.some(
          (attendee) => attendee.id === user?.id
        ),
        isHost: activity.hostId === user?.id,
      }));
    },
  });

  const { data: activity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ACTIVITY_QUERY_KEYS.details(id),
    queryFn: async () => {
      const response = await agent.get<Activity>(`/activities/${id}`);
      return response.data;
    },
    enabled: !!id,
    select: (data) => ({
      ...data,
      isGoing: data.attendees.some((attendee) => attendee.id === user?.id),
    }),
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

  const activities = data;
  const activityPageInfo = {};

  return {
    activities,
    activity,
    activityPageInfo,
    isPending,
    isLoadingActivity,
    createActivity,
  };
};
