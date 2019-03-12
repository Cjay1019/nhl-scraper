const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");

const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// Request Logs
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const routes = require("./routes/scrapeRoutes");
app.use(routes);

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/nhl_db", {
  useNewUrlParser: true
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
