const express = require('express')
const morgan = require('morgan')
const ExpressError = require('./expressError')
const userRoute = require('./routes/usersRoute')

const app = express()

//MIDDLEWARE
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//ROUTES
app.use('/', userRoute)


//error handle when page is invalid/missing
app.use((req,res,next)=>{
    const e = new ExpressError("Page Not Found", 404)
    next(e)
})

//general error handling
app.use((error,req, res, next)=>{
    let status = error.status || 500
    let message = error.message
    return res.status(status).json({error:{message, status}})
})



module.exports = app