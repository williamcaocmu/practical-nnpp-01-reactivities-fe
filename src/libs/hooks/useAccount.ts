import agent from "@/libs/api/agent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ACTIVITY_QUERY_KEYS } from "./useActivities";

const ACCOUNT_QUERY_KEYS = {
  user: ["user"],
} as const;

export const useAccount = () => {
  const queryClient = useQueryClient();

  const loginUser = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await agent.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(ACCOUNT_QUERY_KEYS.user, data);
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
    enabled: !!queryClient.getQueryData(ACCOUNT_QUERY_KEYS.user),
  });

  return { loginUser, user, logoutUser, isLoadingUser };
};
