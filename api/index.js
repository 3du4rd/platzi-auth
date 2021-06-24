const express = require('express');
//const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const request = require('request');

const { config } = require('./config');
const cors = require("cors");
const encodeBasic = require('./utils/encodeBasic');


const app = express();

//app.use(bodyParser.json());
app.use(express.json());
//app.use(cors());
//const corsOptions = { origin: "http://example.com" };
//app.use(cors(corsOptions)); 

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

app.post("/api/auth/token", function(req, res){
    const { email, username, name } = req.body;
    console.log(config.authJwtSecret);
    const token = jwt.sign( { sub: username, email, name},config.authJwtSecret);
    res.json({ access_token: token});
});

app.get("/api/auth/verify",function(req,res,next){
    const { access_token } = req.query;
    try{
        const decoded = jwt.verify(access_token, config.authJwtSecret);
        res.json({ message: "the access token is valid", username: decoded.sub})
    }catch(err){
        next(err);
    }
});

app.get('/api/playlists', async function(req,res,next) {
    const { userId } = req.query;

    const authOptions = {
        url: "https://accounts.spotify.com/api/token",
        form:{     
          grant_type: "client_credentials"
        },
        headers:{
          Authorization: `Basic ${encodeBasic(
            config.spotifyClientId,
            config.spotifyClientSecret
          )}`
        },
        json:true
    };
    request.post(authOptions, async function(error, response, body) {
        if (error || response.statusCode!==200){
          next(error);
        }
        const accessToken = body.access_token;
        const userPlaylist = await getUserPlaylists(accessToken, userId);
        res.json( { playlists: userPlaylist });
      });
});

const server = app.listen(5000, function(){
    console.log(`Listening http://localhost:${server.address().port}`);
})