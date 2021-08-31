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
      res.status(201).json(newUser);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});
server.get(baseURL, (req, res) => {
  modules
    .find()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});
server.get(`${baseURL}/:id`, (req, res) => {
  modules
    .findById(req.params.id)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
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
            .json({ message: `user ${req.params.id} is not found...` });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: error.message });
    });
});
server.put(`${baseURL}/:id`, async (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  console.log(id, changes);
  try {
    const results = await modules.update(id, changes);
    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
module.exports = server; // EXPORT YOUR SERVER instead of {}
