import type { Request, Response } from 'express';
import { BookingService } from '../../infrastructure/services/booking.service.js';

export class BookingController {
  private service = new BookingService();

  create = async (req: Request, res: Response): Promise<void> => {
    // TODO: validar entrada, chamar o service e devolver a resposta HTTP.
    res.status(501).json({
      error: 'NOT_IMPLEMENTED',
      message: 'Endpoint ainda não implementado.'
    });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    // TODO: validar entrada, chamar o service e devolver a resposta HTTP.
    res.status(501).json({
      error: 'NOT_IMPLEMENTED',
      message: 'Endpoint ainda não implementado.'
    });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    // TODO: validar entrada, chamar o service e devolver a resposta HTTP.
    res.status(501).json({
      error: 'NOT_IMPLEMENTED',
      message: 'Endpoint ainda não implementado.'
    });
  };
}
