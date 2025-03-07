import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";

type Props = {};

export default function ActivityCard({}: Props) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h5">Activity Title</Typography>
        <Typography sx={{ color: "text.secondary", mb: 1 }}>
          Activity Date
        </Typography>
        <Typography variant="body2">Activity Description</Typography>
        <Typography variant="subtitle1">
          Activity City / Activity Venue
        </Typography>
      </CardContent>
      <CardActions
        sx={{ display: "flex", justifyContent: "space-between", pb: 2 }}
      >
        <Chip label="Activity Category" variant="outlined" />
        <Box display="flex" gap={3}>
          <Button size="medium" variant="contained">
            View
          </Button>
          <Button color="error" size="medium" variant="contained">
            Delete
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}
