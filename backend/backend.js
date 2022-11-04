const express = require("express");
const app = express();
const port = 5001;
const cors = require("cors");
const crypto = require("crypto");
const axios = require("axios");
require("dotenv").config();

const userServices = require("./models/user-services");

app.use(cors());
app.use(express.json());

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

app.get("/", async (req, res) => {
  try {
    const name = req.query["name"];
    if (name) {
      const result = await axios.request(
        "https://api.themoviedb.org/3/search/movie/?api_key=" +
          process.env.API_KEY +
          "&query=" +
          name
      );
      res.send(result.data.results);
    } else {
      const result = await axios.request(
        "https://api.themoviedb.org/3/movie/popular?api_key=" +
          process.env.API_KEY +
          "&language=en-US&page=1"
      );
      res.send(result.data.results);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("An error ocurred in the server.");
  }
});

app.get("/search", async (req, res) => {
    try {
        const name = req.query["name"];
        const result = await axios.request(
            "https://api.themoviedb.org/3/search/movie/?api_key=" +
              process.env.API_KEY +
              "&query=" +
              name
          );
        res.send(result.data.results);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("An error ocurred in the server.");
    }
})

app.get("/users", async (req, res) => {
  const username = req.query["username"];
  const password = req.query["password"];
  try {
    const result = await userServices.getUsers(username, password);
    //console.log({ users_list: result});
    if (result){
        res.status(200).send({ users_list: result });
    }
    else{
        console.log({ users_list: result});
        res.status(500).end();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("An error ocurred in the server.");
  }
});

app.get("/users/:id", async (req, res) => {
  const id = req.params["id"];
  const result = await userServices.findUserById(id);
  if (result === undefined || result === null)
    res.status(404).send("Resource not found.");
  else {
    res.send({ users_list: result });
  }
});

app.post("/users", async (req, res) => {
  const user = req.body;
  const result = await userServices.findUserByUserName(user['username'])
  if (result.length > 0){
    console.log(result)
    res.status(400).end();
  }else{
    const savedUser = await userServices.addUser(user);
    if (savedUser) res.status(200).send(savedUser);
    else res.status(500).end();
  }
});

app.delete("/users/:id", async (req, res) => {
  const id = req.params["id"];
  const result = await userServices.removeUserById(id);
  if (result == -1) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(204).end();
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
