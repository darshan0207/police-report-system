import { z } from "zod";

export const officerSchema = z.object({
  name: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().min(1, "Officer name is required")),
});

export type OfficerFormData = z.infer<typeof officerSchema>;
