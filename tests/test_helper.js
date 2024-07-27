const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const oneBlog = {
        title: "Test Blog",
        author: "Jane Doe",
        url: "https://test.com/",
}

const errorBlog = {
        author: "Error Evan",
        url: "https://error.com/",
}

const initialBlog = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
    },
    {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
    },
    {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
    },
    {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
    }  
  ]

const nonExistingId = async () => {
    const blog = new Blog({ title: 'willremovethissoon', url: "www.test.com" })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const dummyUser = async () => {
  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({ 
    username: `dummy`, 
    name: `dummyname`, 
    passwordHash })

  const savedUser = await user.save()

  const userForToken = {
    username: savedUser.username,
    id: savedUser._id,
  }
  const token = jwt.sign(userForToken, process.env.SECRET)

  return {
    token,
    id: savedUser._id,
  }
}

module.exports = {
  oneBlog, 
  errorBlog, 
  initialBlog, 
  nonExistingId, 
  blogsInDb,
  usersInDb,
  dummyUser
}