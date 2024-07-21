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

module.exports = {
    dummy, totalLikes, favoriteBlog
}