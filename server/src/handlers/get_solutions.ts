
import { db } from '../db';
import { solutionsTable } from '../db/schema';
import { type Solution } from '../schema';
import { asc } from 'drizzle-orm';

export const getSolutions = async (): Promise<Solution[]> => {
  try {
    const results = await db.select()
      .from(solutionsTable)
      .orderBy(asc(solutionsTable.order_index))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch solutions:', error);
    throw error;
  }
};
