const router = require('express').Router();


const hbs = require('hbs');

// const fetch = require('node-fetch')
const fetch = require('node-fetch')
const queries = require('../graphql-queries')

// console.log(queries.animeCards)

// Simple fetch for anime information
// TODO: Put your queries and fetches that use the queries in a module



const url = 'https://graphql.anilist.co';

// const options = {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//     },
//     body: JSON.stringify({
//         query: queries.animeCards.seasonFilter, //insert query
//         // variables = //insert variables if necessary
//     })
// }


// * Utility functions
const getReviewDate = (unixTime) => {
    
    // Convert to milliseconds. The JS Date object can then convert milliseconds into a date.
    // * UnixTime is specified as the amount of seconds that passed since the beginning 
    // * of unix epochf (January 1st, 1970)
    const milliseconds = unixTime * 1000

    const reviewDate = (new Date(milliseconds)).toLocaleString()

    return reviewDate.split(',')[0]
}

const getOptions = (query, variables=null) => {
    
    const body = {query: query}

    // console.log('BODY', body)

    if (variables) {
        body.variables = variables
    }
    
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(body)
    }

    // const options = {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //     },
    //     body: JSON.stringify({ 
    //         query: query
    //      })
    // }

    return options
    
}

// * Function to get the anime information
const getAnime = async (query, variables=null) => {

    const fetchOptions = getOptions(query, variables)

    // console.log('OPTIONS: ', fetchOptions)
    // * Using fetch
    const data = await fetch(url, fetchOptions)
        .then(res => res.json())
        .then(json => {
            // console.log(Object.values(json)[0])
            return Object.values(json)[0]
        })
        .catch(err => console.error('error:' + err))

    return data
}

// Index page route
router.route('/').get( async (req, res) => {


    try {
        const seasonFilter = await getAnime(queries.animeCards.seasonFilter)
    
        const popularityFilter = await getAnime(queries.animeCards.popularityFilter)
    
        const trendingFilter = await getAnime(queries.animeCards.trendingFilter)
    
        const genres = await getAnime(queries.general.allGenreTags);
    
        // console.log(genres)
    
        res.locals.queryData = {
            seasonFilter: seasonFilter.Page.media,
            popularityFilter: popularityFilter.Page.media,
            trendingFilter: trendingFilter.Page.media,
            genres: genres
        }

        // console.log(genres.GenreCollection)
    
        res.render('home')
    } catch (err) {
        console.log(err)
    }
})

router.route('/anime/:id').get( async (req, res) => {

    try {
        // ? According to the AniList Documentation, variables that we pass in for
        // ? a query have to be inside of an object. 
        const animeId = {
            id: req.params.id
        }
    
        const currAnime = await getAnime(queries.animePage, animeId)
    
        // console.log(currAnime.Media.reviews.edges)
        // console.log(currAnime.Media.recommendations.edges)

        // * Change the date of all the reviews to a readbale date
        for (let review of currAnime.Media.reviews.edges) {

            const newDate = getReviewDate(review.node.createdAt)
            review.node.createdAt = newDate
            console.log(review.node.createdAt)
        }
    
        res.locals.queryData = {
            currAnime: currAnime.Media
        }

        req.app.locals.reviews = currAnime.Media.reviews.edges

        console.log(req.app.locals)

        res.render('anime')

    } catch(err) {
        console.log(err);
    }
    
})


router.route('/review/:id').get( async (req, res) => {
    

    // const reviewId = req.params.id
    // for (let review of req.app.locals.reviews) {
    //     if (reviewId == review.node.id) {
    //         console.log('Review found', review.id)
    //     }
    // }

    const reviewId = {
        id: req.params.id
    }

    const review = await getAnime(queries.general.review, reviewId)

    console.log(review)

    res.status(201).json(review)
})


router.route('/search/anime?:search').get( async (req, res) => {

    try {

        // * Apply the search within your search query. Pass the returened search into 
        // * locals

        const search = {
            search: req.query.search
        }

        const searchResults = await getAnime(queries.general.search, search);

        // console.log(searchResults.Page.media)

        res.locals.queryData = {
            results: searchResults.Page.media
        }

        res.render('search')
    }
    catch(error) {
        console.log(error)
    }

})


//Other routes here
router.route('*').get(function(req, res){
    res.send('Sorry, this is wrong URL.');
});

module.exports = router