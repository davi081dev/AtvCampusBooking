import type { Usage } from '../../shared/types.js';
import { BuildingRepository } from '../repositories/building.repository.js';
import { AppError } from '../../shared/errors/AppError.js';

export class BuildingService {
  private repo = new BuildingRepository();

  async usage(buildingId: number, date: string): Promise<Usage> {
    // TODO: implementar a funcionalidade e as regras de negócio aplicáveis.
    throw new AppError(
      501,
      'NOT_IMPLEMENTED',
      'Funcionalidade ainda não implementada.'
    );
  }
}
