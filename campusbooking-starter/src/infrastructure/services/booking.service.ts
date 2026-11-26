import type { Booking } from '@prisma/client';
import type { CreateBooking, UpdateBooking } from '../../shared/types.js';
import { BookingRepository } from '../repositories/booking.repository.js';
import { RoomRepository } from '../repositories/room.repository.js';
import { AppError } from '../../shared/errors/AppError.js';

export class BookingService {
  private repo = new BookingRepository();

  async create(data: CreateBooking): Promise<Booking> {
    // TODO: implementar a funcionalidade e as regras de negócio aplicáveis.
    throw new AppError(
      501,
      'NOT_IMPLEMENTED',
      'Funcionalidade ainda não implementada.'
    );
  }

  async update(id: number, data: UpdateBooking): Promise<Booking> {
    // TODO: implementar a funcionalidade e as regras de negócio aplicáveis.
    throw new AppError(
      501,
      'NOT_IMPLEMENTED',
      'Funcionalidade ainda não implementada.'
    );
  }

  async delete(id: number): Promise<void> {
    // TODO: implementar a funcionalidade e as regras de negócio aplicáveis.
    throw new AppError(
      501,
      'NOT_IMPLEMENTED',
      'Funcionalidade ainda não implementada.'
    );
  }
}
