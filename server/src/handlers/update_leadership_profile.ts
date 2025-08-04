
import { db } from '../db';
import { leadershipProfilesTable } from '../db/schema';
import { type UpdateLeadershipProfileInput, type LeadershipProfile } from '../schema';
import { eq } from 'drizzle-orm';

export const updateLeadershipProfile = async (input: UpdateLeadershipProfileInput): Promise<LeadershipProfile> => {
  try {
    // Build update values, only including defined fields
    const updateValues: any = {};
    
    if (input.name !== undefined) {
      updateValues['name'] = input.name;
    }
    
    if (input.title !== undefined) {
      updateValues['title'] = input.title;
    }
    
    if (input.order_index !== undefined) {
      updateValues['order_index'] = input.order_index;
    }

    // Always update the updated_at timestamp
    updateValues['updated_at'] = new Date();

    // Update the leadership profile
    const result = await db.update(leadershipProfilesTable)
      .set(updateValues)
      .where(eq(leadershipProfilesTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Leadership profile with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Leadership profile update failed:', error);
    throw error;
  }
};
