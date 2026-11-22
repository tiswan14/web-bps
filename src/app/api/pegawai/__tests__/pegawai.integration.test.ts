
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { prisma } from '@/lib/prisma'

const BASE_URL = process.env.TEST_BASE_URL ?? 'http://localhost:3001'
const TEST_PASSWORD = 'TestPassword123!'

const suffix = randomUUID()

const testUser = {
  username: `test_pegawai_${suffix.slice(0, 8)}`,
  email: `test_pegawai_${suffix}@test.local`,
}

const testPegawai = {
  nama: 'Pegawai Integration Test',
  nip: `TEST${suffix.replaceAll('-', '').slice(0, 14)}`,
}

let sessionCookie = ''
let pegawaiId = ''
const createdPegawaiIds: string[] = []

async function apiRequest(
  path: string,
  options: RequestInit = {},
  authenticated = true,
) {
  const headers = new Headers(options.headers)

  if (authenticated && sessionCookie) {
    headers.set('Cookie', sessionCookie)
  }

  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })
}

async function login(): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      identifier: testUser.username,
      password: TEST_PASSWORD,
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

async function createPegawai() {
  const response = await prisma.pegawai.create({
    data: testPegawai,
  })

  pegawaiId = response.id
}

describe('Pegawai Integration Test', () => {
  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL testing belum dikonfigurasi')
    }

    const passwordHash = await bcrypt.hash(TEST_PASSWORD, 4)

    await prisma.user.create({
      data: {
        ...testUser,
        passwordHash,
        role: 'ADMIN',
      },
    })

    await createPegawai()

    sessionCookie = await login()
  })

  afterAll(async () => {
    await prisma.pegawai.deleteMany({
      where: {
        OR: [
          { id: pegawaiId },
          { id: { in: createdPegawaiIds } },
        ],
      },
    })

    await prisma.user.deleteMany({
      where: {
        username: testUser.username,
      },
    })
  })

  it('should reject request without session', async () => {
    const response = await apiRequest(
      '/api/pegawai',
      {},
      false,
    )

    expect(response.status).toBe(401)
  })

  it('should get pegawai list', async () => {
    const response = await apiRequest('/api/pegawai')
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(Array.isArray(body.data)).toBe(true)
    expect(
      body.data.some((item: { id: string }) => item.id === pegawaiId),
    ).toBe(true)
  })

  it('should get pegawai detail', async () => {
    const response = await apiRequest(`/api/pegawai/${pegawaiId}`)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.data.id).toBe(pegawaiId)
    expect(body.data.nama).toBe(testPegawai.nama)
  })

  it('should create pegawai', async () => {
    const payload = {
      nama: 'Pegawai Baru Integration Test',
      nip: `NEW${randomUUID().replaceAll('-', '').slice(0, 15)}`,
    }

    const response = await apiRequest('/api/pegawai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const body = await response.json()

    expect(response.status).toBe(201)
    expect(body.success).toBe(true)
    expect(body.data.nama).toBe(payload.nama)
    expect(body.data.nip).toBe(payload.nip)

    createdPegawaiIds.push(body.data.id)
  })

  it('should reject invalid pegawai data', async () => {
    const response = await apiRequest('/api/pegawai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nama: '',
        nip: '',
      }),
    })

    expect(response.status).toBe(400)
  })

  it('should update pegawai', async () => {
    const updatedName = 'Pegawai Updated Integration Test'

    const response = await apiRequest(`/api/pegawai/${pegawaiId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nama: updatedName,
      }),
    })

    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)

    const updatedPegawai = await prisma.pegawai.findUnique({
      where: { id: pegawaiId },
    })

    expect(updatedPegawai?.nama).toBe(updatedName)
  })

  it('should delete pegawai permanently', async () => {
    const response = await apiRequest(`/api/pegawai/${pegawaiId}`, {
      method: 'DELETE',
    })

    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)

    const deletedPegawai = await prisma.pegawai.findUnique({
      where: { id: pegawaiId },
    })

    expect(deletedPegawai).toBeNull()
  })
})
