
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { leadershipProfilesTable } from '../db/schema';
import { type UpdateLeadershipProfileInput } from '../schema';
import { updateLeadershipProfile } from '../handlers/update_leadership_profile';
import { eq } from 'drizzle-orm';

describe('updateLeadershipProfile', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update a leadership profile', async () => {
    // Create test leadership profile first
    const created = await db.insert(leadershipProfilesTable)
      .values({
        name: 'Original Name',
        title: 'Original Title',
        order_index: 1
      })
      .returning()
      .execute();

    const testInput: UpdateLeadershipProfileInput = {
      id: created[0].id,
      name: 'Updated Name',
      title: 'Updated Title',
      order_index: 2
    };

    const result = await updateLeadershipProfile(testInput);

    // Verify updated fields
    expect(result.id).toEqual(created[0].id);
    expect(result.name).toEqual('Updated Name');
    expect(result.title).toEqual('Updated Title');
    expect(result.order_index).toEqual(2);
    expect(result.created_at).toEqual(created[0].created_at);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > created[0].updated_at).toBe(true);
  });

  it('should update only specified fields', async () => {
    // Create test leadership profile first
    const created = await db.insert(leadershipProfilesTable)
      .values({
        name: 'Original Name',
        title: 'Original Title',
        order_index: 1
      })
      .returning()
      .execute();

    const testInput: UpdateLeadershipProfileInput = {
      id: created[0].id,
      name: 'Updated Name Only'
    };

    const result = await updateLeadershipProfile(testInput);

    // Verify only name was updated
    expect(result.name).toEqual('Updated Name Only');
    expect(result.title).toEqual('Original Title'); // Should remain unchanged
    expect(result.order_index).toEqual(1); // Should remain unchanged
    expect(result.updated_at > created[0].updated_at).toBe(true);
  });

  it('should save changes to database', async () => {
    // Create test leadership profile first
    const created = await db.insert(leadershipProfilesTable)
      .values({
        name: 'Original Name',
        title: 'Original Title',
        order_index: 1
      })
      .returning()
      .execute();

    const testInput: UpdateLeadershipProfileInput = {
      id: created[0].id,
      name: 'Database Updated Name',
      title: 'Database Updated Title'
    };

    await updateLeadershipProfile(testInput);

    // Verify changes persisted in database
    const profiles = await db.select()
      .from(leadershipProfilesTable)
      .where(eq(leadershipProfilesTable.id, created[0].id))
      .execute();

    expect(profiles).toHaveLength(1);
    expect(profiles[0].name).toEqual('Database Updated Name');
    expect(profiles[0].title).toEqual('Database Updated Title');
    expect(profiles[0].order_index).toEqual(1); // Should remain unchanged
  });

  it('should throw error when leadership profile not found', async () => {
    const testInput: UpdateLeadershipProfileInput = {
      id: 999999, // Non-existent ID
      name: 'Updated Name'
    };

    expect(async () => {
      await updateLeadershipProfile(testInput);
    }).toThrow(/not found/i);
  });

  it('should update leadership profile with zero order_index', async () => {
    // Create test leadership profile first
    const created = await db.insert(leadershipProfilesTable)
      .values({
        name: 'Original Name',
        title: 'Original Title',
        order_index: 5
      })
      .returning()
      .execute();

    const testInput: UpdateLeadershipProfileInput = {
      id: created[0].id,
      order_index: 0 // Test zero value
    };

    const result = await updateLeadershipProfile(testInput);

    expect(result.order_index).toEqual(0);
    expect(result.name).toEqual('Original Name'); // Should remain unchanged
    expect(result.title).toEqual('Original Title'); // Should remain unchanged
  });
});
