import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import SelectInput from "@/app/shared/components/SelectInput";
import TextInput from "@/app/shared/components/TextInput";
import { useActivities } from "@/libs/hooks/useActivities";
import { activitySchema, ActivitySchema } from "@/libs/schemas/activitySchema";
import { categoryOptions } from "./category-options";
import DateTimeInput from "@/app/shared/components/DateTimeInput";

type Props = {};

export default function ActivityForm({}: Props) {
  const { handleSubmit, control } = useForm<ActivitySchema>({
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
        <TextInput label="Title" name="title" control={control} />
        <TextInput
          label="Description"
          name="description"
          multiline
          rows={3}
          control={control}
        />
        <SelectInput
          label="Category"
          name="category"
          control={control}
          items={categoryOptions}
        />
        <DateTimeInput label="Date" name="date" control={control} />
        <TextInput label="City" name="city" control={control} />
        <TextInput label="Venue" name="venue" control={control} />

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
