ALTER TABLE "Booking"
  ALTER COLUMN "endAt" SET NOT NULL;

ALTER TABLE "Booking"
  ADD CONSTRAINT "Booking_endAt_after_startAt_check"
  CHECK ("endAt" > "startAt");

ALTER TABLE "Booking"
  ADD CONSTRAINT "Booking_startAt_minute_precision_check"
  CHECK (date_part('second', "startAt") = 0);

ALTER TABLE "Booking"
  ADD CONSTRAINT "Booking_endAt_minute_precision_check"
  CHECK (date_part('second', "endAt") = 0);

CREATE UNIQUE INDEX "Booking_roomId_startAt_key"
  ON "Booking"("roomId", "startAt");
