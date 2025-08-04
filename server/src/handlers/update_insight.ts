
import { db } from '../db';
import { insightsTable } from '../db/schema';
import { type UpdateInsightInput, type Insight } from '../schema';
import { eq } from 'drizzle-orm';

export const updateInsight = async (input: UpdateInsightInput): Promise<Insight> => {
  try {
    // Build update values object with only provided fields
    const updateValues: Partial<typeof insightsTable.$inferInsert> = {
      updated_at: new Date()
    };

    if (input.title !== undefined) {
      updateValues.title = input.title;
    }
    if (input.description !== undefined) {
      updateValues.description = input.description;
    }
    if (input.order_index !== undefined) {
      updateValues.order_index = input.order_index;
    }

    // Update insight record
    const result = await db.update(insightsTable)
      .set(updateValues)
      .where(eq(insightsTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Insight with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Insight update failed:', error);
    throw error;
  }
};
