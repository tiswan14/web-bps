
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from 'vitest'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { prisma } from '@/lib/prisma'

const BASE_URL = process.env.TEST_BASE_URL ?? 'http://localhost:3001'
const PASSWORD = 'TestPassword123!'
const suffix = randomUUID()

const testUser = {
  username: `validation_${suffix.slice(0, 8)}`,
  email: `validation_${suffix}@test.local`,
}

const existingPegawai = {
  nama: 'Pegawai Validation Test',
  nip: `VAL${suffix.replaceAll('-', '').slice(0, 15)}`,
}

let sessionCookie = ''
let pegawaiId = ''

async function apiRequest(
  path: string,
  options: RequestInit = {},
) {
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Cookie: sessionCookie,
    },
  })
}

async function createSession() {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      identifier: testUser.username,
      password: PASSWORD,
    }),
  })

  if (!response.ok) {
    throw new Error(`Login testing gagal: HTTP ${response.status}`)
  }

  const setCookie = response.headers.get('set-cookie')
  const cookie = setCookie?.match(/simarlin_session=[^;]+/)?.[0]

  if (!cookie) {
    throw new Error('Session cookie tidak ditemukan')
  }

  return cookie
}

async function expectValidationError(response: Response) {
  expect([400, 404, 409, 422]).toContain(response.status)
}

describe('Pegawai Validation Integration Test', () => {
  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(PASSWORD, 4)

    await prisma.user.create({
      data: {
        ...testUser,
        passwordHash,
        role: 'ADMIN',
      },
    })

    const pegawai = await prisma.pegawai.create({
      data: existingPegawai,
    })

    pegawaiId = pegawai.id
    sessionCookie = await createSession()
  })

  afterAll(async () => {
    await prisma.pegawai.deleteMany({
      where: { id: pegawaiId },
    })

    await prisma.user.deleteMany({
      where: { username: testUser.username },
    })
  })

  it('should reject empty nama', async () => {
    const response = await apiRequest('/api/pegawai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nama: '',
        nip: `EMPTY${suffix.slice(0, 8)}`,
      }),
    })

    await expectValidationError(response)
  })

  it('should reject empty NIP', async () => {
    const response = await apiRequest('/api/pegawai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nama: 'Pegawai Tanpa NIP',
        nip: '',
      }),
    })

    await expectValidationError(response)
  })

  it('should reject invalid field types', async () => {
    const response = await apiRequest('/api/pegawai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nama: 12345,
        nip: true,
      }),
    })

    await expectValidationError(response)
  })

  it('should reject duplicate NIP', async () => {
    const response = await apiRequest('/api/pegawai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nama: 'Pegawai Duplikat',
        nip: existingPegawai.nip,
      }),
    })

    await expectValidationError(response)
  })

  it('should reject unknown fungsiId', async () => {
    const response = await apiRequest('/api/pegawai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nama: 'Pegawai Fungsi Tidak Valid',
        nip: `FUNC${suffix.replaceAll('-', '').slice(0, 12)}`,
        fungsiId: `fungsi-${randomUUID()}`,
      }),
    })

    await expectValidationError(response)
  })

  it('should reject invalid nama type during update', async () => {
    const response = await apiRequest(`/api/pegawai/${pegawaiId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nama: 12345,
      }),
    })

    await expectValidationError(response)
  })
})
