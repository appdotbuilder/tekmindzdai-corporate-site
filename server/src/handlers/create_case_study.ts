
import { db } from '../db';
import { caseStudiesTable } from '../db/schema';
import { type CreateCaseStudyInput, type CaseStudy } from '../schema';

export const createCaseStudy = async (input: CreateCaseStudyInput): Promise<CaseStudy> => {
  try {
    // Insert case study record
    const result = await db.insert(caseStudiesTable)
      .values({
        main_title: input.main_title,
        primary_subtitle: input.primary_subtitle,
        primary_description: input.primary_description,
        secondary_subtitle: input.secondary_subtitle || null,
        secondary_description: input.secondary_description || null,
        order_index: input.order_index
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Case study creation failed:', error);
    throw error;
  }
};
