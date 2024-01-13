import { z } from "zod";

export const myFormSchema = z.object({
  taskTitle: z
    .string()
    .refine((data) => data !== undefined && data.trim() !== "", {
      message: "Task title is required and should not be empty",
    })
    .refine((data) => data !== undefined && data.length >= 3, {
      message: "Task title should contain at least 3 characters",
    }),
});
