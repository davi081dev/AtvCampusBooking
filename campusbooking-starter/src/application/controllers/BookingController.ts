import type { Request, Response } from 'express';
import { BookingService } from '../../infrastructure/services/booking.service.js';
import { createBookingSchema, updateBookingSchema } from '../validators/booking.schemas.js';
import { AppError } from '../../shared/errors/AppError.js';

const parseId = (value: string): number => {
  if (!/^\d+$/.test(value)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'ID deve ser um inteiro positivo.');
  }
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
    throw new AppError(400, 'VALIDATION_ERROR', 'ID inválido.');
  }
  return id;
};

export class BookingController {
  private service = new BookingService();

  create = async (req: Request, res: Response): Promise<void> => {
    const data = createBookingSchema.parse(req.body);
    res.status(201).json(await this.service.create(data));
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const id = parseId(req.params.id);
    const data = updateBookingSchema.parse(req.body);
    res.status(200).json(await this.service.update(id, data));
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const id = parseId(req.params.id);
    await this.service.delete(id);
    res.status(204).end();
  };
}
