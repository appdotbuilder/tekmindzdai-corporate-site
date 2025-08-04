
import { db } from '../db';
import { leadershipProfilesTable } from '../db/schema';
import { type CreateLeadershipProfileInput, type LeadershipProfile } from '../schema';

export const createLeadershipProfile = async (input: CreateLeadershipProfileInput): Promise<LeadershipProfile> => {
  try {
    // Insert leadership profile record
    const result = await db.insert(leadershipProfilesTable)
      .values({
        name: input.name,
        title: input.title,
        order_index: input.order_index
      })
      .returning()
      .execute();

    // Return the created leadership profile
    const leadershipProfile = result[0];
    return leadershipProfile;
  } catch (error) {
    console.error('Leadership profile creation failed:', error);
    throw error;
  }
};
