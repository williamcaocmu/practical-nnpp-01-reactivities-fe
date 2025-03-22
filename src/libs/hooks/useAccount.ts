import agent from "@/libs/api/agent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAccount = () => {
  const queryClient = useQueryClient();

  const loginUser = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await agent.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(["user"], data);
    },
  });

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await agent.get("/auth/profile");
      return response.data;
    },
    enabled: !!queryClient.getQueryData(["user"]),
  });

  return { loginUser, user };
};
