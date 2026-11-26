import { Prisma, type Booking } from '@prisma/client';
import type { CreateBooking, UpdateBooking } from '../../shared/types.js';
import { BookingRepository } from '../repositories/booking.repository.js';
import { RoomRepository } from '../repositories/room.repository.js';
import { AppError } from '../../shared/errors/AppError.js';

const RECIFE_OFFSET_MS = 3 * 60 * 60 * 1000;
const MAX_DURATION_MS = 2 * 60 * 60 * 1000;

const validateInterval = (startAt: Date, endAt: Date): void => {
  const localStart = new Date(startAt.getTime() - RECIFE_OFFSET_MS);
  const localEnd = new Date(endAt.getTime() - RECIFE_OFFSET_MS);
  const sameLocalDay =
    localStart.getUTCFullYear() === localEnd.getUTCFullYear() &&
    localStart.getUTCMonth() === localEnd.getUTCMonth() &&
    localStart.getUTCDate() === localEnd.getUTCDate();

  if (
    endAt.getTime() <= startAt.getTime() ||
    endAt.getTime() - startAt.getTime() > MAX_DURATION_MS ||
    !sameLocalDay ||
    localStart.getUTCHours() < 8 ||
    localEnd.getUTCHours() > 22 ||
    (localEnd.getUTCHours() === 22 && localEnd.getUTCMinutes() > 0)
  ) {
    throw new AppError(400, 'INVALID_INTERVAL', 'Intervalo fora das regras de horário.');
  }
};

const ensureNoUniqueStartConflict = (error: unknown): never => {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    throw new AppError(409, 'BOOKING_CONFLICT', 'Já existe uma reserva com esse início para a sala.');
  }
  throw error;
};

export class BookingService {
  private repo = new BookingRepository();
  private rooms = new RoomRepository();

  async create(data: CreateBooking): Promise<Booking> {
    const user = await this.repo.findUser(data.userId);
    if (!user) throw new AppError(404, 'USER_NOT_FOUND', 'Usuário não encontrado.');

    const room = await this.rooms.findById(data.roomId);
    if (!room) throw new AppError(404, 'ROOM_NOT_FOUND', 'Sala não encontrada.');
    if (!room.active) throw new AppError(409, 'ROOM_INACTIVE', 'A sala está inativa.');

    const startAt = new Date(data.startAt);
    const endAt = new Date(data.endAt);
    validateInterval(startAt, endAt);
    if (startAt.getTime() <= Date.now()) {
      throw new AppError(409, 'BOOKING_ALREADY_STARTED', 'A reserva não pode começar no passado.');
    }

    if (await this.repo.findRoomConflict(data.roomId, startAt, endAt)) {
      throw new AppError(409, 'ROOM_BOOKING_CONFLICT', 'A sala já possui reserva nesse intervalo.');
    }
    if (await this.repo.findUserConflict(data.userId, startAt, endAt)) {
      throw new AppError(409, 'USER_BOOKING_CONFLICT', 'O usuário já possui reserva nesse intervalo.');
    }

    try {
      return await this.repo.create({ ...data, startAt, endAt });
    } catch (error) {
      return ensureNoUniqueStartConflict(error);
    }
  }

  async update(id: number, data: UpdateBooking): Promise<Booking> {
    const booking = await this.repo.findById(id);
    if (!booking) throw new AppError(404, 'BOOKING_NOT_FOUND', 'Reserva não encontrada.');
    if (booking.startAt.getTime() <= Date.now()) {
      throw new AppError(409, 'BOOKING_ALREADY_STARTED', 'A reserva já começou.');
    }

    const roomId = data.roomId ?? booking.roomId;
    const startAt = data.startAt === undefined ? booking.startAt : new Date(data.startAt);
    const endAt = data.endAt === undefined ? booking.endAt : new Date(data.endAt);
    const purpose = data.purpose ?? booking.purpose;
    validateInterval(startAt, endAt);
    if (startAt.getTime() <= Date.now()) {
      throw new AppError(409, 'BOOKING_ALREADY_STARTED', 'A reserva não pode começar no passado.');
    }

    const room = await this.rooms.findById(roomId);
    if (!room) throw new AppError(404, 'ROOM_NOT_FOUND', 'Sala não encontrada.');
    if (!room.active) throw new AppError(409, 'ROOM_INACTIVE', 'A sala está inativa.');

    if (await this.repo.findRoomConflict(roomId, startAt, endAt, id)) {
      throw new AppError(409, 'ROOM_BOOKING_CONFLICT', 'A sala já possui reserva nesse intervalo.');
    }
    if (await this.repo.findUserConflict(booking.userId, startAt, endAt, id)) {
      throw new AppError(409, 'USER_BOOKING_CONFLICT', 'O usuário já possui reserva nesse intervalo.');
    }

    try {
      return await this.repo.update(id, { roomId, startAt, endAt, purpose });
    } catch (error) {
      return ensureNoUniqueStartConflict(error);
    }
  }

  async delete(id: number): Promise<void> {
    const booking = await this.repo.findById(id);
    if (!booking) throw new AppError(404, 'BOOKING_NOT_FOUND', 'Reserva não encontrada.');
    if (booking.startAt.getTime() <= Date.now()) {
      throw new AppError(409, 'BOOKING_ALREADY_STARTED', 'A reserva já começou.');
    }
    await this.repo.delete(id);
  }
}
