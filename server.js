const express = require('express')
const morgan = require('morgan')
const MOVIEDEX = require('./movies-data-small.json')

const app = express()

app.use(morgan('dev'))

// app.use((req, res) => {
//     res.send('Hello, Andre!')
// })

app.get('/movie', function handleGetMovie(req, res) {
    let response = MOVIEDEX

    //filter movies by GENRE if said parameter is present
    if (req.query.genre) {
        response = response.filter(function(response){
            return response.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        })
    }

    //filter movies by COUNTRY if said parameter is present
    if (req.query.country) {
        response = response.filter(function(response){
            return response.country.toLowerCase().includes(req.query.country.toLowerCase())
        })
    }

    //filter movies by AVE VOTE if said parameter is present
    if (req.query.avg_vote) {
        response = response.filter(function(response){
            return response.avg_vote >= req.query.avg_vote
        })
    }

    res.json(response)
})


const PORT = 8000

app.listen(PORT, () => {
    console.log('Server listening at http://localhost:${PORT}')
})