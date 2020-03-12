// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function (req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function () {
        res.redirect(307, "/api/login");
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  // events routes
  app.get("/api/events", (req, res) => {
    db.Event.findAll({
    }).then((dbEvent) => {
      res.json(dbEvent);
    });
  });

  // get by ID
  app.get("/api/events/:id", (req, res) => {
    db.Event.findOne({
      where: {
        id: req.params.id
      }
    }).then((dbEvent) => {
      res.json(dbEvent);
    });
  });

  // get by title
  app.get("/api/events/:title", (req, res) => {
    db.Event.findOne({
      where: {
        title: req.params.title
      }
    }).then((dbEvent) => {
      res.json(dbEvent);
    });
  });

  // get by category
  app.get("/api/events/:category", (req, res) => {
    db.Event.findOne({
      where: {
        category: req.params.category
      }
    }).then((dbEvent) => {
      res.json(dbEvent);
    });
  });

  // get by location
  app.get("/api/events/:location", (req, res) => {
    db.Event.findOne({
      where: {
        location: req.params.location
      }
    }).then((dbEvent) => {
      res.json(dbEvent);
    });
  });

  app.post("/api/events", (req, res) => {
    console.log("hit post route");
    db.Event.create(req.body).then((dbEvent) => {
      res.json(dbEvent);
    });
  });

  app.put("/api/events/:id", (req, res) => {

  });

  app.delete("/api/events/:id", (req, res) => {
    db.Event.destroy({
      where: {
        id: req.params.id
      }
    }).then((dbEvent) => {
      res.json(dbEvent);
    });
  });
};
