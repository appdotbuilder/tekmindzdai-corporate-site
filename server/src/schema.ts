
import { z } from 'zod';

// Offering schema
export const offeringSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  order_index: z.number().int(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Offering = z.infer<typeof offeringSchema>;

export const createOfferingInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  order_index: z.number().int().nonnegative()
});

export type CreateOfferingInput = z.infer<typeof createOfferingInputSchema>;

// Solution schema
export const solutionSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  order_index: z.number().int(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Solution = z.infer<typeof solutionSchema>;

export const createSolutionInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  order_index: z.number().int().nonnegative()
});

export type CreateSolutionInput = z.infer<typeof createSolutionInputSchema>;

// Service schema
export const serviceSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  order_index: z.number().int(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Service = z.infer<typeof serviceSchema>;

export const createServiceInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  order_index: z.number().int().nonnegative()
});

export type CreateServiceInput = z.infer<typeof createServiceInputSchema>;

// Insight schema
export const insightSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  order_index: z.number().int(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Insight = z.infer<typeof insightSchema>;

export const createInsightInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  order_index: z.number().int().nonnegative()
});

export type CreateInsightInput = z.infer<typeof createInsightInputSchema>;

// Case Study schema
export const caseStudySchema = z.object({
  id: z.number(),
  main_title: z.string(),
  primary_subtitle: z.string(),
  primary_description: z.string(),
  secondary_subtitle: z.string().nullable(),
  secondary_description: z.string().nullable(),
  order_index: z.number().int(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type CaseStudy = z.infer<typeof caseStudySchema>;

export const createCaseStudyInputSchema = z.object({
  main_title: z.string().min(1, "Main title is required"),
  primary_subtitle: z.string().min(1, "Primary subtitle is required"),
  primary_description: z.string().min(1, "Primary description is required"),
  secondary_subtitle: z.string().nullable().optional(),
  secondary_description: z.string().nullable().optional(),
  order_index: z.number().int().nonnegative()
});

export type CreateCaseStudyInput = z.infer<typeof createCaseStudyInputSchema>;

// Leadership profile schema
export const leadershipProfileSchema = z.object({
  id: z.number(),
  name: z.string(),
  title: z.string(),
  order_index: z.number().int(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type LeadershipProfile = z.infer<typeof leadershipProfileSchema>;

export const createLeadershipProfileInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  order_index: z.number().int().nonnegative()
});

export type CreateLeadershipProfileInput = z.infer<typeof createLeadershipProfileInputSchema>;

// Contact form submission schema
export const contactSubmissionSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  phone: z.string(),
  message: z.string(),
  created_at: z.coerce.date()
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

export const createContactSubmissionInputSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  message: z.string().min(1, "Message is required")
});

export type CreateContactSubmissionInput = z.infer<typeof createContactSubmissionInputSchema>;

// Update schemas
export const updateOfferingInputSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  description: z.string().optional(),
  order_index: z.number().int().nonnegative().optional()
});

export type UpdateOfferingInput = z.infer<typeof updateOfferingInputSchema>;

export const updateSolutionInputSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  description: z.string().optional(),
  order_index: z.number().int().nonnegative().optional()
});

export type UpdateSolutionInput = z.infer<typeof updateSolutionInputSchema>;

export const updateServiceInputSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  description: z.string().optional(),
  order_index: z.number().int().nonnegative().optional()
});

export type UpdateServiceInput = z.infer<typeof updateServiceInputSchema>;

export const updateInsightInputSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  description: z.string().optional(),
  order_index: z.number().int().nonnegative().optional()
});

export type UpdateInsightInput = z.infer<typeof updateInsightInputSchema>;

export const updateCaseStudyInputSchema = z.object({
  id: z.number(),
  main_title: z.string().optional(),
  primary_subtitle: z.string().optional(),
  primary_description: z.string().optional(),
  secondary_subtitle: z.string().nullable().optional(),
  secondary_description: z.string().nullable().optional(),
  order_index: z.number().int().nonnegative().optional()
});

export type UpdateCaseStudyInput = z.infer<typeof updateCaseStudyInputSchema>;

export const updateLeadershipProfileInputSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  title: z.string().optional(),
  order_index: z.number().int().nonnegative().optional()
});

export type UpdateLeadershipProfileInput = z.infer<typeof updateLeadershipProfileInputSchema>;
