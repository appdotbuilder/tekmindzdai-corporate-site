
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactSubmissionsTable } from '../db/schema';
import { type CreateContactSubmissionInput } from '../schema';
import { createContactSubmission } from '../handlers/create_contact_submission';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateContactSubmissionInput = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1-555-123-4567',
  message: 'I am interested in learning more about your services.'
};

describe('createContactSubmission', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a contact submission', async () => {
    const result = await createContactSubmission(testInput);

    // Basic field validation
    expect(result.first_name).toEqual('John');
    expect(result.last_name).toEqual('Doe');
    expect(result.email).toEqual('john.doe@example.com');
    expect(result.phone).toEqual('+1-555-123-4567');
    expect(result.message).toEqual('I am interested in learning more about your services.');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save contact submission to database', async () => {
    const result = await createContactSubmission(testInput);

    // Query using proper drizzle syntax
    const submissions = await db.select()
      .from(contactSubmissionsTable)
      .where(eq(contactSubmissionsTable.id, result.id))
      .execute();

    expect(submissions).toHaveLength(1);
    expect(submissions[0].first_name).toEqual('John');
    expect(submissions[0].last_name).toEqual('Doe');
    expect(submissions[0].email).toEqual('john.doe@example.com');
    expect(submissions[0].phone).toEqual('+1-555-123-4567');
    expect(submissions[0].message).toEqual('I am interested in learning more about your services.');
    expect(submissions[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle different contact information', async () => {
    const alternateInput: CreateContactSubmissionInput = {
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@company.com',
      phone: '555-987-6543',
      message: 'Can you provide a quote for consulting services?'
    };

    const result = await createContactSubmission(alternateInput);

    expect(result.first_name).toEqual('Jane');
    expect(result.last_name).toEqual('Smith');
    expect(result.email).toEqual('jane.smith@company.com');
    expect(result.phone).toEqual('555-987-6543');
    expect(result.message).toEqual('Can you provide a quote for consulting services?');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });
});
