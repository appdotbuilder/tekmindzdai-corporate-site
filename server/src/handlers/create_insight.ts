
import { db } from '../db';
import { insightsTable } from '../db/schema';
import { type CreateInsightInput, type Insight } from '../schema';

export const createInsight = async (input: CreateInsightInput): Promise<Insight> => {
  try {
    // Insert insight record
    const result = await db.insert(insightsTable)
      .values({
        title: input.title,
        description: input.description,
        order_index: input.order_index
      })
      .returning()
      .execute();

    // Return the created insight
    return result[0];
  } catch (error) {
    console.error('Insight creation failed:', error);
    throw error;
  }
};
