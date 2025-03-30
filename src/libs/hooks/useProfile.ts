import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "@/libs/api/agent";
import { useMemo } from "react";
import { ACCOUNT_QUERY_KEYS } from "./useAccount";
import { useProfileActivitiesFilters } from "./useProfileActivitiesFilters";

type Predicate = "followers" | "followings";

const PROFILE_QUERY_KEY = {
  all: ["profiles"],
  profile: (id: string) => [...PROFILE_QUERY_KEY.all, id],
  photos: (id: string) => [...PROFILE_QUERY_KEY.profile(id), "photos"],
  following: (id: string, predicate?: Predicate) => [
    ...PROFILE_QUERY_KEY.profile(id),
    predicate,
  ],
  userActivities: (filter: object) => [
    ...PROFILE_QUERY_KEY.all,
    "activities",
    filter,
  ],
};

export const useProfile = (id?: string, predicate?: Predicate) => {
  const queryClient = useQueryClient();
  const userCache = queryClient.getQueryData<User>(ACCOUNT_QUERY_KEYS.user);
  const { filter, setFilter } = useProfileActivitiesFilters();

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: PROFILE_QUERY_KEY.profile(id as string),
    queryFn: async () => {
      const response = await agent.get<Profile>(`/profiles/${id}`);
      return response.data;
    },
    enabled: !!id && !predicate,
  });

  const { data: photos, isLoading: isLoadingPhotos } = useQuery({
    queryKey: PROFILE_QUERY_KEY.photos(id as string),
    queryFn: async () => {
      const response = await agent.get<Photo[]>(`/profiles/${id}/photos`);
      return response.data;
    },
    enabled: !!id,
  });

  const { data: userActivities, isLoading: isLoadingUserActivities } = useQuery(
    {
      queryKey: PROFILE_QUERY_KEY.userActivities({ filter }),
      queryFn: async () => {
        const response = await agent.get<Activity[]>(
          `/profiles/${id}/activities`,
          { params: { filter } }
        );
        return response.data;
      },
    }
  );
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

  const deletePhoto = useMutation({
    mutationFn: async (photoId: string) => {
      const response = await agent.delete<Photo>(`/profiles/photo/${photoId}`);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEY.photos(id as string),
      });
    },
  });

  const updateFollowing = useMutation({
    mutationFn: async () => {
      const response = await agent.post<Profile>(`/profiles/${id}/follow`);
      return response.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: PROFILE_QUERY_KEY.profile(id as string),
      });
      const previousProfile = queryClient.getQueryData<Profile>(
        PROFILE_QUERY_KEY.profile(id as string)
      );
      queryClient.setQueryData(
        PROFILE_QUERY_KEY.profile(id as string),
        (old: Profile) => {
          return {
            ...old,
            following: !old.following,
            followersCount: old.following
              ? (old?.followersCount ?? 0) - 1
              : (old?.followersCount ?? 0) + 1,
          };
        }
      );
      return previousProfile;
    },
    onError: (_, __, previousProfile) => {
      queryClient.setQueryData(
        PROFILE_QUERY_KEY.profile(id as string),
        previousProfile
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEY.profile(id as string),
      });
    },
  });

  const { data: followings, isLoading: isLoadingFollowings } = useQuery({
    queryKey: PROFILE_QUERY_KEY.following(id as string, predicate),
    queryFn: async () => {
      const response = await agent.get<Profile[]>(
        `/profiles/${id}/follow-list`,
        {
          params: { predicate },
        }
      );
      return response.data;
    },
    enabled: !!id && !!predicate,
  });

  return {
    profile,
    isLoadingProfile,
    photos,
    isLoadingPhotos,
    isCurrentUser,
    uploadPhoto,
    setMainPhoto,
    deletePhoto,
    updateFollowing,
    followings,
    isLoadingFollowings,
    userActivities,
    isLoadingUserActivities,
    filter,
    setFilter,
  };
};
