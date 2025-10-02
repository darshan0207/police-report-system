// schemas/unit.ts
import { z } from "zod";

export const unitSchema = z.object({
  name: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().min(1, "Unit name is required")),
  type: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().min(1, "Unit type is required")),
});

export type UnitFormData = z.infer<typeof unitSchema>;
