import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useActivities } from "@/libs/hooks/useActivities";
import { useNavigate } from "react-router";
import { useForm, FieldValues } from "react-hook-form";
import { activitySchema, ActivitySchema } from "@/libs/schemas/activitySchema";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {};

export default function ActivityForm({}: Props) {
  const { register, handleSubmit } = useForm<ActivitySchema>({
    resolver: zodResolver(activitySchema),
  });

  const { createActivity } = useActivities();
  const navigate = useNavigate();

  const onSubmit = async (data: FieldValues) => {
    console.log(data);
  };

  return (
    <Paper sx={{ borderRadius: 3, padding: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Create activity
      </Typography>
      <Box
        component="form"
        display="flex"
        flexDirection="column"
        gap={3}
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField label="Title" {...register("title")} />
        <TextField
          label="Description"
          multiline
          rows={3}
          {...register("description")}
        />
        <TextField label="Category" {...register("category")} />
        <TextField
          label="Date"
          type="date"
          {...register("date")}
          defaultValue={new Date().toISOString().split("T")[0]}
        />
        <TextField label="City" {...register("city")} />
        <TextField label="Venue" {...register("venue")} />
        <Box display="flex" justifyContent="end" gap={3}>
          <Button color="inherit">Cancel</Button>
          <Button type="submit" color="success" variant="contained">
            Submit
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
