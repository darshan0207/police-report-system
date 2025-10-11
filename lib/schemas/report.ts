import { z } from "zod";

export const reportSchema = (isAdmin: boolean) =>
  z.object({
    date: z.string().min(1, "તારીખ જરૂરી છે"),
    unit: z.string().min(1, "યુનિટ જરૂરી છે"),
    policeStation: z.string().min(1, "પોલીસ સ્ટેશન જરૂરી છે"),
    arrangement: z.string().nullable(),
    dutyType: z.string().min(1, "ફરજ પ્રકાર જરૂરી છે"),
    verifyingOfficer: z.string().min(1, "ચકાસણી અધિકારી જરૂરી છે"),
    dutyCount: z.number().min(1, "ફરજ ઉપર હાજર કુલ સંખ્યા જરૂરી છે"),
    remarks: z.string().optional(),
    images: isAdmin
      ? z.array(z.union([z.string().url(), z.instanceof(File)])).optional()
      : z
          .array(z.union([z.string().url(), z.instanceof(File)]))
          .min(1, "કૃપા કરીને ઓછામાં ઓછા એક ફોટો અપલોડ કરો.")
          .max(10, "મહત્તમ 10 ફોટાઓની મંજૂરી છે"),
    otherImage: isAdmin
      ? z.string().optional()
      : z
          .string()
          .min(1, "હાજરી રેજિસ્ટર સહી સિક્કા સાથે નો ફોટોગ્રાફ જરૂરી છે"),
  });

export type ReportFormData = z.infer<ReturnType<typeof reportSchema>>;
