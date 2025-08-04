
import { db } from '../db';
import { solutionsTable } from '../db/schema';
import { type CreateSolutionInput, type Solution } from '../schema';

export const createSolution = async (input: CreateSolutionInput): Promise<Solution> => {
  try {
    // Insert solution record
    const result = await db.insert(solutionsTable)
      .values({
        title: input.title,
        description: input.description,
        order_index: input.order_index
      })
      .returning()
      .execute();

    const solution = result[0];
    return solution;
  } catch (error) {
    console.error('Solution creation failed:', error);
    throw error;
  }
};
