import type { Room } from '@prisma/client';
import type { RoomFilters } from '../../shared/types.js';
import { RoomRepository } from '../repositories/room.repository.js';

export class RoomService {
  private repo = new RoomRepository();

  async list(filters: RoomFilters): Promise<Room[]> {
    return this.repo.list(filters);
  }
}
