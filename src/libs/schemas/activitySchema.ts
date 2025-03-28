import { z } from "zod";

export const activitySchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  category: z.string({ required_error: "Category is required" }),
  description: z.string({ required_error: "Description is required" }),
  date: z.coerce.date({ required_error: "Date is required" }),
  city: z.string({ required_error: "City is required" }),
  venue: z.string({ required_error: "Venue is required" }),
});

export type ActivitySchema = z.infer<typeof activitySchema>;
