// BUILD YOUR SERVER HERE
const express = require('express');
const User = require('./users/model');
const server = express();
server.use(express.json());
//Endpoints
//post endpoint
server.post('/api/users', async (req, res) => {
  try {
    const { name, bio } = req.body;
    if (!name || !bio) {
      res
        .status(400)
        .json({ message: 'Please provide name and bio for the user' });
    } else {
      const user = await User.insert({ name, bio });
      res.status(201).json(user);
    }
  } catch (error) {
    res.status(500).json({
      message: 'There was an error while saving the user to the database',
    });
  }
});
//basic get endpoint
server.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: 'The users information could not be retrieved' });
  }
});
//get by ID endpoint
server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist' });
      } else {
        res.status(200).json(user);
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: 'The user information could not be retrieved' });
    });
});
//delete by ID at endpoint
server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  User.remove(id)
    .then((deletedUser) => {
      if (!deletedUser) {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist' });
      } else {
        res.status(200).json(deletedUser);
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'The user could not be removed' });
    });
});
// Update the user by ID at endpoint
server.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bio } = req.body;
    if (!name || !bio) {
      res
        .status(400)
        .json({ message: 'Please provide name and bio for the user' });
    } else {
      const updatedUser = await User.update(id, { name, bio });
      if (!updatedUser) {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist' });
      } else {
        res.status(200).json(updatedUser);
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'The user information could not be modified' });
  }
});

module.exports = server; // EXPORT YOUR SERVER instead of {}