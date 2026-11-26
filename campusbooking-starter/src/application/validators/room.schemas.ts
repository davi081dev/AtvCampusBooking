import { z } from 'zod';

const positiveIntegerQuery = z.string()
  .regex(/^\d+$/)
  .transform(Number)
  .refine(value => Number.isSafeInteger(value) && value > 0 && value <= 2147483647);

export const roomFiltersSchema = z.object({
  buildingId: positiveIntegerQuery.optional(),
  type: z.enum(['STUDY_ROOM', 'LAB', 'MEETING_ROOM']).optional(),
  minCapacity: positiveIntegerQuery.optional(),
  active: z.enum(['true', 'false']).transform(value => value === 'true').optional(),
  name: z.string().trim().min(1).optional()
});

export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}, 'Informe uma data real no formato YYYY-MM-DD.');
