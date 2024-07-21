const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const blogRouter = require('./controllers/blogs')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl, 
{
    dbName: 'blog',
})
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB: ', error.message)
    })

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogRouter)

module.exports = app