
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { caseStudiesTable } from '../db/schema';
import { getCaseStudies } from '../handlers/get_case_studies';

describe('getCaseStudies', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no case studies exist', async () => {
    const result = await getCaseStudies();
    expect(result).toEqual([]);
  });

  it('should return all case studies ordered by order_index', async () => {
    // Create test case studies with different order indices
    await db.insert(caseStudiesTable).values([
      {
        main_title: 'Third Case Study',
        primary_subtitle: 'Subtitle 3',
        primary_description: 'Description 3',
        secondary_subtitle: 'Secondary 3',
        secondary_description: 'Secondary description 3',
        order_index: 2
      },
      {
        main_title: 'First Case Study',
        primary_subtitle: 'Subtitle 1',
        primary_description: 'Description 1',
        secondary_subtitle: null,
        secondary_description: null,
        order_index: 0
      },
      {
        main_title: 'Second Case Study',
        primary_subtitle: 'Subtitle 2',
        primary_description: 'Description 2',
        secondary_subtitle: 'Secondary 2',
        secondary_description: 'Secondary description 2',
        order_index: 1
      }
    ]).execute();

    const result = await getCaseStudies();

    expect(result).toHaveLength(3);
    
    // Verify ordering by order_index
    expect(result[0].main_title).toBe('First Case Study');
    expect(result[0].order_index).toBe(0);
    expect(result[1].main_title).toBe('Second Case Study');
    expect(result[1].order_index).toBe(1);
    expect(result[2].main_title).toBe('Third Case Study');
    expect(result[2].order_index).toBe(2);

    // Verify all fields are present
    expect(result[0].id).toBeDefined();
    expect(result[0].primary_subtitle).toBe('Subtitle 1');
    expect(result[0].primary_description).toBe('Description 1');
    expect(result[0].secondary_subtitle).toBeNull();
    expect(result[0].secondary_description).toBeNull();
    expect(result[0].created_at).toBeInstanceOf(Date);
    expect(result[0].updated_at).toBeInstanceOf(Date);

    // Verify nullable fields work correctly
    expect(result[1].secondary_subtitle).toBe('Secondary 2');
    expect(result[1].secondary_description).toBe('Secondary description 2');
  });

  it('should handle case studies with same order_index', async () => {
    // Create case studies with same order_index
    await db.insert(caseStudiesTable).values([
      {
        main_title: 'Case Study A',
        primary_subtitle: 'Subtitle A',
        primary_description: 'Description A',
        order_index: 1
      },
      {
        main_title: 'Case Study B',
        primary_subtitle: 'Subtitle B',
        primary_description: 'Description B',
        order_index: 1
      }
    ]).execute();

    const result = await getCaseStudies();

    expect(result).toHaveLength(2);
    // Both should have same order_index
    expect(result[0].order_index).toBe(1);
    expect(result[1].order_index).toBe(1);
    // Should still return both records
    const titles = result.map(cs => cs.main_title).sort();
    expect(titles).toEqual(['Case Study A', 'Case Study B']);
  });
});
