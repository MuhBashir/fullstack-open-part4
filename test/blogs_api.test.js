const { test, after, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const { initialBlogs, blogsInDb } = require('./helper_blogs');
const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { usersInDb } = require('./helper_blogs');

const api = supertest(app);

describe('Blog Tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const user = new User({
      username: 'muhd',
      name: 'muhd',
      passwordHash: await bcrypt.hash('sekret', 10),
    });

    await user.save();

    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
  });

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('content-type', /application\/json/);
  });

  test('verifies that unique id is present in the blog', async () => {
    const res = (await api.get('/api/blogs')).body;

    res.forEach((blog) => {
      assert.ok(blog.id);
    });
  });

  test('verifies that when http post is called, a new blog is created', async () => {
    const user = await api
      .post('/api/login')
      .send({ username: 'muhd', password: 'sekret' });
    const token = user.body.token;

    const newBlog = {
      title: 'test',
      author: 'muhd',
      url: 'test',
      likes: 10,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201);

    const blogs = await api.get('/api/blogs');
    assert.strictEqual(blogs.body.length, initialBlogs.length + 1);
  });

  test('verifies if the likes property is missing should default to zero', async () => {
    const user = await api
      .post('/api/login')
      .send({ username: 'muhd', password: 'sekret' });

    const newBlog = {
      title: 'test',
      author: 'muhd',
      url: 'test',
    };
    const token = user.body.token;
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201);

    await api.get('/api/blogs').expect((res) => {
      assert.strictEqual(res.body[res.body.length - 1].likes, 0);
    });
  });

  test('if title or url is missing, it should response with 400', async () => {
    const user = await api
      .post('/api/login')
      .send({ username: 'muhd', password: 'sekret' });

    const newBlog = {
      author: 'Muhammad',
      likes: 20,
    };

    const token = user.body.token;

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });

  test('updating a blog', async () => {
    const newBlog = {
      title: 'test',
      author: 'muhd',
      url: 'test',
      likes: 10,
    };

    const blogAtStart = await blogsInDb();
    const blogToView = blogAtStart[0];

    const notesToUpdate = await api
      .put(`/api/blogs/${blogToView.id}`)
      .send(newBlog)
      .expect(200);

    assert.strictEqual(notesToUpdate.body.title, newBlog.title);
  });

  test('if no token the test should failed with the status of 401', async () => {
    const newBlog = {
      title: 'test',
      author: 'muhd bashir',
      url: 'test',
      likes: 10,
    };

    await api.post('/api/blogs').send(newBlog).expect(401);
  });
});

describe('User Tests', () => {
  test('verifies if password is less than 3 characters, it should return 400', async () => {
    const newUser = {
      username: 'muhd',
      name: 'muhd',
      password: 'se',
    };

    await api.post('/api/users').send(newUser).expect(400);

    const users = await usersInDb();
    assert.strictEqual(users.length, 1);
  });

  test('verifies if username is not unique, it should return 409', async () => {
    const newUser = {
      username: 'muhd',
      name: 'muhd',
      password: 'sekret',
    };
    await api.post('/api/users').send(newUser).expect(409);
  });
});

after(async () => {
  await mongoose.connection.close();
});
