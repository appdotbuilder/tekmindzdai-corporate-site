
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { solutionsTable } from '../db/schema';
import { type CreateSolutionInput, type UpdateSolutionInput } from '../schema';
import { updateSolution } from '../handlers/update_solution';
import { eq } from 'drizzle-orm';

// Test input for creating initial solution
const testCreateInput: CreateSolutionInput = {
  title: 'Original Solution',
  description: 'Original description',
  order_index: 1
};

// Test input for updating solution
const testUpdateInput: UpdateSolutionInput = {
  id: 1, // Will be updated with actual ID
  title: 'Updated Solution',
  description: 'Updated description',
  order_index: 2
};

describe('updateSolution', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update all solution fields', async () => {
    // Create initial solution
    const createResult = await db.insert(solutionsTable)
      .values({
        title: testCreateInput.title,
        description: testCreateInput.description,
        order_index: testCreateInput.order_index
      })
      .returning()
      .execute();

    const createdSolution = createResult[0];
    const updateInput = { ...testUpdateInput, id: createdSolution.id };

    // Update the solution
    const result = await updateSolution(updateInput);

    // Verify updated fields
    expect(result.id).toEqual(createdSolution.id);
    expect(result.title).toEqual('Updated Solution');
    expect(result.description).toEqual('Updated description');
    expect(result.order_index).toEqual(2);
    expect(result.created_at).toEqual(createdSolution.created_at);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(createdSolution.updated_at.getTime());
  });

  it('should update only provided fields', async () => {
    // Create initial solution
    const createResult = await db.insert(solutionsTable)
      .values({
        title: testCreateInput.title,
        description: testCreateInput.description,
        order_index: testCreateInput.order_index
      })
      .returning()
      .execute();

    const createdSolution = createResult[0];

    // Update only title
    const partialUpdateInput: UpdateSolutionInput = {
      id: createdSolution.id,
      title: 'Only Title Updated'
    };

    const result = await updateSolution(partialUpdateInput);

    // Verify only title was updated
    expect(result.title).toEqual('Only Title Updated');
    expect(result.description).toEqual(testCreateInput.description);
    expect(result.order_index).toEqual(testCreateInput.order_index);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(createdSolution.updated_at.getTime());
  });

  it('should save updates to database', async () => {
    // Create initial solution
    const createResult = await db.insert(solutionsTable)
      .values({
        title: testCreateInput.title,
        description: testCreateInput.description,
        order_index: testCreateInput.order_index
      })
      .returning()
      .execute();

    const createdSolution = createResult[0];
    const updateInput = { ...testUpdateInput, id: createdSolution.id };

    // Update the solution
    await updateSolution(updateInput);

    // Query database to verify changes were saved
    const solutions = await db.select()
      .from(solutionsTable)
      .where(eq(solutionsTable.id, createdSolution.id))
      .execute();

    expect(solutions).toHaveLength(1);
    expect(solutions[0].title).toEqual('Updated Solution');
    expect(solutions[0].description).toEqual('Updated description');
    expect(solutions[0].order_index).toEqual(2);
    expect(solutions[0].updated_at).toBeInstanceOf(Date);
  });

  it('should throw error for non-existent solution', async () => {
    const updateInput: UpdateSolutionInput = {
      id: 999,
      title: 'Non-existent Solution'
    };

    await expect(updateSolution(updateInput)).rejects.toThrow(/Solution with id 999 not found/i);
  });

  it('should handle zero order_index', async () => {
    // Create initial solution
    const createResult = await db.insert(solutionsTable)
      .values({
        title: testCreateInput.title,
        description: testCreateInput.description,
        order_index: testCreateInput.order_index
      })
      .returning()
      .execute();

    const createdSolution = createResult[0];

    // Update with zero order_index
    const updateInput: UpdateSolutionInput = {
      id: createdSolution.id,
      order_index: 0
    };

    const result = await updateSolution(updateInput);

    expect(result.order_index).toEqual(0);
    expect(typeof result.order_index).toEqual('number');
  });
});
