import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Khusus development: password setiap akun sama dengan username-nya.
// Data dummy: nama dan NIP fiktif, tetapi seluruh variasi golongan,
// pangkat, dan jabatan mengikuti data referensi.

const data = [
  {
    username: "anita",
    role: Role.PPK,
    nama: "Anita Kusuma, S.ST., M.Si.",
    nipLama: "340000001",
    nipBaru: "197503101999032001",
    nik: "3218015003750001",
    jabatan: "Kepala BPS Kabupaten",
    golongan: "IV/b",
    pangkat: "Pembina Tingkat I",
  },
  {
    username: "ahmad",
    role: Role.ADMIN,
    nama: "Ahmad Fauzi, S.IP",
    nipLama: "340000002",
    nipBaru: "197104152001121002",
    nik: "3218011504710002",
    jabatan: "Kepala Subbagian Umum",
    golongan: "III/d",
    pangkat: "Penata Tingkat I",
  },
  {
    username: "joko",
    role: Role.PEGAWAI,
    nama: "Joko Prasetyo, SST., M.Si.",
    nipLama: "340000003",
    nipBaru: "198009122005011003",
    nik: "3218011209800003",
    jabatan: "Statistisi Ahli Madya",
    golongan: "IV/a",
    pangkat: "Pembina",
  },
  {
    username: "dewi",
    role: Role.PEGAWAI,
    nama: "Dewi Lestari, S.ST.",
    nipLama: "340000004",
    nipBaru: "198202282008012004",
    nik: "3218016802820004",
    jabatan: "Statistisi Ahli Muda",
    golongan: "III/d",
    pangkat: "Penata Tingkat I",
  },
  {
    username: "rizky",
    role: Role.PEGAWAI,
    nama: "Rizky Pratama, S.Kom.",
    nipLama: "340000005",
    nipBaru: "198906142012011005",
    nik: "3218011406890005",
    jabatan: "Pranata Komputer Ahli Muda",
    golongan: "III/c",
    pangkat: "Penata",
  },
  {
    username: "budi",
    role: Role.PEGAWAI,
    nama: "Budi Santoso, S.E.",
    nipLama: "340000006",
    nipBaru: "199007212015031006",
    nik: "3218012107900006",
    jabatan: "Statistisi Ahli Pertama",
    golongan: "III/b",
    pangkat: "Penata Muda Tingkat I",
  },
  {
    username: "lina",
    role: Role.PEGAWAI,
    nama: "Lina Marlina, S.Si.",
    nipLama: "340000007",
    nipBaru: "199401052022032007",
    nik: "3218014501940007",
    jabatan: "Statistisi Ahli Pertama",
    golongan: "III/a",
    pangkat: "Penata Muda",
  },
  {
    username: "agus",
    role: Role.PEGAWAI,
    nama: "Agus Setiawan",
    nipLama: "340000008",
    nipBaru: "197308301994031008",
    nik: "3218013008730008",
    jabatan: "Statistisi Penyelia",
    golongan: "III/d",
    pangkat: "Penata Tingkat I",
  },
  {
    username: "wati",
    role: Role.PEGAWAI,
    nama: "Wati Handayani, S.H.",
    nipLama: "340000009",
    nipBaru: "197802192002122009",
    nik: "3218015902780009",
    jabatan: "Statistisi Mahir",
    golongan: "III/b",
    pangkat: "Penata Muda Tingkat I",
  },
  {
    username: "nisa",
    role: Role.PEGAWAI,
    nama: "Nisa Aulia, A.Md.",
    nipLama: "340000010",
    nipBaru: "199904172022032010",
    nik: "3218015704990010",
    jabatan: "Statistisi Terampil",
    golongan: "II/c",
    pangkat: "Pengatur",
  },
  {
    username: "hendra",
    role: Role.BENDAHARA,
    nama: "Hendra Wijaya, A.Md",
    nipLama: "340000011",
    nipBaru: "199109302025061011",
    nik: "3218013009910011",
    jabatan: "Pranata Keuangan APBN Terampil",
    golongan: "II/c",
    pangkat: "Pengatur",
  },
  {
    username: "siti",
    role: Role.OPERATOR,
    nama: "Siti Rahmawati",
    nipLama: "340000012",
    nipBaru: "197605122009112012",
    nik: "3218015205760012",
    jabatan: "Pengolah Data Umum",
    golongan: "II/c",
    pangkat: "Pengatur",
  },
  {
    username: "eko",
    role: Role.PEGAWAI,
    nama: "Eko Nugroho",
    nipLama: "340000013",
    nipBaru: "198201112025211013",
    nik: "3218011101820013",
    jabatan: "Staf Subbagian Umum Kabupaten",
    golongan: "Golongan V",
    pangkat: "PPPK",
  },
];

async function main() {
  for (const d of data) {
    const passwordHash = await bcrypt.hash(d.username, 10);

    await prisma.user.upsert({
      where: { username: d.username },
      update: {},
      create: {
        username: d.username,
        email: `${d.username}@bps.test`,
        passwordHash,
        role: d.role,
        pegawai: {
          create: {
            nama: d.nama,
            nipLama: d.nipLama,
            nipBaru: d.nipBaru,
            nik: d.nik,
            jabatan: d.jabatan,
            golongan: d.golongan,
            pangkat: d.pangkat,
          },
        },
      },
    });
  }

  console.log(`Seed selesai: ${data.length} user + pegawai.`);
  console.log("Login: username dan password sama (contoh: ahmad / ahmad).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());