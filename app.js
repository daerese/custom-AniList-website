const express = require('express');
const cookieSession = require('cookie-session');
const dotenv = require('dotenv').config();
const path = require('path');
const hbs = require('hbs');

const app = express();




const {
    PORT = 3001,
} = process.env


/*******************
 * * Setup the server
 *******************/

// Set up requests to be in JSON format
app.use(express.json())
app.use(express.urlencoded({extended: true}))


// Serve our static files
publicPath = path.join(__dirname, 'public')

app.use(express.static(publicPath))

// Setup the view engine
app.set('view engine', 'hbs')

// TODO: Maybe add a cookie. MAYBE


// * HBS partials setup 
const partialsPath = path.join(__dirname, 'views/partials')
console.log(partialsPath)

hbs.registerPartials(partialsPath)

// Expose our app to hbs so we can use locals
hbs.localsAsTemplateData(app)

// app.use((req, res, next) => {
//     console.log('Middleware called')


//     // * Reviews of each anime are saved in app locals because I will access 
//     // * Specific reviews across different req/res cycles. It should be global.
//     // * locals.reviews only exists when on a certain page.
//     if (req.app.locals.reviews) {
//         delete req.app.locals.reviews
//     }

//     // console.log(req.app.locals)
//     next()
// })

app.use(require('./routes'))


/***********************************/
app.listen(PORT, (err) => {
    console.log(`Listening on port ${PORT}`)
})
