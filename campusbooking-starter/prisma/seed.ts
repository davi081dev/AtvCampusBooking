import 'dotenv/config';
import { PrismaClient, RoomType, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

// Calendário local de Recife (UTC-03), sem depender do fuso da máquina.
const day = (offset: number) => {
  const local = new Date(Date.now() - 3 * 3600000);
  local.setUTCDate(local.getUTCDate() + offset);
  return local.toISOString().slice(0, 10);
};

const at = (offset: number, hour: number, minute = 0): Date => {
  const date = day(offset);
  const hours = String(hour).padStart(2, '0');
  const minutes = String(minute).padStart(2, '0');

  return new Date(`${date}T${hours}:${minutes}:00-03:00`);
};

async function main() {
  // Exclusivo para banco local de treinamento. Apaga dados anteriores.
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "Booking", "Room", "User", "Building" ' +
      'RESTART IDENTITY CASCADE'
  );
  for (const [name, address] of [
    ['Campus Central', 'Rua A'],
    ['Campus Norte', 'Rua B'],
    ['Anexo', 'Rua C']
  ]) {
    await prisma.building.create({
      data: {
        name,
        address
      }
    });
  }

  const rooms: [string, RoomType, number, boolean, number][] = [
    ['Laboratório 01', 'LAB', 30, true, 1],
    ['Sala de Estudos 02', 'STUDY_ROOM', 8, true, 1],
    ['Sala de Reunião 03', 'MEETING_ROOM', 12, true, 1],
    ['Laboratório 04', 'LAB', 25, false, 1],
    ['Laboratório 05', 'LAB', 20, true, 2],
    ['Sala de Estudos 06', 'STUDY_ROOM', 10, true, 2],
    ['Sala de Reunião 07', 'MEETING_ROOM', 15, true, 2],
    ['Laboratório 08', 'LAB', 40, true, 2],
    ['Sala de Estudos 09', 'STUDY_ROOM', 6, false, 3],
    ['Sala de Reunião 10', 'MEETING_ROOM', 10, false, 3],
    ['Laboratório 11', 'LAB', 20, false, 3],
    ['Sala de Estudos 12', 'STUDY_ROOM', 8, false, 3]
  ];
  for (const [name, type, capacity, active, buildingId] of rooms) {
    await prisma.room.create({
      data: {
        name,
        type,
        capacity,
        active,
        buildingId
      }
    });
  }

  const names = [
    'Ana',
    'Bruno',
    'Carla',
    'Diego',
    'Elisa',
    'Felipe',
    'Gabriela',
    'Hugo',
    'Isabel',
    'João',
    'Karen',
    'Lucas',
    'Marina',
    'Nina',
    'Otávio'
  ];
  for (let i = 0; i < names.length; i++) {
    await prisma.user.create({
      data: {
        name: names[i],
        email: `user${i + 1}@example.test`,
        role: (i < 12 ? 'STUDENT' : 'TEACHER') as UserRole
      }
    });
  }

  const fixtures: [number, number, number, number, number][] = [
    [1, 1, 1, 9, 11],
    [2, 1, 1, 11, 12],
    [3, 1, 1, 14, 15],
    [4, 2, 1, 9, 10],
    [5, 2, 1, 10, 11],
    [6, 1, -1, 9, 10],
    [7, 2, -1, 10, 12],
    [8, 3, -1, 13, 14],
    [9, 5, 1, 9, 11],
    [10, 5, 1, 11, 12],
    [11, 6, 1, 13, 14],
    [12, 7, 1, 14, 16],
    [13, 8, 1, 16, 18],
    [14, 5, 2, 9, 10],
    [15, 6, 2, 10, 11],
    [1, 2, 2, 9, 10],
    [2, 3, 2, 10, 11],
    [3, 5, 2, 11, 12],
    [4, 6, 2, 13, 14],
    [5, 7, 2, 14, 15],
    [6, 8, 2, 15, 16],
    [7, 1, 3, 8, 9],
    [8, 2, 3, 9, 10],
    [9, 3, 3, 10, 11],
    [10, 5, 3, 11, 12],
    [11, 6, 3, 13, 14],
    [12, 7, 3, 14, 15],
    [13, 8, 3, 15, 16],
    [14, 1, 4, 16, 17],
    [15, 2, 4, 17, 18]
  ];
  for (const [userId, roomId, d, a, b] of fixtures) {
    await prisma.booking.create({
      data: {
        userId,
        roomId,
        startAt: at(d, a),
        endAt: at(d, b),
        purpose: 'Atividade acadêmica'
      }
    });
  }

  console.log(
    `Seed complete. Dia principal: ${day(1)}. ` +
      'Reserva #1: usuário 1, sala 1, 09h–11h. Sala 4 inativa.'
  );
}

main()
  .catch(e => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
