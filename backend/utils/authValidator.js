import { z } from "zod";

const EMAIL_MIN_LENGTH = 5;
const EMAIL_MAX_LENGTH = 50;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 20;
const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 20;

const emailSchema = z
  .string({ required_error: "Email is required" })
  .trim()
  .email("Invalid email format")
  .min(EMAIL_MIN_LENGTH, `Email must be at least ${EMAIL_MIN_LENGTH} characters long`)
  .max(EMAIL_MAX_LENGTH, `Email must be at most ${EMAIL_MAX_LENGTH} characters long`);

const passwordSchema = z
  .string({ required_error: "Password is required" })
  .trim()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`)
  .max(PASSWORD_MAX_LENGTH, `Password must be at most ${PASSWORD_MAX_LENGTH} characters long`)
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[@$!%*?&#]/, "Password must contain at least one special character");

const nameSchema = z
  .string({ required_error: "Name is required" })
  .trim()
  .min(NAME_MIN_LENGTH, `Name must be at least ${NAME_MIN_LENGTH} characters long`)
  .max(NAME_MAX_LENGTH, `Name must be at most ${NAME_MAX_LENGTH} characters long`);

export const registerValidation = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string({ required_error: "Confirm password is required" }).trim(),
  name: nameSchema
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginValidation = z.object({
  email: emailSchema,
  password: z.string({ required_error: "Password is required" }).trim().min(1, "Password is required")
});

export const changePasswordValidation = z.object({
  currentPassword: z.string({ required_error: "Current password is required" }).trim().min(1, "Current password is required"),
  newPassword: passwordSchema,
  confirmNewPassword: z.string({ required_error: "Confirm new password is required" }).trim()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords do not match",
  path: ["confirmNewPassword"],
});

export const editProfileValidation = z.object({
  email: emailSchema.optional(),
  name: nameSchema.optional()
}).refine((data) => {
  return data.email !== undefined || data.name !== undefined;
}, {
  message: "At least one field (email or name) must be provided",
  path: ["root"] // Changed from ["email"] to be more accurate
});

export const deleteProfileValidation = z.object({
  password: z.string({ required_error: "Password is required" }).trim().min(1, "Password is required for account deletion")
});