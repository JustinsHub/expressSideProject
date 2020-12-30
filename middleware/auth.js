const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require('../config')
const ExpressError = require('../expressError')

const authenticateJWT = (req, res, next)=>{
    try{
    const token = req.body._token //input token outcome in body for it to be verified
    const payload = jwt.verify(token, SECRET_KEY)
    req.user = payload //stores payload in this object to reuse in other apis/requests
    console.log('VALID TOKEN HERE')
    return next()
    }catch(e){
        return next() //moves on if there is no token with no error
    }
}

const authorizedUser = (req, res, next)=>{
    if(!req.user){
        const error = new ExpressError('Unauthorized', 401)
        return next(error)
    }else{
    return next()
    }
}

module.exports = {authenticateJWT, authorizedUser}