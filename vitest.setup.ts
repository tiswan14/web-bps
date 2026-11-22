
import { beforeAll } from 'vitest'

beforeAll(() => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL testing belum dikonfigurasi')
  }

  if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET testing belum dikonfigurasi')
  }
})
