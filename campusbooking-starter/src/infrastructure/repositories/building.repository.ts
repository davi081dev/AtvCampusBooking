import type { Room, Building, Booking, User } from '@prisma/client';
import type { RoomFilters, RoomWithBookings, BookingData } from '../../shared/types.js';
import { prisma } from '../prisma/index.js';
import { AppError } from '../../shared/errors/AppError.js';

export class BuildingRepository {
  async findById(id: number): Promise<Building | null> {
    // TODO: implementar operação de persistência.
    throw new AppError(501, 'NOT_IMPLEMENTED', 'Operação ainda não implementada.');
  }

  async roomsWithBookings(
    buildingId: number,
    from: Date,
    to: Date
  ): Promise<RoomWithBookings[]> {
    // TODO: implementar operação de persistência.
    throw new AppError(501, 'NOT_IMPLEMENTED', 'Operação ainda não implementada.');
  }
}
