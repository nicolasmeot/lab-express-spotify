require('dotenv').config();

const express = require('express');
const hbs = require('hbs');


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res, next) => {
    res.render('homepage')
});

app.get('/artist-search', (req, res, next) => {
    const artistSearch = req.query;
    //res.send(artistSearch.artist);
    spotifyApi
        .searchArtists(artistSearch.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            //const artistSingle= data.body.artists.items[0];
            //res.render('artist-search-results',{artistSingle})
            const artistsArr = data.body.artists.items;
            res.render('artist-search-results', { artistsArr })
            console.log(artistsArr)
            console.log(artistsArr[0].images);
        })
        // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        .catch(err => console.log('The error while searching artists occurred: ', err));
    console.log(req.query);
});

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            //const artistSingle= data.body.artists.items[0];
            //res.render('artist-search-results',{artistSingle})
            const albumsArr = data.body.items;
            res.render('albums', { albumsArr })
        })
});

app.get('/albums/tracks/:albumId', (req, res, next) => {
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            //const artistSingle= data.body.artists.items[0];
            //res.render('artist-search-results',{artistSingle})
            const tracksArr = data.body.items;
            res.render('tracks', { tracksArr })
        })
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
