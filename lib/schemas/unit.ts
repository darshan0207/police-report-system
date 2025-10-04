// schemas/unit.ts
import { z } from "zod";

export const unitSchema = z.object({
  name: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().min(1, "યુનિટનું નામ જરૂરી છે")),
  type: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().min(1, "યુનિટનો પ્રકાર જરૂરી છે")),
});

export type UnitFormData = z.infer<typeof unitSchema>;
