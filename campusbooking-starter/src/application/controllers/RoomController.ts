import type { Request, Response } from 'express';
import { RoomService } from '../../infrastructure/services/room.service.js';
import { roomFiltersSchema } from '../validators/room.schemas.js';

export class RoomController {
  private service = new RoomService();

  list = async (req: Request, res: Response): Promise<void> => {
    const filters = roomFiltersSchema.parse(req.query);
    res.status(200).json(await this.service.list(filters));
  };
}
