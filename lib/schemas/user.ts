// lib/schemas/user.ts - Recommended simpler version
import { z } from "zod";

// Base schema for common fields
const baseUserSchema = {
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .trim(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),
  role: z.enum(["admin", "user"], {
    errorMap: () => ({ message: "Please select a role" }),
  }),
};

// Password validation
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

// Create user schema
export const userSchema = z
  .object({
    ...baseUserSchema,
    password: z.string().min(1, "Password is required").pipe(passwordSchema),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
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
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .trim(),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
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
            "Password must be at least 8 characters with uppercase, lowercase, and number",
        }
      ),
    confirmPassword: z.string().optional(),
    role: baseUserSchema.role.optional(),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;

export const userUpdateApiSchema = userUpdateSchema.omit({
  confirmPassword: true,
});
export type UserUpdateData = z.infer<typeof userUpdateApiSchema>;
