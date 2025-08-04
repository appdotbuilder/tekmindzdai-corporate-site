
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { type CreateServiceInput } from '../schema';
import { createService } from '../handlers/create_service';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateServiceInput = {
  title: 'Test Service',
  description: 'A service for testing',
  order_index: 1
};

describe('createService', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a service', async () => {
    const result = await createService(testInput);

    // Basic field validation
    expect(result.title).toEqual('Test Service');
    expect(result.description).toEqual(testInput.description);
    expect(result.order_index).toEqual(1);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save service to database', async () => {
    const result = await createService(testInput);

    // Query using proper drizzle syntax
    const services = await db.select()
      .from(servicesTable)
      .where(eq(servicesTable.id, result.id))
      .execute();

    expect(services).toHaveLength(1);
    expect(services[0].title).toEqual('Test Service');
    expect(services[0].description).toEqual(testInput.description);
    expect(services[0].order_index).toEqual(1);
    expect(services[0].created_at).toBeInstanceOf(Date);
    expect(services[0].updated_at).toBeInstanceOf(Date);
  });

  it('should create service with zero order index', async () => {
    const inputWithZeroIndex: CreateServiceInput = {
      title: 'Zero Index Service',
      description: 'Service with zero order index',
      order_index: 0
    };

    const result = await createService(inputWithZeroIndex);

    expect(result.title).toEqual('Zero Index Service');
    expect(result.order_index).toEqual(0);
    expect(result.id).toBeDefined();
  });
});
