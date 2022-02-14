const PORT = 8000;
const axios = require("axios").default;
const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();

app.use(cors());

app.get("/word", (req, res) => {
    var options = {
      method: 'GET',
      url: 'https://random-words5.p.rapidapi.com/getMultipleRandom',
      params: {count: '5', wordLength: '5'},
      headers: {
        'x-rapidapi-host': 'random-words5.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPID_API_KEY
      }
    };
    
    axios.request(options).then((response) => {
        res.json(response.data[0]);
    }).catch((error) =>{
        console.error(error);
    });
});

app.get('/check', (req, res) => {
    var options = {
        method: 'GET',
        url: 'https://twinword-word-graph-dictionary.p.rapidapi.com/association/',
        params: {entry: req.query.word},
        headers: {
            'x-rapidapi-host': 'twinword-word-graph-dictionary.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPID_API_KEY
        }
    };

    // I can't afford to use the API key for this, so I'm just going to send the word back lol
    // axios.request(options).then((response) => {
    //     res.json(response.data.result_msg);
    // }).catch((error) => {
    //     console.error(error);
    // });
    res.json(req.query.word);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
