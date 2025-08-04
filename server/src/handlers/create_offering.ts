
import { db } from '../db';
import { offeringsTable } from '../db/schema';
import { type CreateOfferingInput, type Offering } from '../schema';

export const createOffering = async (input: CreateOfferingInput): Promise<Offering> => {
  try {
    // Insert offering record
    const result = await db.insert(offeringsTable)
      .values({
        title: input.title,
        description: input.description,
        order_index: input.order_index
      })
      .returning()
      .execute();

    // Return the created offering
    return result[0];
  } catch (error) {
    console.error('Offering creation failed:', error);
    throw error;
  }
};
