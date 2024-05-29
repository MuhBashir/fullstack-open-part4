const app = require('../app');
const Blog = require('../models/blog');
const blogsRouter = require('express').Router();
const { userExtractor } = require('../utils/middleware');

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  };

  if (!newBlog.title || !newBlog.url) {
    return response.status(400).json({ error: 'title or url is missing' });
  }

  const blog = new Blog(newBlog);
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog.id);
  await user.save();

  response.status(201).json(savedBlog);
});

// get all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

// single blog router

blogsRouter.get('/:id', async (req, res, next) => {
  const id = req.params.id;

  const blog = await Blog.findById(id);
  if (blog) {
    return res.status(200).json(blog);
  }
  return res.status(404).json({ error: 'blog not found' });
});

// deleting a blog

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
  const id = req.params.id;
  const user = req.user;

  const blog = await Blog.findById(id);
  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(id);
    return res.status(204).end();
  }
  res.status(404).json({ error: 'blog not found' });
});

// updating a blog

blogsRouter.put('/:id', async (req, res) => {
  const id = req.params.id;

  const blog = await Blog.findById(id);
  if (blog) {
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      context: 'query',
    });
    return res.status(200).json(updatedBlog);
  }
  return res.status(404).json({ error: 'blog not found' });
});

module.exports = blogsRouter;
