import { useQuery } from "@tanstack/react-query";
import agent from "@/libs/api/agent";

const PROFILE_QUERY_KEY = {
  all: ["profiles"],
  profile: (id: string) => [...PROFILE_QUERY_KEY.all, id],
};

export const useProfile = (id?: string) => {
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: PROFILE_QUERY_KEY.profile(id as string),
    queryFn: async () => {
      const response = await agent.get<Profile>(`/profiles/${id}`);
      return response.data;
    },
  });

  return { profile, isLoadingProfile };
};
