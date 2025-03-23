import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "@/libs/api/agent";
import { useCallback, useMemo } from "react";
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

  const uploadPhoto = useMutation({
    mutationFn: async (file: Blob) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await agent.post<Photo>("/profiles/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEY.photos(id as string),
      });
      await queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEY.profile(id as string),
      });
    },
  });

  const setMainPhoto = useMutation({
    mutationFn: async (photoId: string) => {
      const response = await agent.put<Photo>(
        `/profiles/photo/${photoId}/main`
      );
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEY.photos(id as string),
      });
      await queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEY.profile(id as string),
      });
    },
  });

  return {
    profile,
    isLoadingProfile,
    photos,
    isLoadingPhotos,
    isCurrentUser,
    uploadPhoto,
    setMainPhoto,
  };
};
