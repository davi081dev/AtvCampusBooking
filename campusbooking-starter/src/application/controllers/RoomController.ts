import type { Request, Response } from 'express';
import { RoomService } from '../../infrastructure/services/room.service.js';

export class RoomController {
  private service = new RoomService();

  list = async (req: Request, res: Response): Promise<void> => {
    // TODO: validar entrada, chamar o service e devolver a resposta HTTP.
    res.status(501).json({
      error: 'NOT_IMPLEMENTED',
      message: 'Endpoint ainda não implementado.'
    });
  };
}
