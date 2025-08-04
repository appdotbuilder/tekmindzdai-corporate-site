
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { insightsTable } from '../db/schema';
import { type CreateInsightInput } from '../schema';
import { getInsights } from '../handlers/get_insights';

describe('getInsights', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no insights exist', async () => {
    const result = await getInsights();
    expect(result).toEqual([]);
  });

  it('should return all insights', async () => {
    // Create test insights
    await db.insert(insightsTable).values([
      {
        title: 'First Insight',
        description: 'First insight description',
        order_index: 1
      },
      {
        title: 'Second Insight',
        description: 'Second insight description',
        order_index: 2
      }
    ]).execute();

    const result = await getInsights();

    expect(result).toHaveLength(2);
    expect(result[0].title).toEqual('First Insight');
    expect(result[0].description).toEqual('First insight description');
    expect(result[0].order_index).toEqual(1);
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
    expect(result[0].updated_at).toBeInstanceOf(Date);

    expect(result[1].title).toEqual('Second Insight');
    expect(result[1].description).toEqual('Second insight description');
    expect(result[1].order_index).toEqual(2);
  });

  it('should return insights ordered by order_index ascending', async () => {
    // Create insights with different order_index values
    await db.insert(insightsTable).values([
      {
        title: 'Third Insight',
        description: 'Should be third',
        order_index: 3
      },
      {
        title: 'First Insight',
        description: 'Should be first',
        order_index: 1
      },
      {
        title: 'Second Insight',
        description: 'Should be second',
        order_index: 2
      }
    ]).execute();

    const result = await getInsights();

    expect(result).toHaveLength(3);
    expect(result[0].title).toEqual('First Insight');
    expect(result[0].order_index).toEqual(1);
    expect(result[1].title).toEqual('Second Insight');
    expect(result[1].order_index).toEqual(2);
    expect(result[2].title).toEqual('Third Insight');
    expect(result[2].order_index).toEqual(3);
  });

  it('should handle insights with same order_index', async () => {
    // Create insights with same order_index
    await db.insert(insightsTable).values([
      {
        title: 'Insight A',
        description: 'Description A',
        order_index: 1
      },
      {
        title: 'Insight B',
        description: 'Description B',
        order_index: 1
      }
    ]).execute();

    const result = await getInsights();

    expect(result).toHaveLength(2);
    // Both should have order_index 1
    expect(result[0].order_index).toEqual(1);
    expect(result[1].order_index).toEqual(1);
    // Should contain both insights
    const titles = result.map(insight => insight.title);
    expect(titles).toContain('Insight A');
    expect(titles).toContain('Insight B');
  });
});
