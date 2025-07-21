import z from "zod";

export const createDivisionValidation = z.object({
  name: z.string().min(1, "Name is required"),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});
export const updateDivisionValidation = z.object({
  name: z.string().min(1, "Name is required").optional(),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});
