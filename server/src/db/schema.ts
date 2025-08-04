
import { serial, text, pgTable, timestamp, integer } from 'drizzle-orm/pg-core';

export const offeringsTable = pgTable('offerings', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  order_index: integer('order_index').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const solutionsTable = pgTable('solutions', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  order_index: integer('order_index').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const servicesTable = pgTable('services', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  order_index: integer('order_index').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const insightsTable = pgTable('insights', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  order_index: integer('order_index').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const caseStudiesTable = pgTable('case_studies', {
  id: serial('id').primaryKey(),
  main_title: text('main_title').notNull(),
  primary_subtitle: text('primary_subtitle').notNull(),
  primary_description: text('primary_description').notNull(),
  secondary_subtitle: text('secondary_subtitle'), // Nullable by default
  secondary_description: text('secondary_description'), // Nullable by default
  order_index: integer('order_index').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const leadershipProfilesTable = pgTable('leadership_profiles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  title: text('title').notNull(),
  order_index: integer('order_index').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const contactSubmissionsTable = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  message: text('message').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript types for the table schemas
export type Offering = typeof offeringsTable.$inferSelect;
export type NewOffering = typeof offeringsTable.$inferInsert;
export type Solution = typeof solutionsTable.$inferSelect;
export type NewSolution = typeof solutionsTable.$inferInsert;
export type Service = typeof servicesTable.$inferSelect;
export type NewService = typeof servicesTable.$inferInsert;
export type Insight = typeof insightsTable.$inferSelect;
export type NewInsight = typeof insightsTable.$inferInsert;
export type CaseStudy = typeof caseStudiesTable.$inferSelect;
export type NewCaseStudy = typeof caseStudiesTable.$inferInsert;
export type LeadershipProfile = typeof leadershipProfilesTable.$inferSelect;
export type NewLeadershipProfile = typeof leadershipProfilesTable.$inferInsert;
export type ContactSubmission = typeof contactSubmissionsTable.$inferSelect;
export type NewContactSubmission = typeof contactSubmissionsTable.$inferInsert;

// Export all tables for relation queries
export const tables = {
  offerings: offeringsTable,
  solutions: solutionsTable,
  services: servicesTable,
  insights: insightsTable,
  caseStudies: caseStudiesTable,
  leadershipProfiles: leadershipProfilesTable,
  contactSubmissions: contactSubmissionsTable,
};
