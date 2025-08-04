
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { solutionsTable } from '../db/schema';
import { type CreateSolutionInput } from '../schema';
import { getSolutions } from '../handlers/get_solutions';

describe('getSolutions', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no solutions exist', async () => {
    const result = await getSolutions();
    expect(result).toEqual([]);
  });

  it('should return all solutions ordered by order_index', async () => {
    // Create test solutions with different order indices
    const testSolutions: CreateSolutionInput[] = [
      {
        title: 'Solution C',
        description: 'Third solution',
        order_index: 2
      },
      {
        title: 'Solution A',
        description: 'First solution',
        order_index: 0
      },
      {
        title: 'Solution B',
        description: 'Second solution',
        order_index: 1
      }
    ];

    // Insert solutions in random order
    for (const solution of testSolutions) {
      await db.insert(solutionsTable)
        .values(solution)
        .execute();
    }

    const result = await getSolutions();

    expect(result).toHaveLength(3);
    
    // Verify ordering by order_index
    expect(result[0].title).toEqual('Solution A');
    expect(result[0].order_index).toEqual(0);
    
    expect(result[1].title).toEqual('Solution B');
    expect(result[1].order_index).toEqual(1);
    
    expect(result[2].title).toEqual('Solution C');
    expect(result[2].order_index).toEqual(2);

    // Verify all fields are present
    result.forEach(solution => {
      expect(solution.id).toBeDefined();
      expect(solution.title).toBeDefined();
      expect(solution.description).toBeDefined();
      expect(solution.order_index).toBeDefined();
      expect(solution.created_at).toBeInstanceOf(Date);
      expect(solution.updated_at).toBeInstanceOf(Date);
    });
  });

  it('should handle solutions with same order_index', async () => {
    // Create solutions with same order_index
    const testSolutions: CreateSolutionInput[] = [
      {
        title: 'Solution X',
        description: 'First solution with same order',
        order_index: 5
      },
      {
        title: 'Solution Y',
        description: 'Second solution with same order',
        order_index: 5
      }
    ];

    for (const solution of testSolutions) {
      await db.insert(solutionsTable)
        .values(solution)
        .execute();
    }

    const result = await getSolutions();

    expect(result).toHaveLength(2);
    expect(result[0].order_index).toEqual(5);
    expect(result[1].order_index).toEqual(5);
  });
});
