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
      if (!newUser.name || !newUser.bio) {
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
server.put("/api/users/:id", async (req, res) => {
  try {
    const results = await modules.findById(req.params.id);
    if (!results) {
      res.status(404).json({
        message: "The user with the specified ID does not exist",
      });
    } else {
      if (!req.body.name || !req.body.bio) {
        res.status(400).json({
          message: "Please provide name and bio for the user",
        });
      } else {
        const updateResults = await modules.update(req.params.id, req.body);
        res.status(200).json(updateResults);
      }
    }
  } catch (err) {
    res.status(500).json({
      message: "error updating user",
      err: err.message,
      stack: err.stack,
    });
  }
});
module.exports = server; // EXPORT YOUR SERVER instead of {}
