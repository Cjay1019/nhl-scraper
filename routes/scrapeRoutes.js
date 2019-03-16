const cheerio = require("cheerio");
const axios = require("axios");
const db = require("../models");
const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {
  db.Article.find({ saved: false })
    .then(function(dbArticle) {
      var hbsObject = {
        articles: dbArticle
      };
      res.render("index", hbsObject);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.get("/scrape", function(req, res) {
  axios.get("http://www.nhl.com/").then(function(response) {
    var $ = cheerio.load(response.data);

    $("h4.headline-link").each(function(i, element) {
      var result = {};
      result.title = $(this).text();
      result.link = $(this)
        .parent()
        .attr("href");
      result.preview = $(this)
        .next()
        .text();
      result.image = $(this)
        .closest("div.mixed-feed__item-header")
        .next()
        .find("img.img-responsive")
        .attr("data-src")
        .trim();
      db.Article.deleteMany({ saved: false }).then(function() {
        db.Article.create(result)
          .then(function() {
            res.end();
          })
          .catch(function(err) {
            console.log(err);
          });
      });
    });
  });
});

router.get("/articles", function(req, res) {
  db.Article.find({ saved: false })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.get("/saved", function(req, res) {
  db.Article.find({ saved: true })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { note: dbNote._id } },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.post("/save", function(req, res) {
  db.Article.findOne({ _id: req.body._id }, function(err, article) {
    article.saved = !article.saved;
    article.save();
  });
  res.end();
});

router.post("/delete", function(req, res) {
  db.Article.deleteOne({ _id: req.body._id }, function(err, article) {});
  res.end();
});

router.post("/deleteNote", function(req, res) {
  db.Note.deleteOne({ _id: req.body._id }, function(err, note) {});
  res.end();
});

module.exports = router;
