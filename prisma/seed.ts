import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} belum diisi di .env`)
  }
  return value
}

const adapter = new PrismaPg({ connectionString: requireEnv('DATABASE_URL') })
const prisma = new PrismaClient({ adapter })

const NAMA_FUNGSI = ['Sosial', 'Neraca', 'Produksi', 'Distribusi', 'IPDS']

async function main() {
  for (const nama of NAMA_FUNGSI) {
    await prisma.fungsi.upsert({
      where: { nama },
      update: {},
      create: { nama },
    })
  }

  const adminHash = await bcrypt.hash(requireEnv('SEED_ADMIN_PASSWORD'), 12)
  const operatorHash = await bcrypt.hash(requireEnv('SEED_OPERATOR_PASSWORD'), 12)

  await prisma.user.upsert({
    where: { email: 'admin@contoh.test' },
    update: { username: 'admin', passwordHash: adminHash, role: 'ADMIN', isActive: true },
    create: { username: 'admin', email: 'admin@contoh.test', passwordHash: adminHash, role: 'ADMIN' },
  })

  const operator = await prisma.user.upsert({
    where: { email: 'operator@contoh.test' },
    update: { username: 'operator', passwordHash: operatorHash, role: 'OPERATOR', isActive: true },
    create: { username: 'operator', email: 'operator@contoh.test', passwordHash: operatorHash, role: 'OPERATOR' },
  })

  await prisma.pegawai.upsert({
    where: { nip: '199001012015011001' },
    update: { userId: operator.id },
    create: {
      nama: 'Operator Contoh',
      nip: '199001012015011001',
      email: 'operator@contoh.test',
      jabatan: 'Operator Surat',
      userId: operator.id,
    },
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
