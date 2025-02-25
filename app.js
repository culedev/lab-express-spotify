require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );
// Our routes go here:

app.get("/", (req, res, next) => {
  res.render("index.hbs");
});

app.get("/artist-search", (req, res, next) => {
  const { search } = req.query;
  spotifyApi
    .searchArtists(search)
    .then((data) => {
      const result = data.body.artists.items;
      // console.log(artists);
      res.render("artist-search-results", {
        result,
      });
    })
    .catch((err) => next(err));
});

app.get("/albums/:artistId", (req, res, next) => {
  const { artistId } = req.params;

  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      const albums = data.body.items;
      res.render("albums.hbs", {
        albums,
      });
    })
    .catch((err) => next(err));
});



app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
