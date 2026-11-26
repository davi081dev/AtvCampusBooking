import { z } from 'zod';

const isoDateTimeWithOffset = z.string().refine(value => {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?(Z|[+-]\d{2}:\d{2})$/i.exec(value);
  if (!match || Number.isNaN(Date.parse(value))) return false;

  const [, year, month, day, hour, minute, seconds = '00', fraction = '', offset] = match;
  const calendarDate = new Date(0);
  calendarDate.setUTCFullYear(Number(year), Number(month) - 1, Number(day));
  if (
    calendarDate.getUTCFullYear() !== Number(year) ||
    calendarDate.getUTCMonth() !== Number(month) - 1 ||
    calendarDate.getUTCDate() !== Number(day) ||
    Number(hour) > 23 ||
    Number(minute) > 59 ||
    Number(seconds) > 59 ||
    seconds !== '00' ||
    /[1-9]/.test(fraction)
  ) return false;

  if (offset.toUpperCase() !== 'Z') {
    const [, offsetHour, offsetMinute] = /[+-](\d{2}):(\d{2})/.exec(offset) ?? [];
    if (Number(offsetHour) > 23 || Number(offsetMinute) > 59) return false;
  }
  return true;
}, 'Informe data/hora ISO 8601 válida, com offset explícito e precisão de minutos.');

const purposeSchema = z.string().trim().min(1).max(200);

export const createBookingSchema = z.object({
  userId: z.number().int().positive().max(2147483647),
  roomId: z.number().int().positive().max(2147483647),
  startAt: isoDateTimeWithOffset,
  endAt: isoDateTimeWithOffset,
  purpose: purposeSchema
}).strict();

export const updateBookingSchema = z.object({
  roomId: z.number().int().positive().max(2147483647).optional(),
  startAt: isoDateTimeWithOffset.optional(),
  endAt: isoDateTimeWithOffset.optional(),
  purpose: purposeSchema.optional()
}).strict().refine(data => Object.keys(data).length > 0, {
  message: 'Informe ao menos um campo para atualização.'
});
