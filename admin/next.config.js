const dotEnvResult = require('dotenv').config()

if (dotEnvResult.error) {
  throw dotEnvResult.error
}

module.exports = {
  env: {
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
    AUTH0_DOMAIN : process.env.AUTH0_DOMAIN,
    AUTH0_CLIENT_ID : process.env.AUTH0_CLIENT_ID,
    AUTH0_API_AUDIENCE : process.env.AUTH0_API_AUDIENCE,
    AUTH0_REDIRECT_URI : process.env.AUTH0_REDIRECT_URI
  }
}