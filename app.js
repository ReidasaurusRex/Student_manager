var express = require("express"),
    app = express(),
    redis = require("redis"),
    client = redis.createClient(),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser");

// Middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// JS/CSS/Imgs
app.use(express.static(__dirname + '/public'));

// Index
app.get("/", function(req, res) {
  client.lrange("students", 0, -1, function(err,students) {
    res.render("index", {students: students});
  });
});

// Post to create a student
app.post("/create", function(req, res) {
  var task = req.body.task;
  client.rpush("students", task);
  res.redirect("/");
});

// Delete all students
app.delete("/remove", function(req, res) {
  client.del("students");
  res.redirect("/");
});

// Server start
app.listen(3000, function(){
  console.log("Server starting on port 3000");
});
