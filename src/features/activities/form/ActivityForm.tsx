import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

import DateTimeInput from "@/app/shared/components/DateTimeInput";
import LocationInput from "@/app/shared/components/LocationInput";
import SelectInput from "@/app/shared/components/SelectInput";
import TextInput from "@/app/shared/components/TextInput";
import { useActivities } from "@/libs/hooks/useActivities";
import { activitySchema, ActivitySchema } from "@/libs/schemas/activitySchema";
import { categoryOptions } from "./category-options";

export default function ActivityForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { handleSubmit, control, reset } = useForm<ActivitySchema>({
    mode: "onTouched",
    resolver: zodResolver(activitySchema),
  });

  const { createActivity, updateActivity, activity, isLoadingActivity } =
    useActivities(id);

  useEffect(() => {
    if (activity) {
      reset({
        ...activity,
        location: {
          city: activity.city,
          venue: activity.venue,
          latitude: activity.latitude,
          longitude: activity.longitude,
        },
      });
    }
  }, [activity, reset]);

  const onSubmit = async (data: ActivitySchema) => {
    const { location, ...rest } = data;
    const flattenedData = { ...rest, ...location };

    try {
      if (activity) {
        updateActivity.mutate(
          { ...flattenedData, id: activity.id },
          {
            onSuccess: () => {
              navigate(`/activities/${activity?.id}`);
            },
          }
        );
      } else {
        createActivity.mutate(flattenedData, {
          onSuccess: (response) => {
            navigate(
              response.id ? `/activities/${response.id}` : "/activities"
            );
          },
        });
      }
    } catch (error) {}
  };

  if (isLoadingActivity) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper sx={{ borderRadius: 3, padding: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Create activity
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        display="flex"
        flexDirection="column"
        gap={3}
      >
        <TextInput label="Title" control={control} name="title" />
        <TextInput
          label="Description"
          control={control}
          name="description"
          multiline
          rows={3}
        />
        <Box display="flex" gap={3}>
          <SelectInput
            items={categoryOptions}
            label="Category"
            control={control}
            name="category"
          />
          <DateTimeInput label="Date" control={control} name="date" />
        </Box>

        <LocationInput
          control={control}
          label="Enter the location"
          name="location"
        />

        <Box display="flex" justifyContent="end" gap={3}>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
          <Button color="inherit">Cancel</Button>
        </Box>
      </Box>
    </Paper>
  );
}
