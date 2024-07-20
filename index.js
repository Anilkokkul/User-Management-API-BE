const express = require("express");
require("dotenv").config();
const { db } = require("./db/db.connect");
const cookieParser = require("cookie-parser");
const cors = require("cors");
db();
const userRoutes = require("./routes/auth.routes");
const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 8000;

app.use(userRoutes);

app.get("/", (req, res) => {
  res.send(`<h1>Welcome to the API</h1>`);
});

app.listen(port, () => {
  console.log(`Server is running on http//:localhost:${port}`);
});
