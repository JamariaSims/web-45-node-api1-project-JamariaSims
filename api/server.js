// BUILD YOUR SERVER HERE
const express = require("express");
const modules = require("./users/model.js");
const server = express();
server.use(express.json());

const baseURL = "/api/users";
server.post(baseURL, (req, res) => {
  const newUser = req.body;
  modules
    .insert(newUser)
    .then((newUser) => {
      if (!newUser.name && !newUser.bio) {
        res
          .status(400)
          .json({ message: "Please provide name and bio for the user" });
      } else {
        res.status(201).json(newUser);
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "There was an error while saving the user to the database",
        error: error.message,
      });
    });
});
server.get(baseURL, (req, res) => {
  modules
    .find()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json({
        message: "The users information could not be retrieved",
        error: error.message,
      });
    });
});
server.get(`${baseURL}/:id`, (req, res) => {
  modules
    .findById(req.params.id)
    .then((response) => {
      !response
        ? res.status(404).json({
            message: "The user with the specified ID does not exist",
          })
        : res.status(200).json(response);
    })
    .catch((error) => {
      res.status(404).json({
        message: "The user information could not be retrieved",
        error: error.message,
      });
    });
});
server.delete(`${baseURL}/:id`, (req, res) => {
  modules
    .remove(req.params.id)
    .then((response) => {
      response
        ? res.status(200).json(response)
        : res
            .status(404)
            .json({ message: "The user with the specified ID does not exist" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "The user could not be removed" });
    });
});
server.put(`${baseURL}/:id`, async (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  try {
    const results = await modules.update(id, changes);
    const { name, bio } = req.params;
    !name && !bio
      ? res
          .status(404)
          .json({ message: "The user with the specified ID does not exist" })
      : res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "The user information could not be modified" });
  }
});
module.exports = server; // EXPORT YOUR SERVER instead of {}
