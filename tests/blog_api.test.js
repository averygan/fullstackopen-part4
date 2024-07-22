const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlog)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('check number of blogs', async () => {
    const response = await api
      .get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlog.length)
})

test('unique identifier is id', async () => {
    const response = await api
    .get('/api/blogs')

    blogs = response.body
    blogs.forEach(blog => {
        assert.strictEqual(('id' in blog), true)
        assert.strictEqual(('_id' in blog), false)
        assert.strictEqual(('_v' in blog), false)
    })
})

test('post method', async () => {
    // Make post req
    await api
        .post('/api/blogs')
        .send(helper.oneBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    // Check that length += 1
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlog.length + 1)
    const titles = blogsAtEnd.map(n => n.title)
    assert(titles.includes(helper.oneBlog.title))
})

after(async () => {
  await mongoose.connection.close()
})