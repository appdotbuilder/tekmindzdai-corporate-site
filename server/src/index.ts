
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import {
  createOfferingInputSchema,
  updateOfferingInputSchema,
  createSolutionInputSchema,
  updateSolutionInputSchema,
  createServiceInputSchema,
  updateServiceInputSchema,
  createInsightInputSchema,
  updateInsightInputSchema,
  createCaseStudyInputSchema,
  updateCaseStudyInputSchema,
  createLeadershipProfileInputSchema,
  updateLeadershipProfileInputSchema,
  createContactSubmissionInputSchema
} from './schema';

// Import handlers
import { getOfferings } from './handlers/get_offerings';
import { createOffering } from './handlers/create_offering';
import { updateOffering } from './handlers/update_offering';
import { getSolutions } from './handlers/get_solutions';
import { createSolution } from './handlers/create_solution';
import { updateSolution } from './handlers/update_solution';
import { getServices } from './handlers/get_services';
import { createService } from './handlers/create_service';
import { updateService } from './handlers/update_service';
import { getInsights } from './handlers/get_insights';
import { createInsight } from './handlers/create_insight';
import { updateInsight } from './handlers/update_insight';
import { getCaseStudies } from './handlers/get_case_studies';
import { createCaseStudy } from './handlers/create_case_study';
import { updateCaseStudy } from './handlers/update_case_study';
import { getLeadershipProfiles } from './handlers/get_leadership_profiles';
import { createLeadershipProfile } from './handlers/create_leadership_profile';
import { updateLeadershipProfile } from './handlers/update_leadership_profile';
import { createContactSubmission } from './handlers/create_contact_submission';
import { getContactSubmissions } from './handlers/get_contact_submissions';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Offerings
  getOfferings: publicProcedure
    .query(() => getOfferings()),
  createOffering: publicProcedure
    .input(createOfferingInputSchema)
    .mutation(({ input }) => createOffering(input)),
  updateOffering: publicProcedure
    .input(updateOfferingInputSchema)
    .mutation(({ input }) => updateOffering(input)),

  // Solutions
  getSolutions: publicProcedure
    .query(() => getSolutions()),
  createSolution: publicProcedure
    .input(createSolutionInputSchema)
    .mutation(({ input }) => createSolution(input)),
  updateSolution: publicProcedure
    .input(updateSolutionInputSchema)
    .mutation(({ input }) => updateSolution(input)),

  // Services
  getServices: publicProcedure
    .query(() => getServices()),
  createService: publicProcedure
    .input(createServiceInputSchema)
    .mutation(({ input }) => createService(input)),
  updateService: publicProcedure
    .input(updateServiceInputSchema)
    .mutation(({ input }) => updateService(input)),

  // Insights
  getInsights: publicProcedure
    .query(() => getInsights()),
  createInsight: publicProcedure
    .input(createInsightInputSchema)
    .mutation(({ input }) => createInsight(input)),
  updateInsight: publicProcedure
    .input(updateInsightInputSchema)
    .mutation(({ input }) => updateInsight(input)),

  // Case Studies
  getCaseStudies: publicProcedure
    .query(() => getCaseStudies()),
  createCaseStudy: publicProcedure
    .input(createCaseStudyInputSchema)
    .mutation(({ input }) => createCaseStudy(input)),
  updateCaseStudy: publicProcedure
    .input(updateCaseStudyInputSchema)
    .mutation(({ input }) => updateCaseStudy(input)),

  // Leadership Profiles
  getLeadershipProfiles: publicProcedure
    .query(() => getLeadershipProfiles()),
  createLeadershipProfile: publicProcedure
    .input(createLeadershipProfileInputSchema)
    .mutation(({ input }) => createLeadershipProfile(input)),
  updateLeadershipProfile: publicProcedure
    .input(updateLeadershipProfileInputSchema)
    .mutation(({ input }) => updateLeadershipProfile(input)),

  // Contact Submissions
  createContactSubmission: publicProcedure
    .input(createContactSubmissionInputSchema)
    .mutation(({ input }) => createContactSubmission(input)),
  getContactSubmissions: publicProcedure
    .query(() => getContactSubmissions()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
