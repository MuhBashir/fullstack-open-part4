const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const total = blogs
    .map((blog) => blog.likes)
    .reduce((prev, curr) => {
      return prev + curr;
    }, 0);

  return total;
};

const favoriteBlog = (blogs) => {
  const blog = blogs.sort((a, b) => a.likes - b.likes);
  return blog[blogs.length - 1];
};

const mostBlogs = (blogs) => {
  const authors = {};
  blogs.forEach((blog) => {
    if (authors[blog.author]) {
      authors[blog.author] = authors[blog.author] + 1;
    } else {
      authors[blog.author] = 1;
    }
  });

  let max = 0;
  let maxAuthor = '';
  for (let author in authors) {
    if (authors[author] > max) {
      max = authors[author];
      maxAuthor = author;
    }
  }
  return { author: maxAuthor, blogs: max };
};

const mostLikes = (blogs) => {
  const authors = {};
  blogs.forEach((blog) => {
    if (authors[blog.author]) {
      authors[blog.author] = authors[blog.author] + blog.likes;
    } else {
      authors[blog.author] = blog.likes;
    }
  });

  let max = 0;
  let maxAuthor = '';
  for (let author in authors) {
    if (authors[author] > max) {
      max = authors[author];
      maxAuthor = author;
    }
  }
  return { author: maxAuthor, likes: max };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
