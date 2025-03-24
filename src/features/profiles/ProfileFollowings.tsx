import { useParams } from "react-router";
import { useProfile } from "../../libs/hooks/useProfile";
import { Box, Divider, Typography } from "@mui/material";
import ProfileCard from "./ProfileCard";

type Props = {
  activeTab: number;
};

export default function ProfileFollowings({ activeTab }: Props) {
  const { id } = useParams();
  const predicate = activeTab === 3 ? "followers" : "followings";
  const { profile, followings, isLoadingFollowings } = useProfile(
    id,
    predicate
  );

  return (
    <Box>
      <Box display="flex">
        <Typography variant="h5">
          {activeTab === 3
            ? `People following ${profile?.displayName}`
            : `People ${profile?.displayName} is following`}
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      {isLoadingFollowings ? (
        <Typography>Loading...</Typography>
      ) : (
        <Box display="flex" flexWrap="wrap" marginTop={3} gap={3}>
          {followings?.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </Box>
      )}
    </Box>
  );
}
