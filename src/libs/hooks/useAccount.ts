import agent from "@/libs/api/agent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ACTIVITY_QUERY_KEYS } from "./useActivities";

export const ACCOUNT_QUERY_KEYS = {
  user: ["user"],
} as const;

export const useAccount = () => {
  const queryClient = useQueryClient();
  const userCache = queryClient.getQueryData<User>(ACCOUNT_QUERY_KEYS.user);

  const loginUser = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await agent.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEYS.user });
    },
  });

  const logoutUser = useMutation({
    mutationFn: async () => {
      const response = await agent.get("/auth/logout");
      return response.data;
    },
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ACCOUNT_QUERY_KEYS.user });
      queryClient.removeQueries({ queryKey: ACTIVITY_QUERY_KEYS.all });
    },
  });

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ACCOUNT_QUERY_KEYS.user,
    queryFn: async () => {
      const response = await agent.get("/auth/profile");
      return response.data;
    },
    enabled: !userCache,
  });

  const registerUser = useMutation({
    mutationFn: async (credentials: {
      email: string;
      password: string;
      displayName: string;
    }) => {
      const response = await agent.post("/auth/register", credentials);
      return response.data;
    },
  });

  return { loginUser, user, logoutUser, isLoadingUser, registerUser };
};
