const _ = require('lodash');

const dummy = (blogs) => {
    return 1;
  }

const totalLikes = (blogs) => {
    let totalLikes = 0;
    if (blogs.length === 0)
        return totalLikes
    totalLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
    console.log('total likes is ', totalLikes)
    return totalLikes
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((max, blog) => (
        max.likes > blog.likes ? max : blog), 
        blogs[0]);
}

const mostBlogs = (blogs) => {
    const author = _.countBy(blogs, 'author')
    const authorEntries = _.toPairs(author)
    const [maxAuthor, maxCount] = _.maxBy(authorEntries, ([_, count]) => count)
    return {author: maxAuthor, blogs: maxCount}
}

const mostLikes = (blogs) => {
    const totalLikes = _.mapValues(
        _.groupBy(blogs, 'author'),
        (blogs) => _.sumBy(blogs, 'likes'))
    const authorLikes = _.toPairs(totalLikes)
    const [maxAuthor, maxLikes] = _.maxBy(authorLikes, ([_, likes]) => likes)
    return {author: maxAuthor, likes: maxLikes}
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}