import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useActivities } from "@/libs/hooks/useActivities";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { activitySchema, ActivitySchema } from "@/libs/schemas/activitySchema";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {};

export default function ActivityForm({}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ActivitySchema>({
    resolver: zodResolver(activitySchema),
  });

  const { createActivity } = useActivities();
  const navigate = useNavigate();

  const onSubmit = async (data: ActivitySchema) => {
    createActivity.mutate(data, {
      onSuccess: () => {
        navigate("/activities");
      },
    });
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
        <TextField
          label="Title"
          {...register("title")}
          error={!!errors.title}
          helperText={errors.title?.message}
        />
        <TextField
          label="Description"
          multiline
          rows={3}
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        <TextField
          label="Category"
          {...register("category")}
          error={!!errors.category}
          helperText={errors.category?.message}
        />
        <TextField
          label="Date"
          type="date"
          {...register("date")}
          defaultValue={new Date().toISOString().split("T")[0]}
          error={!!errors.date}
          helperText={errors.date?.message}
        />
        <TextField
          label="City"
          {...register("city")}
          error={!!errors.city}
          helperText={errors.city?.message}
        />
        <TextField
          label="Venue"
          {...register("venue")}
          error={!!errors.venue}
          helperText={errors.venue?.message}
        />
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
