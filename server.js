require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIEDEX = require('./movies-data-small.json')

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req,res,next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken){
        return res.status(401).json({error:'Unauthorized request'})
    }
    // move to next piece of middleware
    next()
})

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

// 4 parameters in middleware, express knows to treat this as error handler
app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
  })

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.info(`Server listening at http://localhost:${PORT}`)
})