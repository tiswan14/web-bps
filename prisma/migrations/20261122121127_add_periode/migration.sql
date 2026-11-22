/*
  Warnings:

  - You are about to drop the column `aktif` on the `PenugasanAnggaran` table. All the data in the column will be lost.
  - You are about to drop the column `tahunAnggaran` on the `PenugasanAnggaran` table. All the data in the column will be lost.
  - You are about to drop the column `tanggalMulai` on the `PenugasanAnggaran` table. All the data in the column will be lost.
  - You are about to drop the column `tanggalSelesai` on the `PenugasanAnggaran` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pegawaiId,jenis,periodeId]` on the table `PenugasanAnggaran` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `periodeId` to the `PenugasanAnggaran` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodeId` to the `Surat` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PenugasanAnggaran_pegawaiId_jenis_tahunAnggaran_key";

-- DropIndex
DROP INDEX "PenugasanAnggaran_tahunAnggaran_idx";

-- AlterTable
ALTER TABLE "PenugasanAnggaran" DROP COLUMN "aktif",
DROP COLUMN "tahunAnggaran",
DROP COLUMN "tanggalMulai",
DROP COLUMN "tanggalSelesai",
ADD COLUMN     "periodeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Surat" ADD COLUMN     "periodeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Periode" (
    "tahun" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Periode_pkey" PRIMARY KEY ("tahun")
);

-- CreateIndex
CREATE INDEX "Disposisi_dicatatOleh_idx" ON "Disposisi"("dicatatOleh");

-- CreateIndex
CREATE INDEX "PenugasanAnggaran_periodeId_idx" ON "PenugasanAnggaran"("periodeId");

-- CreateIndex
CREATE UNIQUE INDEX "PenugasanAnggaran_pegawaiId_jenis_periodeId_key" ON "PenugasanAnggaran"("pegawaiId", "jenis", "periodeId");

-- CreateIndex
CREATE INDEX "Surat_periodeId_idx" ON "Surat"("periodeId");

-- CreateIndex
CREATE INDEX "Surat_jenis_periodeId_idx" ON "Surat"("jenis", "periodeId");

-- AddForeignKey
ALTER TABLE "PenugasanAnggaran" ADD CONSTRAINT "PenugasanAnggaran_periodeId_fkey" FOREIGN KEY ("periodeId") REFERENCES "Periode"("tahun") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surat" ADD CONSTRAINT "Surat_periodeId_fkey" FOREIGN KEY ("periodeId") REFERENCES "Periode"("tahun") ON DELETE RESTRICT ON UPDATE CASCADE;
