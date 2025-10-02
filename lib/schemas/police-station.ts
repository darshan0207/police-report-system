import { z } from "zod";

export const policeStationSchema = z.object({
  name: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().min(1, "Police station name is required")),
});

export type PoliceStationFormData = z.infer<typeof policeStationSchema>;
