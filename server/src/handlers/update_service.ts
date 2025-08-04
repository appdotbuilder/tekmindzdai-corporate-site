
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { type UpdateServiceInput, type Service } from '../schema';
import { eq } from 'drizzle-orm';

export const updateService = async (input: UpdateServiceInput): Promise<Service> => {
  try {
    // Build update object with only provided fields
    const updateData: Partial<typeof servicesTable.$inferInsert> = {
      updated_at: new Date()
    };

    if (input.title !== undefined) {
      updateData.title = input.title;
    }
    if (input.description !== undefined) {
      updateData.description = input.description;
    }
    if (input.order_index !== undefined) {
      updateData.order_index = input.order_index;
    }

    // Update service record
    const result = await db.update(servicesTable)
      .set(updateData)
      .where(eq(servicesTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Service with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Service update failed:', error);
    throw error;
  }
};
