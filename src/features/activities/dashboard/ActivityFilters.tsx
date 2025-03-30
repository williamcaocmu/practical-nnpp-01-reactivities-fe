import { FilterList, Event } from "@mui/icons-material";
import {
  Box,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Typography,
} from "@mui/material";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import { Value } from "react-calendar/dist/esm/shared/types.js";
import { useActivityFilters } from "@/libs/hooks/useActivityFilters";

export default function ActivityFilters() {
  const {
    filter,
    dateFilter,
    handleFilterChange,
    handleDateChange,
    resetFilters,
  } = useActivityFilters();

  const handleCalendarChange = (value: Value) => {
    if (value instanceof Date) {
      handleDateChange(value);
    } else if (
      Array.isArray(value) &&
      value.length > 0 &&
      value[0] instanceof Date
    ) {
      handleDateChange(value[0]);
    } else {
      handleDateChange(null);
    }
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 3, borderRadius: 3 }}
    >
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ width: "100%" }}>
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              color: "primary.main",
            }}
          >
            <FilterList sx={{ mr: 1 }} />
            Filters
          </Typography>
          <MenuList>
            <MenuItem
              onClick={() => handleFilterChange("all")}
              selected={filter === "all"}
            >
              <ListItemText primary="All events" />
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterChange("isGoing")}
              selected={filter === "isGoing"}
            >
              <ListItemText primary="I'm going" />
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterChange("isHost")}
              selected={filter === "isHost"}
            >
              <ListItemText primary="I'm hosting" />
            </MenuItem>
          </MenuList>
        </Box>
      </Paper>
      <Box component={Paper} sx={{ width: "100%", p: 3, borderRadius: 3 }}>
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1,
            color: "primary.main",
          }}
        >
          <Event sx={{ mr: 1 }} />
          Select date
        </Typography>
        <Calendar
          value={dateFilter}
          onChange={(value) => handleCalendarChange(value)}
          tileClassName={({ date }) => {
            return dateFilter &&
              date.toDateString() === dateFilter.toDateString()
              ? "react-calendar__tile--active"
              : "";
          }}
        />
        {dateFilter && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography
              variant="body2"
              component="button"
              onClick={() => handleDateChange(null)}
              sx={{
                cursor: "pointer",
                color: "primary.main",
                border: "none",
                background: "none",
                textDecoration: "underline",
                fontSize: "0.875rem",
              }}
            >
              Clear date filter
            </Typography>
          </Box>
        )}
      </Box>
      {(filter !== "all" || dateFilter) && (
        <Box sx={{ textAlign: "center", mt: 1 }}>
          <Typography
            variant="body2"
            component="button"
            onClick={resetFilters}
            sx={{
              cursor: "pointer",
              color: "primary.main",
              border: "none",
              background: "none",
              textDecoration: "underline",
              fontSize: "0.875rem",
            }}
          >
            Reset all filters
          </Typography>
        </Box>
      )}
    </Box>
  );
}
