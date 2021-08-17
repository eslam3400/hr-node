const express = require('express')
const cookie = require('cookie-parser')
const path = require('path')
const fileUpload = require('express-fileupload')
const app = express()
const port = process.env.PORT || 3000
const router = require("./src/Routes/router")
/*
  Setup the view engine to the ejs
*/
app.set('view engine', 'ejs')
/*
  by default we can't access a file from the front end for security purposes
  so when we wanna get files to the front-end we need to make them static like that
*/
app.use(express.static(path.join(__dirname, 'public')))
/**
 * by using this i can access data from post reqest with the body object
 */
app.use(express.urlencoded({ extended: false }))
/**
 * by using this i can access cookies data from cookies object
 */
app.use(cookie("DevTik"))
/**
 * by using this i can access files from files object
 */
app.use(fileUpload())
/**
 * Routing
 */
app.use(router)

app.listen(port, () => console.log(`app listening at http://localhost:${port}`))