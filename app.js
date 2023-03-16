const path = require("path");

const debug = require("debug")("weblog-project");
const fileUpload = require("express-fileupload");
const express = require("express");
const mongoose = require("mongoose");
const expressLayout = require("express-ejs-layouts");
const passport = require("passport");
const dotEnv = require("dotenv");
const morgan = require("morgan");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const connectDB = require("./config/db");
const winston = require("./config/winston");

//* Load Config
dotEnv.config({ path: "./config/config.env" });

//* Database connection
connectDB();
debug("Connected To Database");

//* Passport Configuration
require("./config/passport");

const app = express();

//* Logging
if (process.env.NODE_ENV === "development") {
  debug("Morgan Enabled");
  app.use(morgan("combined", { stream: winston.stream }));
}

//* View Engine
app.use(expressLayout);
app.set("view engine", "ejs");
app.set("layout", "./layouts/mainLayout");
app.set("views", "views");

//* BodyPaser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//* File Upload Middleware
app.use(fileUpload());

//* Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    unset: "destroy",
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//* Passport
app.use(passport.initialize());
app.use(passport.session());

//* Flash
app.use(flash()); //req.flash

//* Static Folder
app.use(express.static(path.join(__dirname, "public")));

//* Routes
app.use("/", require("./routes/blog"));
app.use("/users", require("./routes/users"));
app.use("/dashboard", require("./routes/dashboard"));

//* 404 Page
app.use(require("./controllers/errorController").get404);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
