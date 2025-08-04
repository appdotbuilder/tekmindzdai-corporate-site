
import { db } from '../db';
import { solutionsTable } from '../db/schema';
import { type UpdateSolutionInput, type Solution } from '../schema';
import { eq } from 'drizzle-orm';

export const updateSolution = async (input: UpdateSolutionInput): Promise<Solution> => {
  try {
    // Build the update object with only provided fields
    const updateData: Partial<typeof solutionsTable.$inferInsert> = {
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

    // Update the solution record
    const result = await db.update(solutionsTable)
      .set(updateData)
      .where(eq(solutionsTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Solution with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Solution update failed:', error);
    throw error;
  }
};
