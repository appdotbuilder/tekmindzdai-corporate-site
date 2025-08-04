
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { offeringsTable } from '../db/schema';
import { type UpdateOfferingInput, type CreateOfferingInput } from '../schema';
import { updateOffering } from '../handlers/update_offering';
import { eq } from 'drizzle-orm';

// Test input for creating an offering
const testCreateInput: CreateOfferingInput = {
  title: 'Original Title',
  description: 'Original description',
  order_index: 0
};

describe('updateOffering', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update all fields of an offering', async () => {
    // Create an offering first
    const created = await db.insert(offeringsTable)
      .values(testCreateInput)
      .returning()
      .execute();

    const originalOffering = created[0];

    // Update input with all fields
    const updateInput: UpdateOfferingInput = {
      id: originalOffering.id,
      title: 'Updated Title',
      description: 'Updated description',
      order_index: 5
    };

    const result = await updateOffering(updateInput);

    // Verify updated fields
    expect(result.id).toEqual(originalOffering.id);
    expect(result.title).toEqual('Updated Title');
    expect(result.description).toEqual('Updated description');
    expect(result.order_index).toEqual(5);
    expect(result.created_at).toEqual(originalOffering.created_at);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(originalOffering.updated_at.getTime());
  });

  it('should update only provided fields', async () => {
    // Create an offering first
    const created = await db.insert(offeringsTable)
      .values(testCreateInput)
      .returning()
      .execute();

    const originalOffering = created[0];

    // Update input with only title
    const updateInput: UpdateOfferingInput = {
      id: originalOffering.id,
      title: 'Only Title Updated'
    };

    const result = await updateOffering(updateInput);

    // Verify only title was updated
    expect(result.id).toEqual(originalOffering.id);
    expect(result.title).toEqual('Only Title Updated');
    expect(result.description).toEqual(originalOffering.description); // Unchanged
    expect(result.order_index).toEqual(originalOffering.order_index); // Unchanged
    expect(result.created_at).toEqual(originalOffering.created_at);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(originalOffering.updated_at.getTime());
  });

  it('should save updated offering to database', async () => {
    // Create an offering first
    const created = await db.insert(offeringsTable)
      .values(testCreateInput)
      .returning()
      .execute();

    const originalOffering = created[0];

    // Update input
    const updateInput: UpdateOfferingInput = {
      id: originalOffering.id,
      title: 'Database Test Title',
      description: 'Database test description'
    };

    await updateOffering(updateInput);

    // Query database to verify changes were persisted
    const offerings = await db.select()
      .from(offeringsTable)
      .where(eq(offeringsTable.id, originalOffering.id))
      .execute();

    expect(offerings).toHaveLength(1);
    expect(offerings[0].title).toEqual('Database Test Title');
    expect(offerings[0].description).toEqual('Database test description');
    expect(offerings[0].order_index).toEqual(originalOffering.order_index); // Unchanged
    expect(offerings[0].updated_at).toBeInstanceOf(Date);
    expect(offerings[0].updated_at.getTime()).toBeGreaterThan(originalOffering.updated_at.getTime());
  });

  it('should throw error when offering not found', async () => {
    const updateInput: UpdateOfferingInput = {
      id: 999, // Non-existent ID
      title: 'Updated Title'
    };

    expect(updateOffering(updateInput)).rejects.toThrow(/not found/i);
  });

  it('should update order_index to zero', async () => {
    // Create an offering with non-zero order_index
    const created = await db.insert(offeringsTable)
      .values({
        ...testCreateInput,
        order_index: 10
      })
      .returning()
      .execute();

    const originalOffering = created[0];

    // Update order_index to 0
    const updateInput: UpdateOfferingInput = {
      id: originalOffering.id,
      order_index: 0
    };

    const result = await updateOffering(updateInput);

    expect(result.order_index).toEqual(0);
    expect(result.title).toEqual(originalOffering.title); // Unchanged
    expect(result.description).toEqual(originalOffering.description); // Unchanged
  });
});
