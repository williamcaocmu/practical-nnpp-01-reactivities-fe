import { useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "@/libs/api/agent";
import { useMemo } from "react";
import { ACCOUNT_QUERY_KEYS } from "./useAccount";

const PROFILE_QUERY_KEY = {
  all: ["profiles"],
  profile: (id: string) => [...PROFILE_QUERY_KEY.all, id],
  photos: (id: string) => [...PROFILE_QUERY_KEY.profile(id), "photos"],
};

export const useProfile = (id?: string) => {
  const queryClient = useQueryClient();
  const userCache = queryClient.getQueryData<User>(ACCOUNT_QUERY_KEYS.user);

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: PROFILE_QUERY_KEY.profile(id as string),
    queryFn: async () => {
      const response = await agent.get<Profile>(`/profiles/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const { data: photos, isLoading: isLoadingPhotos } = useQuery({
    queryKey: PROFILE_QUERY_KEY.photos(id as string),
    queryFn: async () => {
      const response = await agent.get<Photo[]>(`/profiles/${id}/photos`);
      return response.data;
    },
    enabled: !!id,
  });

  const isCurrentUser = useMemo(() => {
    if (!userCache || !profile) return false;
    return userCache?.id === profile?.id;
  }, [userCache, profile]);

  return { profile, isLoadingProfile, photos, isLoadingPhotos, isCurrentUser };
};
