// lib/schemas/report.ts
import { z } from "zod";

export const reportSchema = z.object({
  date: z.string().min(1, "તારીખ જરૂરી છે"),
  unit: z.string().min(1, "યુનિટ જરૂરી છે"),
  policeStation: z.string().min(1, "પોલીસ સ્ટેશન જરૂરી છે"),
  dutyType: z.string().min(1, "ફરજ પ્રકાર જરૂરી છે"),
  verifyingOfficer: z.string().min(1, "ચકાસણી અધિકારી જરૂરી છે"),
  dutyCount: z.number().min(1, "ફરજ ઉપર હાજર કુલ સંખ્યા જરૂરી છે"),
  remarks: z.string().optional(),
  images: z
    .array(z.instanceof(File))
    .min(1, "કૃપા કરીને ઓછામાં ઓછા એક ફોટો અપલોડ કરો.")
    .max(10, "મહત્તમ 10 ફોટાઓની મંજૂરી છે"),
});

export type ReportFormData = z.infer<typeof reportSchema>;
