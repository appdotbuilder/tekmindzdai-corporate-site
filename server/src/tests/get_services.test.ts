
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { type CreateServiceInput } from '../schema';
import { getServices } from '../handlers/get_services';

describe('getServices', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no services exist', async () => {
    const result = await getServices();
    expect(result).toEqual([]);
  });

  it('should return all services ordered by order_index', async () => {
    // Create test services with different order_index values
    const services = [
      {
        title: 'Service C',
        description: 'Third service',
        order_index: 2
      },
      {
        title: 'Service A',
        description: 'First service',
        order_index: 0
      },
      {
        title: 'Service B',
        description: 'Second service',
        order_index: 1
      }
    ];

    // Insert services in random order
    await db.insert(servicesTable).values(services).execute();

    const result = await getServices();

    expect(result).toHaveLength(3);
    
    // Verify they are ordered by order_index
    expect(result[0].title).toEqual('Service A');
    expect(result[0].order_index).toEqual(0);
    expect(result[1].title).toEqual('Service B');
    expect(result[1].order_index).toEqual(1);
    expect(result[2].title).toEqual('Service C');
    expect(result[2].order_index).toEqual(2);

    // Verify all fields are present
    result.forEach(service => {
      expect(service.id).toBeDefined();
      expect(service.title).toBeDefined();
      expect(service.description).toBeDefined();
      expect(service.order_index).toBeDefined();
      expect(service.created_at).toBeInstanceOf(Date);
      expect(service.updated_at).toBeInstanceOf(Date);
    });
  });

  it('should handle services with same order_index', async () => {
    // Create services with same order_index
    const services = [
      {
        title: 'Service X',
        description: 'Service X description',
        order_index: 1
      },
      {
        title: 'Service Y',
        description: 'Service Y description',
        order_index: 1
      }
    ];

    await db.insert(servicesTable).values(services).execute();

    const result = await getServices();

    expect(result).toHaveLength(2);
    expect(result[0].order_index).toEqual(1);
    expect(result[1].order_index).toEqual(1);
  });
});
