const express = require("express");
const path = require("path");
const request = require('request');
const querystring = require('querystring');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const generateRandomString = require('./utils/generateRandomString');
const encodeBasic = require('./utils/encodeBasic');
const scopesArray = require('./utils/scopesArray');

const playlistMocks = require('./utils/mocks/playlist');
const { config } = require('./config');


const app = express();

// static files
app.use("/static", express.static(path.join(__dirname, "public")));

// -> Middlewares
app.use(cors());
app.use(cookieParser());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// -> Fucntions
function getUserInfo(accessToken) {
  if (!accessToken) {
    return Promise.resolve(null);
  }

  const options = {
    url: "https://api.spotify.com/v1/me",
    headers: { Authorization: `Bearer ${accessToken}` },
    json: true
  };

  return new Promise((resolve, reject) => {
    request.get(options, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        reject(error);
      }

      resolve(body);
    });
  });
}

function getUserPlaylists(accessToken, userId) {
  if (!accessToken || !userId) {
    return Promise.resolve(null);
  }

  const options = {
    url: `https://api.spotify.com/v1/users/${userId}/playlists`,
    headers: { Authorization: `Bearer ${accessToken}` },
    json: true
  };

  return new Promise((resolve, reject) => {
    request.get(options, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        reject(error);
      }

      resolve(body);
    });
  });
}

// routes
app.get('/', async function(req, res, next) {
  const { access_token: accessToken } = req.cookies;

  try {
    const userInfo = await getUserInfo(accessToken);
    res.render("playlists", {
      userInfo,
      isHome: true,
      playlists: { items: playlistMocks }
    });
  } catch (error) {
    next(error);
  }
});

app.get('/playlists', async function(req, res, next) {
  
  const { access_token: accessToken } = req.cookies;
  if (!accessToken) {
    return res.redirect("/");
  }

  try {
    const userInfo = await getUserInfo(accessToken);
    const userPlaylists = await getUserPlaylists(accessToken, userInfo.id);

    res.render("playlists", { userInfo, playlists: userPlaylists });
  } catch (error) {
    next(error);
  }
});

app.get('/login', function(req, res, next) {
  const state = generateRandomString(16);
  const queryString = querystring.stringify({
    response_type: "code",
    client_id: config.spotifyClientId,
    scope: scopesArray.join(" "),
    redirect_uri: config.spotifyRedirectUri,
    state: state
  });
  res.cookie("auth_state", state, { httpOnly: true });
  res.redirect(`https://accounts.spotify.com/authorize?${queryString}`);
})

app.get('/callback', function(req, res, next) {
  const { code, state } = req.query;
  const { auth_state } = req.cookies;

  if (state === null || state !== auth_state){
    next( new Error("The state doesn't match"));
  }
  res.clearCookie("auth_state");

  console.log(`config.spotifyClientId ${config.spotifyClientId}`);
  console.log(`config.spotifyClientSecret ${config.spotifyClientSecret}`);

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form:{
      code: code,
      redirect_uri: config.spotifyRedirectUri,
      grant_type: "authorization_code"
    },
    headers:{
      Authorization: `Basic ${encodeBasic(
        config.spotifyClientId,
        config.spotifyClientSecret
      )}`
    },
    json:true
  };

  request.post(authOptions, function(error, response, body) {
    if (error || response.statusCode!==200){
      next(new Error("The Token is invalid"));
    }
    res.cookie("access_token", body.access_token, { httpOnly:true})
    res.redirect("/playlists");
  });
});

// server
const server = app.listen(3000, function() {
  console.log(`Listening http://localhost:${server.address().port}`);
});