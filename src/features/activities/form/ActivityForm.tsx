import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useActivities } from "@/libs/hooks/useActivities";
import { FormEvent } from "react";
import { useNavigate } from "react-router";

type Props = {};

export default function ActivityForm({}: Props) {
  const { createActivity } = useActivities();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const activity = Object.fromEntries(formData);

    await createActivity.mutateAsync(activity as unknown as Activity);
    navigate("/activities");
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
        onSubmit={handleSubmit}
      >
        <TextField name="title" label="Title" />
        <TextField name="description" label="Description" multiline rows={3} />
        <TextField name="category" label="Category" />
        <TextField name="date" label="Date" type="date" />
        <TextField name="city" label="City" />
        <TextField name="venue" label="Venue" />
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
