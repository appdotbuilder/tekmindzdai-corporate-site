
import { db } from '../db';
import { offeringsTable } from '../db/schema';
import { type Offering } from '../schema';
import { asc } from 'drizzle-orm';

export const getOfferings = async (): Promise<Offering[]> => {
  try {
    const results = await db.select()
      .from(offeringsTable)
      .orderBy(asc(offeringsTable.order_index))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch offerings:', error);
    throw error;
  }
};
