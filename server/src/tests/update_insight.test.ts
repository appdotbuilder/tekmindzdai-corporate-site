
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { insightsTable } from '../db/schema';
import { type CreateInsightInput, type UpdateInsightInput } from '../schema';
import { updateInsight } from '../handlers/update_insight';
import { eq } from 'drizzle-orm';

// Test input for creating insights
const testCreateInput: CreateInsightInput = {
  title: 'Original Insight',
  description: 'Original description for testing',
  order_index: 1
};

describe('updateInsight', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update insight title', async () => {
    // Create initial insight
    const createResult = await db.insert(insightsTable)
      .values(testCreateInput)
      .returning()
      .execute();
    const insightId = createResult[0].id;

    const updateInput: UpdateInsightInput = {
      id: insightId,
      title: 'Updated Insight Title'
    };

    const result = await updateInsight(updateInput);

    expect(result.id).toEqual(insightId);
    expect(result.title).toEqual('Updated Insight Title');
    expect(result.description).toEqual('Original description for testing');
    expect(result.order_index).toEqual(1);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should update insight description', async () => {
    // Create initial insight
    const createResult = await db.insert(insightsTable)
      .values(testCreateInput)
      .returning()
      .execute();
    const insightId = createResult[0].id;

    const updateInput: UpdateInsightInput = {
      id: insightId,
      description: 'Updated description content'
    };

    const result = await updateInsight(updateInput);

    expect(result.id).toEqual(insightId);
    expect(result.title).toEqual('Original Insight');
    expect(result.description).toEqual('Updated description content');
    expect(result.order_index).toEqual(1);
  });

  it('should update insight order_index', async () => {
    // Create initial insight
    const createResult = await db.insert(insightsTable)
      .values(testCreateInput)
      .returning()
      .execute();
    const insightId = createResult[0].id;

    const updateInput: UpdateInsightInput = {
      id: insightId,
      order_index: 5
    };

    const result = await updateInsight(updateInput);

    expect(result.id).toEqual(insightId);
    expect(result.title).toEqual('Original Insight');
    expect(result.description).toEqual('Original description for testing');
    expect(result.order_index).toEqual(5);
  });

  it('should update multiple fields at once', async () => {
    // Create initial insight
    const createResult = await db.insert(insightsTable)
      .values(testCreateInput)
      .returning()
      .execute();
    const insightId = createResult[0].id;

    const updateInput: UpdateInsightInput = {
      id: insightId,
      title: 'Completely Updated Title',
      description: 'Completely updated description',
      order_index: 3
    };

    const result = await updateInsight(updateInput);

    expect(result.id).toEqual(insightId);
    expect(result.title).toEqual('Completely Updated Title');
    expect(result.description).toEqual('Completely updated description');
    expect(result.order_index).toEqual(3);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save updates to database', async () => {
    // Create initial insight
    const createResult = await db.insert(insightsTable)
      .values(testCreateInput)
      .returning()
      .execute();
    const insightId = createResult[0].id;

    const updateInput: UpdateInsightInput = {
      id: insightId,
      title: 'Database Updated Title',
      description: 'Database updated description'
    };

    await updateInsight(updateInput);

    // Verify changes in database
    const insights = await db.select()
      .from(insightsTable)
      .where(eq(insightsTable.id, insightId))
      .execute();

    expect(insights).toHaveLength(1);
    expect(insights[0].title).toEqual('Database Updated Title');
    expect(insights[0].description).toEqual('Database updated description');
    expect(insights[0].order_index).toEqual(1); // Should remain unchanged
    expect(insights[0].updated_at).toBeInstanceOf(Date);
  });

  it('should throw error for non-existent insight', async () => {
    const updateInput: UpdateInsightInput = {
      id: 999,
      title: 'Non-existent Update'
    };

    await expect(updateInsight(updateInput)).rejects.toThrow(/not found/i);
  });
});
