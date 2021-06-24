const config = {
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
    spotifyRedirectUri: process.env.SPOTIFY_REDIRECT_URI,
    auth0Domain : '3du4rd.us.auth0.com',
    auth0ClientId : '2EVixTN8OpUVEkJxv4KjEYMusZoPczoQ',
    auth0ApiAudience : 'https://elc-node-app.herokuapp.com/api',
    auth0RedirectUri : 'http://localhost:3001/callback'
  }
  
  module.exports = { config }