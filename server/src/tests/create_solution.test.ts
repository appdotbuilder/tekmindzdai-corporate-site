
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { solutionsTable } from '../db/schema';
import { type CreateSolutionInput } from '../schema';
import { createSolution } from '../handlers/create_solution';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateSolutionInput = {
  title: 'Test Solution',
  description: 'A solution for testing purposes',
  order_index: 1
};

describe('createSolution', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a solution', async () => {
    const result = await createSolution(testInput);

    // Basic field validation
    expect(result.title).toEqual('Test Solution');
    expect(result.description).toEqual(testInput.description);
    expect(result.order_index).toEqual(1);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save solution to database', async () => {
    const result = await createSolution(testInput);

    // Query using proper drizzle syntax
    const solutions = await db.select()
      .from(solutionsTable)
      .where(eq(solutionsTable.id, result.id))
      .execute();

    expect(solutions).toHaveLength(1);
    expect(solutions[0].title).toEqual('Test Solution');
    expect(solutions[0].description).toEqual(testInput.description);
    expect(solutions[0].order_index).toEqual(1);
    expect(solutions[0].created_at).toBeInstanceOf(Date);
    expect(solutions[0].updated_at).toBeInstanceOf(Date);
  });

  it('should create multiple solutions with different order indices', async () => {
    const solution1 = await createSolution({
      title: 'First Solution',
      description: 'First test solution',
      order_index: 0
    });

    const solution2 = await createSolution({
      title: 'Second Solution',
      description: 'Second test solution',
      order_index: 5
    });

    expect(solution1.order_index).toEqual(0);
    expect(solution2.order_index).toEqual(5);
    expect(solution1.id).not.toEqual(solution2.id);

    // Verify both are in database
    const allSolutions = await db.select()
      .from(solutionsTable)
      .execute();

    expect(allSolutions).toHaveLength(2);
  });
});
