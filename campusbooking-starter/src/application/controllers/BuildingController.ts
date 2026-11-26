import type { Request, Response } from 'express';
import { BuildingService } from '../../infrastructure/services/building.service.js';

export class BuildingController {
  private service = new BuildingService();

  usage = async (req: Request, res: Response): Promise<void> => {
    // TODO: validar entrada, chamar o service e devolver a resposta HTTP.
    res.status(501).json({
      error: 'NOT_IMPLEMENTED',
      message: 'Endpoint ainda não implementado.'
    });
  };
}
