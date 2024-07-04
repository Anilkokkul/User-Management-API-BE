const express = require("express");
require("dotenv").config();
const { db } = require("./db/db.connect");
db();
const app = express();

app.use(express.json());

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on http//:localhost:${port}`);
});
