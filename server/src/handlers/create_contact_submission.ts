
import { db } from '../db';
import { contactSubmissionsTable } from '../db/schema';
import { type CreateContactSubmissionInput, type ContactSubmission } from '../schema';

export const createContactSubmission = async (input: CreateContactSubmissionInput): Promise<ContactSubmission> => {
  try {
    // Insert contact submission record
    const result = await db.insert(contactSubmissionsTable)
      .values({
        first_name: input.first_name,
        last_name: input.last_name,
        email: input.email,
        phone: input.phone,
        message: input.message
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Contact submission creation failed:', error);
    throw error;
  }
};
