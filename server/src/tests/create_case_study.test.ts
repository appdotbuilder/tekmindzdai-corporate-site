
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { caseStudiesTable } from '../db/schema';
import { type CreateCaseStudyInput } from '../schema';
import { createCaseStudy } from '../handlers/create_case_study';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateCaseStudyInput = {
  main_title: 'Test Case Study',
  primary_subtitle: 'Primary Testing Subtitle',
  primary_description: 'This is a primary description for testing purposes',
  secondary_subtitle: 'Secondary Testing Subtitle',
  secondary_description: 'This is a secondary description for testing purposes',
  order_index: 1
};

// Test input with minimal required fields
const minimalInput: CreateCaseStudyInput = {
  main_title: 'Minimal Case Study',
  primary_subtitle: 'Minimal Primary Subtitle',
  primary_description: 'Minimal primary description',
  order_index: 0
};

describe('createCaseStudy', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a case study with all fields', async () => {
    const result = await createCaseStudy(testInput);

    // Basic field validation
    expect(result.main_title).toEqual('Test Case Study');
    expect(result.primary_subtitle).toEqual('Primary Testing Subtitle');
    expect(result.primary_description).toEqual('This is a primary description for testing purposes');
    expect(result.secondary_subtitle).toEqual('Secondary Testing Subtitle');
    expect(result.secondary_description).toEqual('This is a secondary description for testing purposes');
    expect(result.order_index).toEqual(1);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create a case study with minimal fields', async () => {
    const result = await createCaseStudy(minimalInput);

    // Basic field validation
    expect(result.main_title).toEqual('Minimal Case Study');
    expect(result.primary_subtitle).toEqual('Minimal Primary Subtitle');
    expect(result.primary_description).toEqual('Minimal primary description');
    expect(result.secondary_subtitle).toBeNull();
    expect(result.secondary_description).toBeNull();
    expect(result.order_index).toEqual(0);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save case study to database', async () => {
    const result = await createCaseStudy(testInput);

    // Query using proper drizzle syntax
    const caseStudies = await db.select()
      .from(caseStudiesTable)
      .where(eq(caseStudiesTable.id, result.id))
      .execute();

    expect(caseStudies).toHaveLength(1);
    expect(caseStudies[0].main_title).toEqual('Test Case Study');
    expect(caseStudies[0].primary_subtitle).toEqual('Primary Testing Subtitle');
    expect(caseStudies[0].primary_description).toEqual('This is a primary description for testing purposes');
    expect(caseStudies[0].secondary_subtitle).toEqual('Secondary Testing Subtitle');
    expect(caseStudies[0].secondary_description).toEqual('This is a secondary description for testing purposes');
    expect(caseStudies[0].order_index).toEqual(1);
    expect(caseStudies[0].created_at).toBeInstanceOf(Date);
    expect(caseStudies[0].updated_at).toBeInstanceOf(Date);
  });

  it('should handle null secondary fields correctly', async () => {
    const result = await createCaseStudy(minimalInput);

    // Query database to verify null handling
    const caseStudies = await db.select()
      .from(caseStudiesTable)
      .where(eq(caseStudiesTable.id, result.id))
      .execute();

    expect(caseStudies).toHaveLength(1);
    expect(caseStudies[0].secondary_subtitle).toBeNull();
    expect(caseStudies[0].secondary_description).toBeNull();
  });
});
