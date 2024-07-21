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

module.exports = {
    dummy, totalLikes
}