CREATE TYPE "RoomType" AS ENUM ('STUDY_ROOM', 'LAB', 'MEETING_ROOM');

CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'TEACHER');

CREATE TABLE "Building" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  CONSTRAINT "Building_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Room" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,
  "type" "RoomType" NOT NULL,
  "capacity" INTEGER NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "buildingId" INTEGER NOT NULL,
  CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "User" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "role" "UserRole" NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Booking" (
  "id" SERIAL NOT NULL,
  "userId" INTEGER NOT NULL,
  "roomId" INTEGER NOT NULL,
  "startAt" TIMESTAMP(3) NOT NULL,
  "endAt" TIMESTAMP(3),
  "purpose" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE INDEX "Room_buildingId_idx" ON "Room"("buildingId");

CREATE INDEX "Booking_userId_startAt_idx" ON "Booking"("userId", "startAt");

ALTER TABLE "Room"
  ADD CONSTRAINT "Room_buildingId_fkey"
  FOREIGN KEY ("buildingId")
  REFERENCES "Building"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Booking"
  ADD CONSTRAINT "Booking_userId_fkey"
  FOREIGN KEY ("userId")
  REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Booking"
  ADD CONSTRAINT "Booking_roomId_fkey"
  FOREIGN KEY ("roomId")
  REFERENCES "Room"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
