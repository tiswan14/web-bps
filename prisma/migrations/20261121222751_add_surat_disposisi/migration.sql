-- CreateEnum
CREATE TYPE "JenisSurat" AS ENUM ('MASUK', 'KELUAR');

-- CreateEnum
CREATE TYPE "SifatSurat" AS ENUM ('BIASA', 'PENTING');

-- CreateTable
CREATE TABLE "Surat" (
    "id" TEXT NOT NULL,
    "jenis" "JenisSurat" NOT NULL,
    "nomor" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "asalTujuan" TEXT NOT NULL,
    "perihal" TEXT NOT NULL,
    "sifat" "SifatSurat" NOT NULL DEFAULT 'BIASA',
    "pengantaran" TEXT,
    "status" TEXT,
    "dicatatOleh" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Surat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disposisi" (
    "id" TEXT NOT NULL,
    "suratId" TEXT NOT NULL,
    "kepadaPegawaiId" TEXT NOT NULL,
    "dicatatOleh" TEXT NOT NULL,
    "instruksi" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Disposisi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Surat_tanggal_idx" ON "Surat"("tanggal");

-- CreateIndex
CREATE INDEX "Surat_nomor_idx" ON "Surat"("nomor");

-- CreateIndex
CREATE INDEX "Disposisi_suratId_idx" ON "Disposisi"("suratId");

-- CreateIndex
CREATE INDEX "Disposisi_kepadaPegawaiId_idx" ON "Disposisi"("kepadaPegawaiId");

-- AddForeignKey
ALTER TABLE "Surat" ADD CONSTRAINT "Surat_dicatatOleh_fkey" FOREIGN KEY ("dicatatOleh") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disposisi" ADD CONSTRAINT "Disposisi_suratId_fkey" FOREIGN KEY ("suratId") REFERENCES "Surat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disposisi" ADD CONSTRAINT "Disposisi_kepadaPegawaiId_fkey" FOREIGN KEY ("kepadaPegawaiId") REFERENCES "Pegawai"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disposisi" ADD CONSTRAINT "Disposisi_dicatatOleh_fkey" FOREIGN KEY ("dicatatOleh") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
