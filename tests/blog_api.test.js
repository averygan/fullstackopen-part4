const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')

const Blog = require('../models/blog')

describe('GET method', () => {
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
})

describe('POST method', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlog)
    })

    test('addition of a new blog', async () => {
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
        assert(titles.includes("Test Blog"))
    })

    test('check that like defaults to zero when absent', async () => {
        const response = await api
            .post('/api/blogs')
            .send(helper.oneBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blog = response.body
        assert.strictEqual(blog.likes, 0)
    })

    test('check error when title or url absent', async () => {
        const response = await api
            .post('/api/blogs')
            .send(helper.errorBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })
})

describe('PUT method', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlog)
    })

    test('update blog title', async() => {
        // Get existing blogs
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
    
        // Put request to update title
        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send({"title": "new title!"})
            .expect(200)

        // Checks if title has been updated
        const blogsAtEnd = await helper.blogsInDb()
        const titles = blogsAtEnd.map(r => r.title)
        assert(titles.includes("new title!"))
        assert(!titles.includes(blogToUpdate.title))
    })

    test('update invalid id', async() => {
        await api
            .put(`/api/blogs/12345`)
            .send({
                "title": "new title!",
            })
            .expect(400)
    })
})

describe ('DELETE method', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlog)
    })

    test('succeeds with status code 404 if id is valid', async () => 
    {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        // Checks if blog length has been reduced
        assert.strictEqual(blogsAtEnd.length, helper.initialBlog.length - 1)

        // Confirms if title has been removed 
        const titles = blogsAtEnd.map(r => r.title)
        assert(!titles.includes(blogToDelete.title))
    })

    test('404 if id is invalid', async () => {
        await api
            .delete(`/api/blogs/12345`)
            .expect(404)
    })
})

after(async () => {
  await mongoose.connection.close()
})