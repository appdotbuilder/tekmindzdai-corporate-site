
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { insightsTable } from '../db/schema';
import { type CreateInsightInput } from '../schema';
import { createInsight } from '../handlers/create_insight';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateInsightInput = {
  title: 'Test Insight',
  description: 'An insight for testing purposes',
  order_index: 1
};

describe('createInsight', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create an insight', async () => {
    const result = await createInsight(testInput);

    // Basic field validation
    expect(result.title).toEqual('Test Insight');
    expect(result.description).toEqual('An insight for testing purposes');
    expect(result.order_index).toEqual(1);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save insight to database', async () => {
    const result = await createInsight(testInput);

    // Query using proper drizzle syntax
    const insights = await db.select()
      .from(insightsTable)
      .where(eq(insightsTable.id, result.id))
      .execute();

    expect(insights).toHaveLength(1);
    expect(insights[0].title).toEqual('Test Insight');
    expect(insights[0].description).toEqual('An insight for testing purposes');
    expect(insights[0].order_index).toEqual(1);
    expect(insights[0].created_at).toBeInstanceOf(Date);
    expect(insights[0].updated_at).toBeInstanceOf(Date);
  });

  it('should create insights with different order indices', async () => {
    const firstInput: CreateInsightInput = {
      title: 'First Insight',
      description: 'First insight description',
      order_index: 0
    };

    const secondInput: CreateInsightInput = {
      title: 'Second Insight',
      description: 'Second insight description',
      order_index: 5
    };

    const firstResult = await createInsight(firstInput);
    const secondResult = await createInsight(secondInput);

    expect(firstResult.order_index).toEqual(0);
    expect(secondResult.order_index).toEqual(5);
    expect(firstResult.id).not.toEqual(secondResult.id);
  });

  it('should handle empty order_index correctly', async () => {
    const inputWithZeroIndex: CreateInsightInput = {
      title: 'Zero Index Insight',
      description: 'Insight with zero order index',
      order_index: 0
    };

    const result = await createInsight(inputWithZeroIndex);

    expect(result.order_index).toEqual(0);
    expect(result.title).toEqual('Zero Index Insight');
  });
});
