
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { offeringsTable } from '../db/schema';
import { type CreateOfferingInput } from '../schema';
import { getOfferings } from '../handlers/get_offerings';

const testOffering1: CreateOfferingInput = {
  title: 'First Offering',
  description: 'Description for first offering',
  order_index: 2
};

const testOffering2: CreateOfferingInput = {
  title: 'Second Offering',
  description: 'Description for second offering',
  order_index: 1
};

const testOffering3: CreateOfferingInput = {
  title: 'Third Offering',
  description: 'Description for third offering',
  order_index: 3
};

describe('getOfferings', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no offerings exist', async () => {
    const result = await getOfferings();
    expect(result).toEqual([]);
  });

  it('should return all offerings ordered by order_index', async () => {
    // Insert test offerings in random order
    await db.insert(offeringsTable)
      .values([testOffering1, testOffering2, testOffering3])
      .execute();

    const result = await getOfferings();

    expect(result).toHaveLength(3);
    
    // Verify correct ordering by order_index (ascending)
    expect(result[0].title).toEqual('Second Offering');
    expect(result[0].order_index).toEqual(1);
    
    expect(result[1].title).toEqual('First Offering');
    expect(result[1].order_index).toEqual(2);
    
    expect(result[2].title).toEqual('Third Offering');
    expect(result[2].order_index).toEqual(3);
  });

  it('should return offerings with all required fields', async () => {
    await db.insert(offeringsTable)
      .values(testOffering1)
      .execute();

    const result = await getOfferings();

    expect(result).toHaveLength(1);
    const offering = result[0];
    
    expect(offering.id).toBeDefined();
    expect(offering.title).toEqual('First Offering');
    expect(offering.description).toEqual('Description for first offering');
    expect(offering.order_index).toEqual(2);
    expect(offering.created_at).toBeInstanceOf(Date);
    expect(offering.updated_at).toBeInstanceOf(Date);
  });

  it('should handle multiple offerings with same order_index', async () => {
    const duplicateOrderOffering: CreateOfferingInput = {
      title: 'Duplicate Order Offering',
      description: 'Another offering with same order',
      order_index: 1
    };

    await db.insert(offeringsTable)
      .values([testOffering2, duplicateOrderOffering])
      .execute();

    const result = await getOfferings();

    expect(result).toHaveLength(2);
    // Both should have order_index of 1, ordering by id as secondary sort
    expect(result[0].order_index).toEqual(1);
    expect(result[1].order_index).toEqual(1);
  });
});
