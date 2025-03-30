import { useQueryState } from "nuqs";
import { useMemo } from "react";

export type FilterType = "all" | "isGoing" | "isHost";

export const useActivityFilters = () => {
  const [filter, setFilter] = useQueryState<FilterType>("filter", {
    defaultValue: "all",
    parse: (value: string) =>
      ["all", "isGoing", "isHost"].includes(value)
        ? (value as FilterType)
        : "all",
  });

  const [dateParam, setDateParam] = useQueryState<string>("date", {
    defaultValue: "",
    parse: (value: string) => value || "",
  });

  const [page, setPage] = useQueryState("page", {
    defaultValue: 1,
    parse: (value: string) => {
      const parsed = parseInt(value);
      return isNaN(parsed) || parsed < 1 ? 1 : parsed;
    },
  });

  const dateFilter = useMemo(
    () => (dateParam ? new Date(dateParam) : null),
    [dateParam]
  );

  const queryParams = useMemo(() => {
    const params: Record<string, string | number | boolean> = {
      page,
    };

    if (filter !== "all") {
      params[filter] = true;
    }

    if (dateParam) {
      params.startDate = dateParam.split("T")[0]; // Get just the date part YYYY-MM-DD
    }

    return params;
  }, [filter, dateParam, page]);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setPage(1);
  };

  // Handler for changing date
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setDateParam(date.toISOString());
    } else {
      setDateParam("");
    }
    // Reset to page 1 when changing date
    setPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilter("all");
    setDateParam("");
    setPage(1);
  };

  return {
    // Current filter values
    filter,
    dateFilter,
    dateParam,
    page,

    // Processed query params for API
    queryParams,

    // Filter change handlers
    handleFilterChange,
    handleDateChange,
    setPage,
    resetFilters,
  };
};
