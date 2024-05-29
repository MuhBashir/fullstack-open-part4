const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

userRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  if (password.length < 3) {
    return res
      .status(400)
      .json({ error: 'password can not be less than 3 characters' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const newUser = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await newUser.save();
  res.status(201).json(savedUser);
});

userRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });
  res.status(200).json(users);
});

// single user

userRouter.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });
  if (user) {
    return res.status(200).json(user);
  }
  return res.status(404).json({ error: 'user not found' });
});

module.exports = userRouter;
