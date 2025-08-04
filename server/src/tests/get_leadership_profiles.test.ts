
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { leadershipProfilesTable } from '../db/schema';
import { type CreateLeadershipProfileInput } from '../schema';
import { getLeadershipProfiles } from '../handlers/get_leadership_profiles';

// Test data
const testProfile1: CreateLeadershipProfileInput = {
  name: 'John Smith',
  title: 'Chief Executive Officer',
  order_index: 2
};

const testProfile2: CreateLeadershipProfileInput = {
  name: 'Jane Doe',
  title: 'Chief Technology Officer',
  order_index: 1
};

const testProfile3: CreateLeadershipProfileInput = {
  name: 'Bob Johnson',
  title: 'Chief Operating Officer',
  order_index: 3
};

describe('getLeadershipProfiles', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no profiles exist', async () => {
    const result = await getLeadershipProfiles();

    expect(result).toEqual([]);
  });

  it('should return all leadership profiles', async () => {
    // Create test profiles
    await db.insert(leadershipProfilesTable)
      .values([testProfile1, testProfile2, testProfile3])
      .execute();

    const result = await getLeadershipProfiles();

    expect(result).toHaveLength(3);
    expect(result[0].name).toBeDefined();
    expect(result[0].title).toBeDefined();
    expect(result[0].order_index).toBeDefined();
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
    expect(result[0].updated_at).toBeInstanceOf(Date);
  });

  it('should return profiles ordered by order_index ascending', async () => {
    // Create test profiles in mixed order
    await db.insert(leadershipProfilesTable)
      .values([testProfile1, testProfile2, testProfile3])
      .execute();

    const result = await getLeadershipProfiles();

    expect(result).toHaveLength(3);
    // Should be ordered by order_index: 1, 2, 3
    expect(result[0].name).toEqual('Jane Doe');
    expect(result[0].order_index).toEqual(1);
    expect(result[1].name).toEqual('John Smith');
    expect(result[1].order_index).toEqual(2);
    expect(result[2].name).toEqual('Bob Johnson');
    expect(result[2].order_index).toEqual(3);
  });

  it('should handle profiles with same order_index', async () => {
    const sameOrderProfile1: CreateLeadershipProfileInput = {
      name: 'Alice Cooper',
      title: 'VP Sales',
      order_index: 1
    };

    const sameOrderProfile2: CreateLeadershipProfileInput = {
      name: 'Charlie Brown',
      title: 'VP Marketing',
      order_index: 1
    };

    await db.insert(leadershipProfilesTable)
      .values([sameOrderProfile1, sameOrderProfile2])
      .execute();

    const result = await getLeadershipProfiles();

    expect(result).toHaveLength(2);
    expect(result[0].order_index).toEqual(1);
    expect(result[1].order_index).toEqual(1);
    // Both should have the same order_index, database will determine final order
  });
});
