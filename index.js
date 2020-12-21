// Conexión con la base de datos: challenge-movies
const CONNECTION_STRING = 'mongodb+srv://clasemongo:Guayerd@cluster0.jnrhw.mongodb.net/movies-challenge?retryWrites=true&w=majority';

const PORT = '4000'; // http://localhost:4000
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const fetch = require('node-fetch');
const Search = require('./Models/Search');
const Response = require('./Models/Response');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('short'));


// GET de movies
app.get('/search/movies/:movie', (req, res)=>{
    const MOVIE = req.params.movie;
    //console.log(MOVIE);
    Response.find({texto: MOVIE})
    .then((responseFinded) =>{
        if(responseFinded){
            console.log("Respuesta: ", responseFinded);
            responseFinded.forEach((resp)=>{
                        res.status(200).send(resp)
                        let search = new Search({
                            fecha: new Date(),
                            texto: MOVIE,
                            responseFrom: "CACHÉ"
                        })
                        // Guardo el texto de búsqueda
                        search.save().then((searchSaved)=>{
                            console.log("Search save: ", searchSaved);
                        })
                    })
        }
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=051f0c798246428b4e7f3c65da9360a2&language=en-US&query=${encodeURI(MOVIE)}&page=1&include_adult=false`)
            .then((res) => { return res.json();  })
            .then((json) => {
                const RESULTS = json.results;

                // Búsqueda
                let search = new Search({
                    fecha: new Date(),
                    texto: MOVIE,
                    responseFrom: "API"
                })
                // Guardo el texto de búsqueda
                search.save().then((searchSaved)=>{
                    console.log("Search save: ", searchSaved);
                })

                //Resultado
                let response = new Response({
                    result: RESULTS,
                    texto: MOVIE
                })
                response.save().then((responseSaved) => {
                    console.log("Response save: ", responseSaved);
                })

                if(json) return res.status(200).send(RESULTS);})
    }).catch((err) => {
        res.status(500).send({ error: err });
    })
        
})



//Levanto la applicacion luego de realizar la conexion de mongoose a Atlas
mongoose.connect(CONNECTION_STRING, (err) => {
    if(err){
        console.err(err.message);
    }else{
        console.log('Established Connection');
        app.listen(PORT, ()=>{
            console.log(`Server App Listening at http://localhost:${PORT}`);
        })
    }
})