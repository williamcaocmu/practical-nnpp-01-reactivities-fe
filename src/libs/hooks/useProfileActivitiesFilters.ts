import { useState } from "react";

const FILTERS = ["future", "past", "hosting"] as const;

export type ProfileActivitiesFilter = (typeof FILTERS)[number];

export const useProfileActivitiesFilters = () => {
  const [filter, setFilter] = useState<ProfileActivitiesFilter>("future");

  return {
    filter,
    setFilter,
  };
};
