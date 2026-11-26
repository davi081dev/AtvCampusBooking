import type { Room } from '@prisma/client';
import type { RoomFilters } from '../../shared/types.js';
import { prisma } from '../prisma/index.js';

export class RoomRepository {
  async list(filters: RoomFilters): Promise<Room[]> {
    return prisma.room.findMany({
      where: {
        ...(filters.buildingId === undefined ? {} : { buildingId: filters.buildingId }),
        ...(filters.type === undefined ? {} : { type: filters.type }),
        ...(filters.minCapacity === undefined ? {} : { capacity: { gte: filters.minCapacity } }),
        ...(filters.active === undefined ? {} : { active: filters.active }),
        ...(filters.name === undefined ? {} : { name: { contains: filters.name, mode: 'insensitive' } })
      },
      orderBy: [{ name: 'asc' }, { id: 'asc' }]
    });
  }

  async findById(id: number): Promise<Room | null> {
    return prisma.room.findUnique({ where: { id } });
  }
}
