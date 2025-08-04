
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { type Service } from '../schema';
import { asc } from 'drizzle-orm';

export const getServices = async (): Promise<Service[]> => {
  try {
    const result = await db.select()
      .from(servicesTable)
      .orderBy(asc(servicesTable.order_index))
      .execute();

    return result;
  } catch (error) {
    console.error('Failed to get services:', error);
    throw error;
  }
};
