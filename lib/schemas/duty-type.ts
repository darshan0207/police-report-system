import { z } from "zod";

export const dutyTypeSchema = z.object({
  name: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().min(1, "Duty type name is required")),
});

export type DutyTypeFormData = z.infer<typeof dutyTypeSchema>;
