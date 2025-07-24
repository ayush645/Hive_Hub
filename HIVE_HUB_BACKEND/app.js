require("dotenv").config();
const express = require('express');
var http = require("http");
var https = require("https");
const cors = require("cors");
const Routes = require("./routes/index");
const connection = require("./config/db");
let debug = require("debug")("mmnt:server");
const path = require('path');
const fs = require('fs');
const app = express();

app.use((req, res, next) => {
  res.append("Access-Control-Expose-Headers", "x-total, x-total-pages");
  next();
});
const constant = require("./messages/message");
app.use(express.json());

const logoDir = path.join(__dirname, './uploads/logos');
const productrDir = path.join(__dirname, './uploads/products');

if (!fs.existsSync(logoDir)) {
  fs.mkdirSync(logoDir, { recursive: true });
}
if(!fs.existsSync(productrDir)) {
  fs.mkdirSync(productrDir, { recursive: true });
}

app.use(cors());
app.use(function (req, res, next) {
  if (req.headers && req.headers.lang && req.headers.lang == "ar") {
    process.lang = constant.MESSAGES.arr;
  }
  if (req.headers && req.headers.lang && req.headers.lang == "fr") {
    process.lang = constant.MESSAGES.fr;
  } else {
    process.lang = constant.MESSAGES.en;
  }
  next();
});

app.use("/api/hivehub", Routes);

app.use("/", function (req, res) {
  res.status(400).send({
    code: 400,
    status: "success",
    message: "Parcel Pending API",
    data: {},
  });
});

var port = normalizePort(process.env.PORT || "16767");
app.set("port", port);


let server; 

if (process.env.NODE_ENV == "dev") {
  console.log("inside dev",process.env.NODE_ENV)

  const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
  };
     server = https.createServer(options,app);
     console.log(`Running on HTTPS`);


} else {
server = http.createServer(app);
console.log(`Running on HTTP`);
}

server.listen(port, async () => {
  console.log(`Node env :${process.env.NODE_ENV}.`);
  console.log(`Running on port: ${port}.`);
  await connection.mongoDbconnection();
});
server.on("error", onError);
server.on("listening", onListening);
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}


/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}