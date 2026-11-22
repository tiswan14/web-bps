-- CreateEnum
CREATE TYPE "JenisPenugasanAnggaran" AS ENUM ('KUASA_PENGGUNA_ANGGARAN', 'PEJABAT_PENANDATANGAN_SURAT_PERINTAH_MEMBAYAR', 'PEJABAT_PEMBUAT_KOMITMEN', 'PEJABAT_PENGADAAN_BARANG_DAN_JASA', 'BENDAHARA_PENGELUARAN');

-- CreateTable
CREATE TABLE "PenugasanAnggaran" (
    "id" TEXT NOT NULL,
    "pegawaiId" TEXT NOT NULL,
    "jenis" "JenisPenugasanAnggaran" NOT NULL,
    "tahunAnggaran" INTEGER NOT NULL,
    "tanggalMulai" TIMESTAMP(3),
    "tanggalSelesai" TIMESTAMP(3),
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenugasanAnggaran_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PenugasanAnggaran_pegawaiId_idx" ON "PenugasanAnggaran"("pegawaiId");

-- CreateIndex
CREATE INDEX "PenugasanAnggaran_tahunAnggaran_idx" ON "PenugasanAnggaran"("tahunAnggaran");

-- CreateIndex
CREATE UNIQUE INDEX "PenugasanAnggaran_pegawaiId_jenis_tahunAnggaran_key" ON "PenugasanAnggaran"("pegawaiId", "jenis", "tahunAnggaran");

-- AddForeignKey
ALTER TABLE "PenugasanAnggaran" ADD CONSTRAINT "PenugasanAnggaran_pegawaiId_fkey" FOREIGN KEY ("pegawaiId") REFERENCES "Pegawai"("id") ON DELETE CASCADE ON UPDATE CASCADE;
