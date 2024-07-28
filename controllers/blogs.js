const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!body.title || !body.url)
  {
    return response.status(400).json({
      error: 'Title and URL are required fields'
    })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author === undefined ? false : body.author,
    url: body.url,
    likes: body.likes === undefined ? false : body.likes,
    user: user.id
  })

  const result = await blog.save()

  // add blog to user
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  response.status(201).json(result)
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const id = request.params.id
  const user = request.user

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(404).end()
  }

  const blog = await Blog.findById(id)
  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
  }
  else {
    return response.status(401).json({ error: 'user unauthorized' })
  }
})

blogRouter.put('/:id', async (request, response) => {
  const new_blog = request.body
  const id = request.params.id

  if (!mongoose.Types.ObjectId.isValid(id))
    return response.status(400).end()

  const result = await Blog.findByIdAndUpdate(id, new_blog, { 
    new: true,
  })

  if (result) {
    response.json(result)
  } else {
    response.status(404).end()
  }
})

module.exports = blogRouter