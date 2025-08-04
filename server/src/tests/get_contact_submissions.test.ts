
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactSubmissionsTable } from '../db/schema';
import { type CreateContactSubmissionInput } from '../schema';
import { getContactSubmissions } from '../handlers/get_contact_submissions';

// Test contact submission data
const testSubmission1: CreateContactSubmissionInput = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  phone: '555-0123',
  message: 'I need help with my project'
};

const testSubmission2: CreateContactSubmissionInput = {
  first_name: 'Jane',
  last_name: 'Smith',
  email: 'jane.smith@example.com',
  phone: '555-0456',
  message: 'Interested in your services'
};

describe('getContactSubmissions', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no submissions exist', async () => {
    const result = await getContactSubmissions();

    expect(result).toEqual([]);
  });

  it('should fetch all contact submissions', async () => {
    // Create test submissions
    await db.insert(contactSubmissionsTable)
      .values([testSubmission1, testSubmission2])
      .execute();

    const result = await getContactSubmissions();

    expect(result).toHaveLength(2);
    
    // Check first submission fields
    const firstSubmission = result.find(s => s.first_name === 'John');
    expect(firstSubmission).toBeDefined();
    expect(firstSubmission!.last_name).toEqual('Doe');
    expect(firstSubmission!.email).toEqual('john.doe@example.com');
    expect(firstSubmission!.phone).toEqual('555-0123');
    expect(firstSubmission!.message).toEqual('I need help with my project');
    expect(firstSubmission!.id).toBeDefined();
    expect(firstSubmission!.created_at).toBeInstanceOf(Date);

    // Check second submission fields
    const secondSubmission = result.find(s => s.first_name === 'Jane');
    expect(secondSubmission).toBeDefined();
    expect(secondSubmission!.last_name).toEqual('Smith');
    expect(secondSubmission!.email).toEqual('jane.smith@example.com');
    expect(secondSubmission!.phone).toEqual('555-0456');
    expect(secondSubmission!.message).toEqual('Interested in your services');
    expect(secondSubmission!.id).toBeDefined();
    expect(secondSubmission!.created_at).toBeInstanceOf(Date);
  });

  it('should return submissions ordered by created_at desc (newest first)', async () => {
    // Create first submission
    await db.insert(contactSubmissionsTable)
      .values(testSubmission1)
      .execute();

    // Wait a moment to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    // Create second submission
    await db.insert(contactSubmissionsTable)
      .values(testSubmission2)
      .execute();

    const result = await getContactSubmissions();

    expect(result).toHaveLength(2);
    
    // Newest submission (Jane) should be first
    expect(result[0].first_name).toEqual('Jane');
    expect(result[1].first_name).toEqual('John');
    
    // Verify timestamps are in descending order
    expect(result[0].created_at >= result[1].created_at).toBe(true);
  });

  it('should handle single submission correctly', async () => {
    await db.insert(contactSubmissionsTable)
      .values(testSubmission1)
      .execute();

    const result = await getContactSubmissions();

    expect(result).toHaveLength(1);
    expect(result[0].first_name).toEqual('John');
    expect(result[0].last_name).toEqual('Doe');
    expect(result[0].email).toEqual('john.doe@example.com');
    expect(result[0].created_at).toBeInstanceOf(Date);
  });
});
