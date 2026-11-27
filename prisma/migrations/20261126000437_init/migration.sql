-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'OPERATOR', 'PEGAWAI', 'BENDAHARA', 'PPK');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PEGAWAI',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "failedLoginCount" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pegawai" (
    "id" TEXT NOT NULL,
    "nipLama" TEXT NOT NULL,
    "nipBaru" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "golongan" TEXT NOT NULL,
    "pangkat" TEXT NOT NULL,
    "pendidikan" TEXT,
    "noHp" TEXT,
    "email" TEXT,
    "npwp" TEXT,
    "rekening" TEXT,
    "bank" TEXT,
    "linkSkJabatan" TEXT,
    "linkSkPangkat" TEXT,
    "foto" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pegawai_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pegawai_nipLama_key" ON "Pegawai"("nipLama");

-- CreateIndex
CREATE UNIQUE INDEX "Pegawai_nipBaru_key" ON "Pegawai"("nipBaru");

-- CreateIndex
CREATE UNIQUE INDEX "Pegawai_nik_key" ON "Pegawai"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "Pegawai_userId_key" ON "Pegawai"("userId");

-- CreateIndex
CREATE INDEX "Pegawai_nama_idx" ON "Pegawai"("nama");

-- AddForeignKey
ALTER TABLE "Pegawai" ADD CONSTRAINT "Pegawai_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
