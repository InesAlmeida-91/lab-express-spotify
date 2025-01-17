require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/artist-search', (req, res) => {
    spotifyApi.searchArtists(req.query.artistName)//(req.query.variable)
  
  .then(data => {
    console.log('The received data from the API: ', data.body);
    res.render('artist-search-results',  { searchedArtists: data.body.artists.items })
    })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(artistAlbums => {
    res.render('albums', {albums: artistAlbums.body.items})
  })
  .catch(err => console.log('The error while searching albums occurred: ', err));
});

app.get('/albums/:id/tracks', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.id)
.then(albumTracks => {
  res.render('tracks', {tracks: albumTracks.body.items})
})
.catch(err => console.log('The error while searching albums occurred: ', err));
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
