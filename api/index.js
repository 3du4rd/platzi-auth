const express = require('express');
//const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { config } = require('./config');
const cors = require("cors");

const app = express();

//app.use(bodyParser.json());
app.use(express.json());
//app.use(cors());
//const corsOptions = { origin: "http://example.com" };
//app.use(cors(corsOptions)); 

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

const server = app.listen(5000, function(){
    console.log(`Listening http://localhost:${server.address().port}`);
})