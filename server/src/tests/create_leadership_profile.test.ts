
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { leadershipProfilesTable } from '../db/schema';
import { type CreateLeadershipProfileInput } from '../schema';
import { createLeadershipProfile } from '../handlers/create_leadership_profile';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateLeadershipProfileInput = {
  name: 'John Smith',
  title: 'Chief Executive Officer',
  order_index: 1
};

describe('createLeadershipProfile', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a leadership profile', async () => {
    const result = await createLeadershipProfile(testInput);

    // Basic field validation
    expect(result.name).toEqual('John Smith');
    expect(result.title).toEqual('Chief Executive Officer');
    expect(result.order_index).toEqual(1);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save leadership profile to database', async () => {
    const result = await createLeadershipProfile(testInput);

    // Query using proper drizzle syntax
    const profiles = await db.select()
      .from(leadershipProfilesTable)
      .where(eq(leadershipProfilesTable.id, result.id))
      .execute();

    expect(profiles).toHaveLength(1);
    expect(profiles[0].name).toEqual('John Smith');
    expect(profiles[0].title).toEqual('Chief Executive Officer');
    expect(profiles[0].order_index).toEqual(1);
    expect(profiles[0].created_at).toBeInstanceOf(Date);
    expect(profiles[0].updated_at).toBeInstanceOf(Date);
  });

  it('should create multiple leadership profiles with different order indices', async () => {
    const firstProfile = await createLeadershipProfile({
      name: 'Jane Doe',
      title: 'Chief Technology Officer',
      order_index: 2
    });

    const secondProfile = await createLeadershipProfile({
      name: 'Bob Johnson',
      title: 'Chief Financial Officer',
      order_index: 3
    });

    // Verify both profiles were created with correct order indices
    expect(firstProfile.order_index).toEqual(2);
    expect(secondProfile.order_index).toEqual(3);

    // Verify both exist in database
    const allProfiles = await db.select()
      .from(leadershipProfilesTable)
      .execute();

    expect(allProfiles).toHaveLength(2);
    expect(allProfiles.map(p => p.order_index).sort()).toEqual([2, 3]);
  });
});
