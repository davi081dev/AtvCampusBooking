import type { Room } from '@prisma/client';
import type { RoomFilters } from '../../shared/types.js';
import { RoomRepository } from '../repositories/room.repository.js';
import { AppError } from '../../shared/errors/AppError.js';

export class RoomService {
  private repo = new RoomRepository();

  async list(filters: RoomFilters): Promise<Room[]> {
    // TODO: implementar a funcionalidade e as regras de negócio aplicáveis.
    throw new AppError(
      501,
      'NOT_IMPLEMENTED',
      'Funcionalidade ainda não implementada.'
    );
  }
}
