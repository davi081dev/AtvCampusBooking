import type { Building } from '@prisma/client';
import type { RoomWithBookings } from '../../shared/types.js';
import { prisma } from '../prisma/index.js';

export class BuildingRepository {
  async findById(id: number): Promise<Building | null> {
    return prisma.building.findUnique({ where: { id } });
  }

  async roomsWithBookings(
    buildingId: number,
    from: Date,
    to: Date
  ): Promise<RoomWithBookings[]> {
    return prisma.room.findMany({
      where: { buildingId, active: true },
      include: {
        bookings: {
          where: { startAt: { lt: to }, endAt: { gt: from } }
        }
      }
    });
  }
}
