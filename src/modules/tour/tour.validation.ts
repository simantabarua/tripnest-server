import { z } from "zod";

export const createTourValidationZodSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  location: z.string().optional(),
  costFrom: z.number().optional(),
  startDate: z
    .preprocess((arg) => new Date(arg as string), z.date())
    .optional(),
  endDate: z.preprocess((arg) => new Date(arg as string), z.date()).optional(),
  tourType: z.string().min(1, "Tour type is required"),
  division: z.string().min(1, "Division is required"),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  tourPlan: z.array(z.string()).optional(),
  maxGuest: z.number().optional(),
  minAge: z.number().optional(),
  departureLocation: z.string().optional(),
  arrivalLocation: z.string().optional(),
});

export const updateTourZodSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  costFrom: z.number().optional(),
  startDate: z
    .preprocess((arg) => new Date(arg as string), z.date())
    .optional(),
  endDate: z.preprocess((arg) => new Date(arg as string), z.date()).optional(),
  tourType: z.string().optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  tourPlan: z.array(z.string()).optional(),
  maxGuest: z.number().optional(),
  minAge: z.number().optional(),
  departureLocation: z.string().optional(),
  arrivalLocation: z.string().optional(),
});
