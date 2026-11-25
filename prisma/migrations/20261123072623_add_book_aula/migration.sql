-- CreateTable
CREATE TABLE "BookingAula" (
    "id" TEXT NOT NULL,
    "ruangId" TEXT NOT NULL,
    "namaRuang" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "jamMulai" TEXT NOT NULL,
    "jamSelesai" TEXT NOT NULL,
    "namaPeminjam" TEXT NOT NULL,
    "jumlahPeserta" INTEGER NOT NULL,
    "kegiatan" TEXT NOT NULL,
    "dicatatOleh" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingAula_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookingAula_tanggal_idx" ON "BookingAula"("tanggal");

-- CreateIndex
CREATE INDEX "BookingAula_ruangId_tanggal_idx" ON "BookingAula"("ruangId", "tanggal");

-- CreateIndex
CREATE INDEX "BookingAula_dicatatOleh_idx" ON "BookingAula"("dicatatOleh");

-- AddForeignKey
ALTER TABLE "BookingAula" ADD CONSTRAINT "BookingAula_dicatatOleh_fkey" FOREIGN KEY ("dicatatOleh") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
