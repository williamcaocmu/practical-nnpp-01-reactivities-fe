import { Grid2 } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivityDetail from "../details/ActivityDetail";
import ActivityForm from "../form/ActivityForm";

type Props = {
  activities: Activity[];
};

export default function ActivityDashboard({ activities }: Props) {
  return (
    <Grid2 container spacing={3}>
      <Grid2 size={7}>
        <ActivityList activities={activities} />
      </Grid2>
      <Grid2 size={5} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <ActivityDetail />
        <ActivityForm />
      </Grid2>
    </Grid2>
  );
}
