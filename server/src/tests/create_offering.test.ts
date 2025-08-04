
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { offeringsTable } from '../db/schema';
import { type CreateOfferingInput } from '../schema';
import { createOffering } from '../handlers/create_offering';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateOfferingInput = {
  title: 'Test Offering',
  description: 'A comprehensive offering for testing purposes',
  order_index: 1
};

describe('createOffering', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create an offering', async () => {
    const result = await createOffering(testInput);

    // Basic field validation
    expect(result.title).toEqual('Test Offering');
    expect(result.description).toEqual(testInput.description);
    expect(result.order_index).toEqual(1);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save offering to database', async () => {
    const result = await createOffering(testInput);

    // Query using proper drizzle syntax
    const offerings = await db.select()
      .from(offeringsTable)
      .where(eq(offeringsTable.id, result.id))
      .execute();

    expect(offerings).toHaveLength(1);
    expect(offerings[0].title).toEqual('Test Offering');
    expect(offerings[0].description).toEqual(testInput.description);
    expect(offerings[0].order_index).toEqual(1);
    expect(offerings[0].created_at).toBeInstanceOf(Date);
    expect(offerings[0].updated_at).toBeInstanceOf(Date);
  });

  it('should create offering with zero order index', async () => {
    const zeroOrderInput: CreateOfferingInput = {
      title: 'Zero Order Offering',
      description: 'An offering with zero order index',
      order_index: 0
    };

    const result = await createOffering(zeroOrderInput);

    expect(result.order_index).toEqual(0);
    expect(result.title).toEqual('Zero Order Offering');
    expect(result.description).toEqual(zeroOrderInput.description);
  });

  it('should create multiple offerings with different order indices', async () => {
    const firstOffering: CreateOfferingInput = {
      title: 'First Offering',
      description: 'First offering description',
      order_index: 1
    };

    const secondOffering: CreateOfferingInput = {
      title: 'Second Offering',
      description: 'Second offering description',
      order_index: 5
    };

    const result1 = await createOffering(firstOffering);
    const result2 = await createOffering(secondOffering);

    expect(result1.order_index).toEqual(1);
    expect(result2.order_index).toEqual(5);
    expect(result1.id).not.toEqual(result2.id);

    // Verify both are in database
    const allOfferings = await db.select()
      .from(offeringsTable)
      .execute();

    expect(allOfferings).toHaveLength(2);
  });
});
