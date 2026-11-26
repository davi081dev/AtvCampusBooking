import type { Usage } from '../../shared/types.js';
import { BuildingRepository } from '../repositories/building.repository.js';
import { AppError } from '../../shared/errors/AppError.js';

const RECIFE_OFFSET_MS = 3 * 60 * 60 * 1000;
const MINUTES_PER_ROOM_DAY = 14 * 60;

const roundPercentage = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100;

export class BuildingService {
  private repo = new BuildingRepository();

  async usage(buildingId: number, date: string): Promise<Usage> {
    const building = await this.repo.findById(buildingId);
    if (!building) throw new AppError(404, 'BUILDING_NOT_FOUND', 'Prédio não encontrado.');

    const from = new Date(`${date}T00:00:00-03:00`);
    const to = new Date(from.getTime() + 24 * 60 * 60 * 1000);
    const rooms = await this.repo.roomsWithBookings(buildingId, from, to);
    const result = rooms.map(room => {
      const bookedMinutes = room.bookings.reduce((total, booking) => {
        const start = Math.max(booking.startAt.getTime(), from.getTime());
        const end = Math.min(booking.endAt.getTime(), to.getTime());
        return total + Math.max(0, (end - start) / 60000);
      }, 0);
      const availableMinutes = MINUTES_PER_ROOM_DAY - bookedMinutes;
      return {
        roomId: room.id,
        name: room.name,
        bookings: room.bookings.length,
        bookedMinutes,
        availableMinutes,
        usagePercentage: roundPercentage((bookedMinutes / MINUTES_PER_ROOM_DAY) * 100)
      };
    }).sort((a, b) => b.usagePercentage - a.usagePercentage || a.roomId - b.roomId);

    const totalAvailableMinutes = rooms.length * MINUTES_PER_ROOM_DAY;
    const totalBookedMinutes = result.reduce((sum, room) => sum + room.bookedMinutes, 0);
    return {
      buildingId: building.id,
      buildingName: building.name,
      date,
      totalRooms: rooms.length,
      totalBookings: result.reduce((sum, room) => sum + room.bookings, 0),
      totalAvailableMinutes,
      totalBookedMinutes,
      overallUsagePercentage: totalAvailableMinutes === 0
        ? 0
        : roundPercentage((totalBookedMinutes / totalAvailableMinutes) * 100),
      rooms: result
    };
  }
}
