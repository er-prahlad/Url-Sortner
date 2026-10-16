import { z } from "zod";

// ─── URL Shortening ─────────────────────────────────────────────────────────

export const createLinkSchema = z.object({
  originalUrl: z
    .string()
    .min(1, "URL is required")
    .url("Please enter a valid URL")
    .refine(
      (url) => url.startsWith("http://") || url.startsWith("https://"),
      "URL must start with http:// or https://"
    ),
  customAlias: z
    .string()
    .optional()
    .refine(
      (alias) => !alias || /^[a-zA-Z0-9-_]+$/.test(alias),
      "Alias can only contain letters, numbers, hyphens, and underscores"
    )
    .refine(
      (alias) => !alias || alias.length >= 3,
      "Alias must be at least 3 characters"
    )
    .refine(
      (alias) => !alias || alias.length <= 30,
      "Alias must be 30 characters or less"
    ),
  expiresAt: z.string().optional(),
  password: z.string().optional(),
});

export type CreateLinkFormData = z.infer<typeof createLinkSchema>;

// ─── Auth ──────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be 50 characters or less"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// ─── Link Editing ──────────────────────────────────────────────────────────

export const editLinkSchema = z.object({
  customAlias: z
    .string()
    .optional()
    .refine(
      (alias) => !alias || /^[a-zA-Z0-9-_]+$/.test(alias),
      "Alias can only contain letters, numbers, hyphens, and underscores"
    ),
  expiresAt: z.string().optional(),
  title: z.string().max(100, "Title must be 100 characters or less").optional(),
});

export type EditLinkFormData = z.infer<typeof editLinkSchema>;

// ─── Settings ──────────────────────────────────────────────────────────────

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be 50 characters or less"),
  email: z.string().email("Please enter a valid email address"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// ─── UTM Builder ───────────────────────────────────────────────────────────

export const utmSchema = z.object({
  baseUrl: z
    .string()
    .min(1, "Base URL is required")
    .url("Please enter a valid URL"),
  source: z.string().min(1, "Source is required"),
  medium: z.string().optional(),
  campaign: z.string().optional(),
  term: z.string().optional(),
  content: z.string().optional(),
});

export type UTMFormData = z.infer<typeof utmSchema>;
