import { Card, Badge, CardMedia, Box, Typography } from "@mui/material";
import { Link } from "react-router";
import { useActivities } from "@/libs/hooks/useActivities";
import StyledButton from "@/shared/components/StyledButton";
import { formatDate } from "@/libs/utils/format-date";
type Props = {
  activity: Activity;
};

export default function ActivityDetailsHeader({ activity }: Props) {
  const { updateAttendee } = useActivities(activity.id);

  return (
    <Card
      sx={{
        position: "relative",
        mb: 2,
        backgroundColor: "transparent",
        overflow: "hidden",
      }}
    >
      {activity.isCanceled && (
        <Badge
          sx={{ position: "absolute", left: 40, top: 20, zIndex: 1000 }}
          color="error"
          badgeContent="Cancelled"
        />
      )}
      <CardMedia
        component="img"
        height="300"
        image={`/images/categoryImages/${activity.category}.jpg`}
        alt={`${activity.category} image`}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          color: "white",
          padding: 2,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          background:
            "linear-gradient(to top, rgba(0, 0, 0, 1.0), transparent)",
          boxSizing: "border-box",
        }}
      >
        {/* Text Section */}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {activity.title}
          </Typography>
          <Typography variant="subtitle1">
            {formatDate(activity.date)}
          </Typography>
          <Typography variant="subtitle2">
            Hosted by{" "}
            <Link
              to={`/profiles/username`}
              style={{ color: "white", fontWeight: "bold" }}
            >
              {activity.host.displayName}
            </Link>
          </Typography>
        </Box>

        {/* StyledButtons aligned to the right */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {activity.isHost ? (
            <>
              <StyledButton
                variant="contained"
                color={activity.isCanceled ? "success" : "error"}
                onClick={() => {
                  updateAttendee.mutate(activity.id);
                }}
                disabled={updateAttendee.isPending}
              >
                {activity.isCanceled
                  ? "Re-activate Activity"
                  : "Cancel Activity"}
              </StyledButton>
              <StyledButton
                variant="contained"
                color="primary"
                component={Link}
                to={`/manage/${activity.id}`}
                disabled={activity.isCanceled}
              >
                Manage Event
              </StyledButton>
            </>
          ) : (
            <StyledButton
              variant="contained"
              color={activity.isGoing ? "primary" : "info"}
              onClick={() => {
                updateAttendee.mutate(activity.id);
              }}
              disabled={activity.isCanceled || updateAttendee.isPending}
            >
              {activity.isGoing ? "Cancel Attendance" : "Join Activity"}
            </StyledButton>
          )}
        </Box>
      </Box>
    </Card>
  );
}
