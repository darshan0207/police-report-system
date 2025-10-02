// lib/schemas/report.ts
import { z } from "zod";

export const reportSchema = z.object({
  date: z.string().min(1, "Date is required"),
  unit: z.string().min(1, "Unit is required"),
  policeStation: z.string().min(1, "Police station is required"),
  dutyType: z.string().min(1, "Duty type is required"),
  verifyingOfficer: z.string().min(1, "Verifying officer is required"),
  dutyCount: z.number().min(1, "Duty count must be at least 1"),
  remarks: z.string().optional(),
  images: z.array(z.instanceof(File)).optional(),
});

export type ReportFormData = z.infer<typeof reportSchema>;
