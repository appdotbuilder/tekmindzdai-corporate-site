
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { caseStudiesTable } from '../db/schema';
import { type CreateCaseStudyInput, type UpdateCaseStudyInput } from '../schema';
import { updateCaseStudy } from '../handlers/update_case_study';
import { eq } from 'drizzle-orm';

// Test input for creating initial case study
const initialCaseStudyInput: CreateCaseStudyInput = {
  main_title: 'Initial Main Title',
  primary_subtitle: 'Initial Primary Subtitle',
  primary_description: 'Initial primary description',
  secondary_subtitle: 'Initial Secondary Subtitle',
  secondary_description: 'Initial secondary description',
  order_index: 1
};

describe('updateCaseStudy', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update all fields of a case study', async () => {
    // Create initial case study
    const initialResult = await db.insert(caseStudiesTable)
      .values({
        main_title: initialCaseStudyInput.main_title,
        primary_subtitle: initialCaseStudyInput.primary_subtitle,
        primary_description: initialCaseStudyInput.primary_description,
        secondary_subtitle: initialCaseStudyInput.secondary_subtitle || null,
        secondary_description: initialCaseStudyInput.secondary_description || null,
        order_index: initialCaseStudyInput.order_index
      })
      .returning()
      .execute();

    const caseStudyId = initialResult[0].id;

    // Update case study
    const updateInput: UpdateCaseStudyInput = {
      id: caseStudyId,
      main_title: 'Updated Main Title',
      primary_subtitle: 'Updated Primary Subtitle',
      primary_description: 'Updated primary description',
      secondary_subtitle: 'Updated Secondary Subtitle',
      secondary_description: 'Updated secondary description',
      order_index: 2
    };

    const result = await updateCaseStudy(updateInput);

    // Verify updated fields
    expect(result.id).toEqual(caseStudyId);
    expect(result.main_title).toEqual('Updated Main Title');
    expect(result.primary_subtitle).toEqual('Updated Primary Subtitle');
    expect(result.primary_description).toEqual('Updated primary description');
    expect(result.secondary_subtitle).toEqual('Updated Secondary Subtitle');
    expect(result.secondary_description).toEqual('Updated secondary description');
    expect(result.order_index).toEqual(2);
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > result.created_at).toBe(true);
  });

  it('should update only specified fields', async () => {
    // Create initial case study
    const initialResult = await db.insert(caseStudiesTable)
      .values({
        main_title: initialCaseStudyInput.main_title,
        primary_subtitle: initialCaseStudyInput.primary_subtitle,
        primary_description: initialCaseStudyInput.primary_description,
        secondary_subtitle: initialCaseStudyInput.secondary_subtitle || null,
        secondary_description: initialCaseStudyInput.secondary_description || null,
        order_index: initialCaseStudyInput.order_index
      })
      .returning()
      .execute();

    const caseStudyId = initialResult[0].id;

    // Update only main_title and order_index
    const updateInput: UpdateCaseStudyInput = {
      id: caseStudyId,
      main_title: 'Only Main Title Updated',
      order_index: 5
    };

    const result = await updateCaseStudy(updateInput);

    // Verify only specified fields were updated
    expect(result.main_title).toEqual('Only Main Title Updated');
    expect(result.order_index).toEqual(5);
    // Other fields should remain unchanged
    expect(result.primary_subtitle).toEqual('Initial Primary Subtitle');
    expect(result.primary_description).toEqual('Initial primary description');
    expect(result.secondary_subtitle).toEqual('Initial Secondary Subtitle');
    expect(result.secondary_description).toEqual('Initial secondary description');
  });

  it('should handle nullable fields correctly', async () => {
    // Create initial case study with nullable fields
    const initialResult = await db.insert(caseStudiesTable)
      .values({
        main_title: initialCaseStudyInput.main_title,
        primary_subtitle: initialCaseStudyInput.primary_subtitle,
        primary_description: initialCaseStudyInput.primary_description,
        secondary_subtitle: 'Has value initially',
        secondary_description: 'Has value initially',
        order_index: initialCaseStudyInput.order_index
      })
      .returning()
      .execute();

    const caseStudyId = initialResult[0].id;

    // Update nullable fields to null
    const updateInput: UpdateCaseStudyInput = {
      id: caseStudyId,
      secondary_subtitle: null,
      secondary_description: null
    };

    const result = await updateCaseStudy(updateInput);

    // Verify nullable fields were set to null
    expect(result.secondary_subtitle).toBeNull();
    expect(result.secondary_description).toBeNull();
    // Other fields should remain unchanged
    expect(result.main_title).toEqual('Initial Main Title');
    expect(result.primary_subtitle).toEqual('Initial Primary Subtitle');
  });

  it('should save updates to database', async () => {
    // Create initial case study
    const initialResult = await db.insert(caseStudiesTable)
      .values({
        main_title: initialCaseStudyInput.main_title,
        primary_subtitle: initialCaseStudyInput.primary_subtitle,
        primary_description: initialCaseStudyInput.primary_description,
        secondary_subtitle: initialCaseStudyInput.secondary_subtitle || null,
        secondary_description: initialCaseStudyInput.secondary_description || null,
        order_index: initialCaseStudyInput.order_index
      })
      .returning()
      .execute();

    const caseStudyId = initialResult[0].id;

    // Update case study
    const updateInput: UpdateCaseStudyInput = {
      id: caseStudyId,
      main_title: 'Persisted Update'
    };

    await updateCaseStudy(updateInput);

    // Query database to verify persistence
    const caseStudies = await db.select()
      .from(caseStudiesTable)
      .where(eq(caseStudiesTable.id, caseStudyId))
      .execute();

    expect(caseStudies).toHaveLength(1);
    expect(caseStudies[0].main_title).toEqual('Persisted Update');
    expect(caseStudies[0].updated_at).toBeInstanceOf(Date);
  });

  it('should throw error for non-existent case study', async () => {
    const updateInput: UpdateCaseStudyInput = {
      id: 99999,
      main_title: 'Should fail'
    };

    await expect(updateCaseStudy(updateInput)).rejects.toThrow(/not found/i);
  });
});
