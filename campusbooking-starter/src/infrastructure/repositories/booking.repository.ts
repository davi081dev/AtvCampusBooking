import type { Room, Building, Booking, User } from '@prisma/client';
import type { RoomFilters, RoomWithBookings, BookingData } from '../../shared/types.js';
import { prisma } from '../prisma/index.js';
import { AppError } from '../../shared/errors/AppError.js';

export class BookingRepository {
  async findById(id: number): Promise<Booking | null> {
    // TODO: implementar operação de persistência.
    throw new AppError(501, 'NOT_IMPLEMENTED', 'Operação ainda não implementada.');
  }

  async findUser(id: number): Promise<User | null> {
    // TODO: implementar operação de persistência.
    throw new AppError(501, 'NOT_IMPLEMENTED', 'Operação ainda não implementada.');
  }

  async findRoomConflict(
    roomId: number,
    startAt: Date,
    endAt: Date,
    excludeId?: number
  ): Promise<Booking | null> {
    // TODO: implementar operação de persistência.
    throw new AppError(501, 'NOT_IMPLEMENTED', 'Operação ainda não implementada.');
  }

  async findUserConflict(
    userId: number,
    startAt: Date,
    endAt: Date,
    excludeId?: number
  ): Promise<Booking | null> {
    // TODO: implementar operação de persistência.
    throw new AppError(501, 'NOT_IMPLEMENTED', 'Operação ainda não implementada.');
  }

  async create(data: BookingData): Promise<Booking> {
    // TODO: implementar operação de persistência.
    throw new AppError(501, 'NOT_IMPLEMENTED', 'Operação ainda não implementada.');
  }

  async update(id: number, data: Omit<BookingData, "userId">): Promise<Booking> {
    // TODO: implementar operação de persistência.
    throw new AppError(501, 'NOT_IMPLEMENTED', 'Operação ainda não implementada.');
  }

  async delete(id: number): Promise<void> {
    // TODO: implementar operação de persistência.
    throw new AppError(501, 'NOT_IMPLEMENTED', 'Operação ainda não implementada.');
  }
}
