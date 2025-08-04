
import { db } from '../db';
import { caseStudiesTable } from '../db/schema';
import { type UpdateCaseStudyInput, type CaseStudy } from '../schema';
import { eq } from 'drizzle-orm';

export const updateCaseStudy = async (input: UpdateCaseStudyInput): Promise<CaseStudy> => {
  try {
    // Build update object with only provided fields
    const updateData: any = {
      updated_at: new Date()
    };

    if (input.main_title !== undefined) {
      updateData.main_title = input.main_title;
    }
    if (input.primary_subtitle !== undefined) {
      updateData.primary_subtitle = input.primary_subtitle;
    }
    if (input.primary_description !== undefined) {
      updateData.primary_description = input.primary_description;
    }
    if (input.secondary_subtitle !== undefined) {
      updateData.secondary_subtitle = input.secondary_subtitle;
    }
    if (input.secondary_description !== undefined) {
      updateData.secondary_description = input.secondary_description;
    }
    if (input.order_index !== undefined) {
      updateData.order_index = input.order_index;
    }

    // Update case study record
    const result = await db.update(caseStudiesTable)
      .set(updateData)
      .where(eq(caseStudiesTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Case study with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Case study update failed:', error);
    throw error;
  }
};
