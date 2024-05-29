const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
  {
    title: 'react',
    author: 'naxifi',
    url: 'test',
    likes: 5,
  },
  {
    title: 'nodejs',
    author: 'muazzam',
    url: 'test',
    likes: 20,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  // console.log(blogs);
  return blogs.map((blog) => blog.toJSON());
};

// non-existing
const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'willremovethissoon',
    url: 'willremovethissoon',
    likes: 0,
  });
  await blog.save();
  await blog.deleteOne();
  return blog._id.toString();
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingId,
  usersInDb,
};
