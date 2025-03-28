import { z } from "zod";

export const activitySchema = z.object({
  title: z.string({ required_error: "Title is required" }).min(1, {
    message: "Title is required",
  }),
  category: z.string({ required_error: "Category is required" }).min(1, {
    message: "Category is required",
  }),
  description: z.string({ required_error: "Description is required" }).min(1, {
    message: "Description is required",
  }),
  date: z.coerce.date({ required_error: "Date is required" }),
  city: z.string({ required_error: "City is required" }).min(1, {
    message: "City is required",
  }),
  venue: z.string({ required_error: "Venue is required" }).min(1, {
    message: "Venue is required",
  }),
});

export type ActivitySchema = z.infer<typeof activitySchema>;
