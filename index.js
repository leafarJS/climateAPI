"use strict";
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const HOSTNAME = "127.0.0.1";
const PORT = process.env.PORT || 8000;

const app = express();

const newspapers = [
  {
    name: "cityam",
    address:
      "https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action/",
    base: "",
  },
  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/environment/climate-change",
    base: "",
  },
  {
    name: "guardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: "",
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/climate-change",
    base: "https://www.telegraph.co.uk",
  },
  {
    name: "nyt",
    address: "https://www.nytimes.com/international/section/climate",
    base: "",
  },
  {
    name: "latimes",
    address: "https://www.latimes.com/environment",
    base: "",
  },
  {
    name: "smh",
    address: "https://www.smh.com.au/environment/climate-change",
    base: "https://www.smh.com.au",
  },
  {
    name: "un",
    address: "https://www.un.org/climatechange",
    base: "",
  },
  {
    name: "bbc",
    address: "https://www.bbc.co.uk/news/science_and_environment",
    base: "https://www.bbc.co.uk",
  },
  {
    name: "es",
    address: "https://www.standard.co.uk/topic/climate-change",
    base: "https://www.standard.co.uk",
  },
  {
    name: "sun",
    address: "https://www.thesun.co.uk/topic/climate-change-environment/",
    base: "",
  },
  {
    name: "dm",
    address:
      "https://www.dailymail.co.uk/news/climate_change_global_warming/index.html",
    base: "",
  },
  {
    name: "nyp",
    address: "https://nypost.com/tag/climate-change/",
    base: "",
  },
];

const _Articles = [];

newspapers.forEach((news) => {
  axios
    .get(news.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      $("a:contains(climate)", html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        _Articles.push({
          title: title,
          url: newspapers.base + url,
          source: newspapers.name,
        });
      });
    })
    .catch((err) => console.log(err.message));
});

app.get("/", (req, res) => {
  res.json("Bienvenidos a mi primera API REST sobre el clima");
});
app.get("/news", (req, res) => {
  res.json(_Articles);
});
app.get("/news/:newspapersId", async (req, res) => {
  //console.log(req.params.newspapersId);
  const newspaperId = await req.params.newspapersId;
  const newspaperAddrees = await newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].address;
  const newspaperBase = await newspapers.filter(
    (news) => news.name == newspaperId
  )[0].base;
  //console.log(newspaperAddrees);
  axios
    .get(newspaperAddrees)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const especificArticles = [];
      $("a:contains(climate)", html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        especificArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperId,
        });
      });
      res.json(especificArticles);
    })
    .catch((err) => console.log(err.message));
});
app.listen(PORT, HOSTNAME, () => {
  console.log(`El servidor se está ejecutando en http://${HOSTNAME}:${PORT}/`);
});
