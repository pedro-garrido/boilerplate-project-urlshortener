require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

const urls = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", async (req, res) => {
  const bodyURL = await req.body.url;
  if (
    !bodyURL.match(
      /(((http|https):\/\/))(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    )
  ) {
    res.json({ error: "Invalid URL" });
  } else {
    const url = {
      original_url: bodyURL,
      short_url: Math.floor(Math.random() * 1000000),
    };
    urls.push(url);
    res.json(url);
  }
});

app.get("/api/shorturl/:short_url?", async (req, res) => {
  const short_url = req.params.short_url;
  let found = await urls.find(url => url.short_url == short_url);
  if (!found){
    res.json({ error: "No URL found" });
  }
  else{
    res.redirect(found.original_url);
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
