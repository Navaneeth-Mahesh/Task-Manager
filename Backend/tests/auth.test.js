import request from 'supertest'
import mongoose from 'mongoose'
import app from '../src/app.js'

// ─── Test DB ──────────────────────────────────────────────────────────────────
const MONGO_TEST_URI =
  process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/taskflow_test'

beforeAll(async () => {
  await mongoose.connect(MONGO_TEST_URI)
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})

// ─── Helpers ──────────────────────────────────────────────────────────────────
const testUser = {
  fullname: 'Test User',
  email: `test_${Date.now()}@example.com`,
  password: 'Password1',
}

let cookie = ''

// ─── Tests ────────────────────────────────────────────────────────────────────
describe('Auth — POST /api/auth/register', () => {
  it('should register a new user and return 201', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser)
    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.user.email).toBe(testUser.email)
    expect(res.body.data.token).toBeDefined()
    // Save cookie for subsequent tests
    cookie = res.headers['set-cookie']
  })

  it('should reject duplicate email with 409', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser)
    expect(res.status).toBe(409)
    expect(res.body.success).toBe(false)
  })

  it('should reject missing fields with 422', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'bad@test.com' }) // missing fullname and password
    expect(res.status).toBe(422)
  })

  it('should reject weak password with 422', async () => {
    const res = await request(app).post('/api/auth/register').send({
      fullname: 'Test',
      email: 'weak@test.com',
      password: 'abc', // too short, no uppercase, no number
    })
    expect(res.status).toBe(422)
  })
})

describe('Auth — POST /api/auth/login', () => {
  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password })
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.token).toBeDefined()
    cookie = res.headers['set-cookie']
  })

  it('should reject wrong password with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'WrongPass1' })
    expect(res.status).toBe(401)
  })

  it('should reject unknown email with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@test.com', password: 'Password1' })
    expect(res.status).toBe(401)
  })
})

describe('Auth — GET /api/auth/me', () => {
  it('should return current user when authenticated', async () => {
    const res = await request(app).get('/api/auth/me').set('Cookie', cookie)
    expect(res.status).toBe(200)
    expect(res.body.data.user.email).toBe(testUser.email)
  })

  it('should return 401 without auth', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
  })
})

describe('Auth — POST /api/auth/logout', () => {
  it('should log out and clear cookie', async () => {
    const res = await request(app).post('/api/auth/logout').set('Cookie', cookie)
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })
})
