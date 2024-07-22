const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const mongoose = require('mongoose');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const { title, url } = request.body
  if (!title || !url)
  {
    return response.status(400).json({
      error: 'Title and URL are required fields'
    })
  }
  const blog = new Blog(request.body)
  const result = await blog.save()
  response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {
  id = request.params.id
  if (!mongoose.Types.ObjectId.isValid(id))
    return response.status(404).end()

  const result = await Blog.findByIdAndDelete(id)
  if (result)
    response.status(204).end()
  else
    response.status(404).end()
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