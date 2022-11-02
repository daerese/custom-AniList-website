const router = require('express').Router();


const hbs = require('hbs');

// const fetch = require('node-fetch')
const fetch = require('node-fetch')
const queries = require('../graphql-queries')

// console.log(queries.animeCards)

// Simple fetch for anime information
// TODO: Put your queries and fetches that use the queries in a module



const url = 'https://graphql.anilist.co';

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify({
        query: queries.animeCards.seasonFilter, //insert query
        // variables = //insert variables if necessary
    })
}

const getOptions = (query) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            // query: queries.animeCards.seasonFilter, //insert query
            // variables = //insert variables if necessary
        })
    }

    return options
    
}

// * Function to get the anime information
const getAnime = async (query) => {

    const fetchOptions = getOptions(query)
    // * Using fetch
    const data = await fetch(url, fetchOptions)
        .then(res => res.json())
        .then(json => {
            return Object.values(json)[0]
        })
        .catch(err => console.error('error:' + err))

    return data
}

// Index page route
router.route('/').get( async (req, res) => {

    const seasonFilter = await getAnime(queries.animeCards.seasonFilter)

    const popularityFilter = await getAnime(queries.animeCards.popularityFilter)

    const trendingFilter = await getAnime(queries.animeCards.trendingFilter)

    console.log(popularityFilter.Page.media)

    res.locals.queryData = {
        seasonFilter: seasonFilter.Page.media,
        popularityFilter: popularityFilter.Page.media,
        trendingFilter: trendingFilter.Page.media
    }

    res.render('home')
})



module.exports = router