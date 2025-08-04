
import { db } from '../db';
import { offeringsTable } from '../db/schema';
import { type UpdateOfferingInput, type Offering } from '../schema';
import { eq } from 'drizzle-orm';

export const updateOffering = async (input: UpdateOfferingInput): Promise<Offering> => {
  try {
    // Build update object with only provided fields
    const updateData: Partial<typeof offeringsTable.$inferInsert> = {};
    
    if (input.title !== undefined) {
      updateData.title = input.title;
    }
    
    if (input.description !== undefined) {
      updateData.description = input.description;
    }
    
    if (input.order_index !== undefined) {
      updateData.order_index = input.order_index;
    }
    
    // Always update the updated_at timestamp
    updateData.updated_at = new Date();

    // Update the offering record
    const result = await db.update(offeringsTable)
      .set(updateData)
      .where(eq(offeringsTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Offering with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Offering update failed:', error);
    throw error;
  }
};
