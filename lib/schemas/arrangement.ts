import { z } from "zod";

export const arrangementSchema = z.object({
  name: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().min(1, "બંદોબસ્તનું નામ જરૂરી છે")),
});

export type ArrangementFormData = z.infer<typeof arrangementSchema>;
