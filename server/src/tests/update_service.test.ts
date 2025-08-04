
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { type UpdateServiceInput, type CreateServiceInput } from '../schema';
import { updateService } from '../handlers/update_service';
import { eq } from 'drizzle-orm';

// Test inputs
const createInput: CreateServiceInput = {
  title: 'Original Service',
  description: 'Original description',
  order_index: 5
};

const updateInput: UpdateServiceInput = {
  id: 1, // Will be set dynamically
  title: 'Updated Service',
  description: 'Updated description',
  order_index: 10
};

describe('updateService', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update all service fields', async () => {
    // Create initial service
    const createResult = await db.insert(servicesTable)
      .values(createInput)
      .returning()
      .execute();

    const serviceId = createResult[0].id;
    const updatedInput = { ...updateInput, id: serviceId };

    // Update service
    const result = await updateService(updatedInput);

    // Verify updated fields
    expect(result.id).toEqual(serviceId);
    expect(result.title).toEqual('Updated Service');
    expect(result.description).toEqual('Updated description');
    expect(result.order_index).toEqual(10);
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > result.created_at).toBe(true);
  });

  it('should update partial service fields', async () => {
    // Create initial service
    const createResult = await db.insert(servicesTable)
      .values(createInput)
      .returning()
      .execute();

    const serviceId = createResult[0].id;
    const partialInput: UpdateServiceInput = {
      id: serviceId,
      title: 'Partially Updated Service'
    };

    // Update service with partial data
    const result = await updateService(partialInput);

    // Verify only title was updated
    expect(result.id).toEqual(serviceId);
    expect(result.title).toEqual('Partially Updated Service');
    expect(result.description).toEqual('Original description'); // Unchanged
    expect(result.order_index).toEqual(5); // Unchanged
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save updated service to database', async () => {
    // Create initial service
    const createResult = await db.insert(servicesTable)
      .values(createInput)
      .returning()
      .execute();

    const serviceId = createResult[0].id;
    const updatedInput = { ...updateInput, id: serviceId };

    // Update service
    await updateService(updatedInput);

    // Query database to verify changes
    const services = await db.select()
      .from(servicesTable)
      .where(eq(servicesTable.id, serviceId))
      .execute();

    expect(services).toHaveLength(1);
    expect(services[0].title).toEqual('Updated Service');
    expect(services[0].description).toEqual('Updated description');
    expect(services[0].order_index).toEqual(10);
    expect(services[0].updated_at).toBeInstanceOf(Date);
  });

  it('should throw error for non-existent service', async () => {
    const nonExistentInput: UpdateServiceInput = {
      id: 999,
      title: 'Non-existent Service'
    };

    await expect(updateService(nonExistentInput)).rejects.toThrow(/not found/i);
  });

  it('should update only order_index when provided', async () => {
    // Create initial service
    const createResult = await db.insert(servicesTable)
      .values(createInput)
      .returning()
      .execute();

    const serviceId = createResult[0].id;
    const orderOnlyInput: UpdateServiceInput = {
      id: serviceId,
      order_index: 15
    };

    // Update service with only order_index
    const result = await updateService(orderOnlyInput);

    // Verify only order_index was updated
    expect(result.id).toEqual(serviceId);
    expect(result.title).toEqual('Original Service'); // Unchanged
    expect(result.description).toEqual('Original description'); // Unchanged
    expect(result.order_index).toEqual(15); // Updated
    expect(result.updated_at).toBeInstanceOf(Date);
  });
});
