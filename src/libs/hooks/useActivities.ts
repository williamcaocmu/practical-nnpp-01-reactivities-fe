import agent from "@/libs/api/agent";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ACCOUNT_QUERY_KEYS } from "./useAccount";

type ActivityPayload = {
  title: string;
  description: string;
  category: string;
  date: Date;
  latitude: number;
  longitude: number;
  city?: string;
  venue?: string;
};

export const ACTIVITY_QUERY_KEYS = {
  all: ["activities"],
  list: () => [...ACTIVITY_QUERY_KEYS.all, "list"],
  details: (id?: string) => [...ACTIVITY_QUERY_KEYS.all, "details", id],
} as const;

export const useActivities = (id?: string) => {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<User>(ACCOUNT_QUERY_KEYS.user);

  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery<CursorPagedList<Activity, string>>({
      queryKey: ACTIVITY_QUERY_KEYS.list(),
      queryFn: async ({ pageParam = null }) => {
        const response = await agent.get<CursorPagedList<Activity, string>>(
          "/activities",
          {
            params: {
              cursor: pageParam,
            },
          }
        );
        return response.data;
      },
      initialPageParam: null,
      // @ts-ignore
      getNextPageParam: (lastPage) => lastPage.pageInfo.nextCursor || null,
      select: (data) => ({
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          items: page.items.map((activity) => {
            const host = activity.attendees.find(
              (x) => x.id === activity.host.id
            );
            return {
              ...activity,
              isHost: user?.id === activity.hostId,
              isGoing: activity.attendees.some((x) => x.id === user?.id),
              hostImageUrl: host?.imageUrl,
            };
          }),
        })),
      }),
      enabled: !!user,
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
      isHost: data.hostId === user?.id,
    }),
  });

  const createActivity = useMutation({
    mutationFn: async (activity: ActivityPayload) => {
      const response = await agent.post(`/activities`, activity);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.all });
    },
  });

  const updateActivity = useMutation({
    mutationFn: async (activity: ActivityPayload & { id: string }) => {
      const response = await agent.patch(
        `/activities/${activity.id}`,
        activity
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.all });
    },
  });

  const updateAttendee = useMutation({
    mutationFn: async (id: string) => {
      const response = await agent.post(`/activities/${id}/attend`);
      return response.data;
    },
    onMutate: async (activityId: string) => {
      const key = ACTIVITY_QUERY_KEYS.details(activityId);
      await queryClient.cancelQueries({ queryKey: key });
      const previousActivity = queryClient.getQueryData<Activity>(key);

      queryClient.setQueryData(key, (data: Activity) => {
        if (!data || !user) return data;
        const isHost = data.hostId === user.id;
        const isAttending = data.attendees.some(
          (attendee) => attendee.id === user.id
        );

        return {
          ...data,
          isCanceled: isHost ? !data.isCanceled : data.isCanceled,
          attendees: isAttending
            ? isHost
              ? data.attendees
              : data.attendees.filter((att) => att.id !== user.id)
            : [
                ...data.attendees,
                {
                  id: user.id,
                  displayName: user.displayName,
                  imageUrl: user.imageUrl,
                },
              ],
        };
      });

      return { previousActivity };
    },
    onError: (_, activityId, context) => {
      if (context?.previousActivity) {
        queryClient.setQueryData(
          ACTIVITY_QUERY_KEYS.details(activityId),
          context?.previousActivity
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.all });
    },
  });

  const activities = data;
  const activityPageInfo = {};

  return {
    activitiesGrouped: activities,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    activity,
    updateActivity,
    activityPageInfo,
    isPending,
    isLoadingActivity,
    createActivity,
    updateAttendee,
  };
};
