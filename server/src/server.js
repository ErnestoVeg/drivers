const express = require("express");
const router = require("./routes");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

const server = express();

server.use(cors());
server.use(bodyParser.json({ limit: "50mb" }));
server.use(morgan("dev"));
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

server.use(router);

module.exports = server;
