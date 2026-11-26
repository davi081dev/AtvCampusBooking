import type { RoomType, Prisma } from '@prisma/client';

export type RoomFilters = {
  buildingId?: number;
  type?: RoomType;
  minCapacity?: number;
  active?: boolean;
  name?: string;
};

export type CreateBooking = {
  userId: number;
  roomId: number;
  startAt: string;
  endAt: string;
  purpose: string;
};

export type UpdateBooking = Partial<Omit<CreateBooking, 'userId'>>;
export type BookingData = Omit<CreateBooking, 'startAt' | 'endAt'> & {
  startAt: Date;
  endAt: Date;
};

export type RoomWithBookings = Prisma.RoomGetPayload<{
  include: {
    bookings: true;
  };
}>;

export type Usage = {
  buildingId: number;
  buildingName: string;
  date: string;
  totalRooms: number;
  totalBookings: number;
  totalAvailableMinutes: number;
  totalBookedMinutes: number;
  overallUsagePercentage: number;
  rooms: {
    roomId: number;
    name: string;
    bookings: number;
    bookedMinutes: number;
    availableMinutes: number;
    usagePercentage: number;
  }[];
};
