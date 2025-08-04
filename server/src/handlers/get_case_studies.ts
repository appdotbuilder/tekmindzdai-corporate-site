
import { db } from '../db';
import { caseStudiesTable } from '../db/schema';
import { type CaseStudy } from '../schema';
import { asc } from 'drizzle-orm';

export const getCaseStudies = async (): Promise<CaseStudy[]> => {
  try {
    const results = await db.select()
      .from(caseStudiesTable)
      .orderBy(asc(caseStudiesTable.order_index))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch case studies:', error);
    throw error;
  }
};
