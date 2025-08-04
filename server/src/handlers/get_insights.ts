
import { db } from '../db';
import { insightsTable } from '../db/schema';
import { type Insight } from '../schema';
import { asc } from 'drizzle-orm';

export const getInsights = async (): Promise<Insight[]> => {
  try {
    const results = await db.select()
      .from(insightsTable)
      .orderBy(asc(insightsTable.order_index))
      .execute();

    return results;
  } catch (error) {
    console.error('Getting insights failed:', error);
    throw error;
  }
};
