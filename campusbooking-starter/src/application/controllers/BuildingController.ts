import type { Request, Response } from 'express';
import { BuildingService } from '../../infrastructure/services/building.service.js';
import { dateSchema } from '../validators/room.schemas.js';
import { AppError } from '../../shared/errors/AppError.js';

const parseId = (value: string): number => {
  if (!/^\d+$/.test(value)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'ID deve ser um inteiro positivo.');
  }
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
    throw new AppError(400, 'VALIDATION_ERROR', 'ID inválido.');
  }
  return id;
};

export class BuildingController {
  private service = new BuildingService();

  usage = async (req: Request, res: Response): Promise<void> => {
    const buildingId = parseId(req.params.buildingId);
    const date = dateSchema.parse(req.query.date);
    res.status(200).json(await this.service.usage(buildingId, date));
  };
}
