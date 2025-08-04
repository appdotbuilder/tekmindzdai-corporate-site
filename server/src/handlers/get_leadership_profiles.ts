
import { db } from '../db';
import { leadershipProfilesTable } from '../db/schema';
import { type LeadershipProfile } from '../schema';
import { asc } from 'drizzle-orm';

export const getLeadershipProfiles = async (): Promise<LeadershipProfile[]> => {
  try {
    const results = await db.select()
      .from(leadershipProfilesTable)
      .orderBy(asc(leadershipProfilesTable.order_index))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch leadership profiles:', error);
    throw error;
  }
};
