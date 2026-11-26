import type { Booking, User } from '@prisma/client';
import type { BookingData, BookingUpdateData } from '../../shared/types.js';
import { prisma } from '../prisma/index.js';

export class BookingRepository {
  async findById(id: number): Promise<Booking | null> {
    return prisma.booking.findUnique({ where: { id } });
  }

  async findUser(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findRoomConflict(
    roomId: number,
    startAt: Date,
    endAt: Date,
    excludeId?: number
  ): Promise<Booking | null> {
    return prisma.booking.findFirst({
      where: {
        roomId,
        startAt: { lt: endAt },
        endAt: { gt: startAt },
        ...(excludeId === undefined ? {} : { id: { not: excludeId } })
      }
    });
  }

  async findUserConflict(
    userId: number,
    startAt: Date,
    endAt: Date,
    excludeId?: number
  ): Promise<Booking | null> {
    return prisma.booking.findFirst({
      where: {
        userId,
        startAt: { lt: endAt },
        endAt: { gt: startAt },
        ...(excludeId === undefined ? {} : { id: { not: excludeId } })
      }
    });
  }

  async create(data: BookingData): Promise<Booking> {
    return prisma.booking.create({ data });
  }

  async update(id: number, data: BookingUpdateData): Promise<Booking> {
    return prisma.booking.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await prisma.booking.delete({ where: { id } });
  }
}
