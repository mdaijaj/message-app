const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
// const dotenv = require("dotenv");
var bodyParser = require('body-parser')

// dotenv.config();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  next();
});

app.use(cors({
  origin: '*',  
  allowedHeaders: ['Authorization', 'Content-Type']
}));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});


app.use(express.json());
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}));

app.use(bodyParser.urlencoded({ extended: false }))
// database
const db = require("./model");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db success...");
  }).catch((err) => {
    console.log("Failed to sync db...", err)
  })



app.get("/", (req, res) => {
  res.json({ message: "Welcome to New Application." });
});

// routes
require('./route/index')(app);

const PORT = process.env.SERVER_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});