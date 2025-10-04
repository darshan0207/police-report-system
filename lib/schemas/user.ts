// lib/schemas/user.ts - Recommended simpler version
import { z } from "zod";

// Base schema for common fields
const baseUserSchema = {
  name: z
    .string()
    .min(1, "પૂરું નામ જરૂરી છે")
    .min(2, "પૂરું નામ ઓછામાં ઓછા 2 અક્ષરોનું હોવું જોઈએ.")
    .max(50, "પૂરું નામ 50 અક્ષરોથી ઓછું હોવું જોઈએ")
    .trim(),
  email: z
    .string()
    .min(1, "ઈમેલ આવશ્યક છે")
    .email("કૃપા કરીને માન્ય ઈમેલ દાખલ કરો")
    .trim()
    .toLowerCase(),
  role: z.enum(["admin", "user"], {
    errorMap: () => ({ message: "કૃપા કરીને રોલ પસંદ કરો" }),
  }),
};

// Password validation
const passwordSchema = z
  .string()
  .min(8, "પાસવર્ડ ઓછામાં ઓછો 8 અક્ષરોનો હોવો જોઈએ")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "પાસવર્ડમાં ઓછામાં ઓછો એક મોટો અક્ષર, એક નાનો અક્ષર અને એક સંખ્યા હોવી જોઈએ."
  );

// Create user schema
export const userSchema = z
  .object({
    ...baseUserSchema,
    password: z.string().min(1, "પાસવર્ડ જરૂરી છે").pipe(passwordSchema),
    confirmPassword: z.string().min(1, "કૃપા કરીને તમારો પાસવર્ડ કન્ફર્મ કરો."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "પાસવર્ડ્સ મેળ ખાતા નથી",
    path: ["confirmPassword"],
  });

export type UserFormData = z.infer<typeof userSchema>;

// API schemas
export const userCreateSchema = userSchema.omit({ confirmPassword: true });
export type UserCreateData = z.infer<typeof userCreateSchema>;

// Update schema - all fields optional, password only validated if provided
export const userUpdateSchema = z
  .object({
    name: z
      .string()
      .min(1, "પૂરું નામ જરૂરી છે")
      .min(2, "પૂરું નામ ઓછામાં ઓછા 2 અક્ષરોનું હોવું જોઈએ.")
      .max(50, "પૂરું નામ 50 અક્ષરોથી ઓછું હોવું જોઈએ")
      .trim(),
    email: z
      .string()
      .min(1, "ઈમેલ આવશ્યક છે")
      .email("કૃપા કરીને માન્ય ઈમેલ દાખલ કરો")
      .trim()
      .toLowerCase(),
    password: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          (val.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val)),
        {
          message:
            "પાસવર્ડમાં ઓછામાં ઓછો એક મોટો અક્ષર, એક નાનો અક્ષર અને એક સંખ્યા હોવી જોઈએ.",
        }
      ),
    confirmPassword: z.string().optional(),
    role: baseUserSchema.role.optional(),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: "પાસવર્ડ્સ મેળ ખાતા નથી",
    path: ["confirmPassword"],
  });

export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;

export const userUpdateApiSchema = userUpdateSchema.omit({
  confirmPassword: true,
});
export type UserUpdateData = z.infer<typeof userUpdateApiSchema>;
