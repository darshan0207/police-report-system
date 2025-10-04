// lib/schemas/auth.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "ઈમેલ આવશ્યક છે")
    .email("કૃપા કરીને માન્ય ઈમેલ દાખલ કરો")
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, "પાસવર્ડ આવશ્યક છે")
    .min(6, "પાસવર્ડ ઓછામાં ઓછો 6 અક્ષરોનો હોવો જોઈએ"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
