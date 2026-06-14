import request from 'supertest'
import mongoose from 'mongoose'
import app from '../src/app.js'

const MONGO_TEST_URI =
  process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/taskflow_test2'

beforeAll(async () => {
  await mongoose.connect(MONGO_TEST_URI)
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})

// ─── Helpers ──────────────────────────────────────────────────────────────────
let cookie = ''
let taskId = ''

const registerAndLogin = async () => {
  const user = { fullname: 'Task Tester', email: `tasks_${Date.now()}@test.com`, password: 'Password1' }
  const res = await request(app).post('/api/auth/register').send(user)
  return res.headers['set-cookie']
}

// ─── Tests ────────────────────────────────────────────────────────────────────
beforeAll(async () => {
  cookie = await registerAndLogin()
})

describe('Tasks — POST /api/tasks', () => {
  it('should create a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Cookie', cookie)
      .send({
        title: 'Test Task',
        description: 'This is a test task',
        priority: 'high',
        status: 'todo',
        tags: ['test', 'jest'],
      })
    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.task.title).toBe('Test Task')
    taskId = res.body.data.task._id
  })

  it('should reject task without title', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Cookie', cookie)
      .send({ description: 'No title here' })
    expect(res.status).toBe(422)
  })

  it('should reject invalid priority', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Cookie', cookie)
      .send({ title: 'Bad Priority Task', priority: 'critical' })
    expect(res.status).toBe(422)
  })

  it('should require authentication', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Unauth Task' })
    expect(res.status).toBe(401)
  })
})

describe('Tasks — GET /api/tasks', () => {
  it('should return paginated tasks', async () => {
    const res = await request(app).get('/api/tasks').set('Cookie', cookie)
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.pagination).toBeDefined()
    expect(res.body.pagination.total).toBeGreaterThan(0)
  })

  it('should filter by status', async () => {
    const res = await request(app)
      .get('/api/tasks?status=todo')
      .set('Cookie', cookie)
    expect(res.status).toBe(200)
    res.body.data.forEach((t) => expect(t.status).toBe('todo'))
  })

  it('should support pagination', async () => {
    const res = await request(app)
      .get('/api/tasks?page=1&limit=5')
      .set('Cookie', cookie)
    expect(res.status).toBe(200)
    expect(res.body.data.length).toBeLessThanOrEqual(5)
    expect(res.body.pagination.limit).toBe(5)
  })
})

describe('Tasks — GET /api/tasks/:id', () => {
  it('should return a single task', async () => {
    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Cookie', cookie)
    expect(res.status).toBe(200)
    expect(res.body.data.task._id).toBe(taskId)
  })

  it('should return 404 for non-existent task', async () => {
    const fakeId = new mongoose.Types.ObjectId()
    const res = await request(app)
      .get(`/api/tasks/${fakeId}`)
      .set('Cookie', cookie)
    expect(res.status).toBe(404)
  })

  it('should return 404 for invalid ObjectId', async () => {
    const res = await request(app)
      .get('/api/tasks/not-a-valid-id')
      .set('Cookie', cookie)
    expect([404, 422]).toContain(res.status)
  })
})

describe('Tasks — PUT /api/tasks/:id', () => {
  it('should update a task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Cookie', cookie)
      .send({ title: 'Updated Title', status: 'in-progress', progress: 50 })
    expect(res.status).toBe(200)
    expect(res.body.data.task.title).toBe('Updated Title')
    expect(res.body.data.task.status).toBe('in-progress')
    expect(res.body.data.task.progress).toBe(50)
  })
})

describe('Tasks — PATCH /api/tasks/:id/status', () => {
  it('should update task status only', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .set('Cookie', cookie)
      .send({ status: 'completed' })
    expect(res.status).toBe(200)
    expect(res.body.data.task.status).toBe('completed')
  })

  it('should reject invalid status', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .set('Cookie', cookie)
      .send({ status: 'invalid_status' })
    expect(res.status).toBe(422)
  })
})

describe('Tasks — DELETE /api/tasks/:id', () => {
  it('should delete a task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Cookie', cookie)
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  it('should return 404 after deletion', async () => {
    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Cookie', cookie)
    expect(res.status).toBe(404)
  })
})

describe('Dashboard — GET /api/dashboard/stats', () => {
  it('should return dashboard stats', async () => {
    const res = await request(app)
      .get('/api/dashboard/stats')
      .set('Cookie', cookie)
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('totalTasks')
    expect(res.body.data).toHaveProperty('completed')
    expect(res.body.data).toHaveProperty('inProgress')
    expect(res.body.data).toHaveProperty('completionRate')
  })
})
