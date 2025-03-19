import { useQuery } from "@tanstack/react-query";
import agent from "@/libs/api/agent";

const activityQueryKeys = {
  list: ["activities"],
  details: (id: string) => [...activityQueryKeys.list, id],
} as const;

export const useActivities = () => {
  const { data, isPending } = useQuery({
    queryKey: activityQueryKeys.list,
    queryFn: async () => {
      const response = await agent.get<CursorPagedList<Activity>>(
        `/activities`
      );
      return response.data;
    },
  });

  const activities = data?.items;
  const activityPageInfo = data?.pageInfo;

  return { activities, activityPageInfo, isPending };
};
