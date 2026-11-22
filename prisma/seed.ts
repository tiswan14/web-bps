
import 'dotenv/config'
import { randomInt } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, Role } from '../src/generated/prisma/client'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL belum diisi di .env')
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
})

const namaDepan = [
  'Aditya',
  'Bagas',
  'Citra',
  'Dimas',
  'Eka',
  'Farhan',
  'Gita',
  'Hendra',
  'Intan',
  'Jihan',
  'Kevin',
  'Laras',
  'Miko',
  'Nadia',
  'Putra',
  'Rizky',
  'Salsa',
  'Tegar',
  'Vina',
  'Wahyu',
]

const namaBelakang = [
  'Pratama',
  'Saputra',
  'Permata',
  'Ramadhan',
  'Lestari',
  'Firmansyah',
  'Anggraini',
  'Kurniawan',
  'Maulana',
  'Puspita',
  'Hidayat',
  'Setiawan',
  'Nugraha',
  'Wulandari',
  'Hermawan',
]

const fungsiList = [
  'IPDS',
  'Sosial',
  'Produksi',
  'Distribusi',
  'Neraca',
]

const roleList = [
  Role.ADMIN,
  Role.OPERATOR,
  Role.PEGAWAI,
  Role.BENDAHARA,
  Role.PPK,
]

function randomItem<T>(items: T[]): T {
  return items[randomInt(items.length)]
}

function generateNama(): string {
  return `${randomItem(namaDepan)} ${randomItem(namaBelakang)}`
}

function generateUsername(nama: string): string {
  return nama
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
}

function generateNip(): string {
  return Array.from(
    { length: 18 },
    (_, index) => String(randomInt(index === 0 ? 1 : 0, 10)),
  ).join('')
}

async function generateUniqueIdentity() {
  for (let attempt = 0; attempt < 100; attempt++) {
    const nama = generateNama()
    const username = generateUsername(nama)
    const nip = generateNip()

    const [existingUser, existingPegawai] = await Promise.all([
      prisma.user.findUnique({ where: { username } }),
      prisma.pegawai.findUnique({ where: { nip } }),
    ])

    if (!existingUser && !existingPegawai) {
      return { nama, username, nip }
    }
  }

  throw new Error('Gagal menghasilkan identitas unik')
}

async function main() {
  console.log('Memulai seed...')


  const fungsiRecords = await Promise.all(
    fungsiList.map((nama) =>
      prisma.fungsi.upsert({
        where: { nama },
        update: {},
        create: { nama },
      }),
    ),
  )

  for (const role of roleList) {
    const { nama, username, nip } = await generateUniqueIdentity()
    const email = `${username}@example.com`
    const passwordHash = await bcrypt.hash(username, 12)
    const fungsi = randomItem(fungsiRecords)

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        role,
      },
    })

    await prisma.pegawai.create({
      data: {
        nama,
        nip,
        email,
        jabatan: 'Pegawai',
        pangkat: 'Penata',
        golonganAkhir: 'III/a',
        fungsiId: fungsi.id,
        userId: user.id,
      },
    })

    console.log(`${role} | ${nama} | ${username} | ${nip}`)
  }

  console.log('\nSeed berhasil!')
  console.log(`Total role: ${roleList.length}`)
  console.log(`Total fungsi: ${fungsiRecords.length}`)
  console.log('Password seluruh akun: Demo12345!')
}

main()
  .catch((error) => {
    console.error('Seed gagal:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
