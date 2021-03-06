const express = require('express')
const router = new express.Router()
const db = require('../db')
const ExpressError = require('../expressError')
const User = require('../models/users')
const {authorizedUser} = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require('../config')


router.get('/', async(req,res,next)=>{
    try{
    const users = await User.getAll()
    return res.json(users)
    }catch(e){
        next(e)
    }
})

router.get('/authorized', authorizedUser, (req, res, next)=>{
    try{
    return res.json('Welcome user. You made it.')
    }catch(e){
        next(e)
    }
})

router.get('/:id', async(req,res,next)=>{ //:id must be after any other /path names so it wont conflict unless it has another ex: /:id/edit
    try{
    const id = req.params.id
    const user = await User.getUserId(id)
    return res.json(user)
    }catch(e){
        next(e)
    }
})


router.post('/register', async(req,res,next)=>{
    try{
    const {first_name, last_name, username, password} = req.body
    const newUser = await User.register(first_name, last_name, username, password)
    return res.status(201).json(newUser)
    }catch(e){
        next(e)
    }
})

router.post('/login', async(req, res, next)=>{
    try{
        const {username, password} = req.body
        const user = await User.login(username, password)
        const token = jwt.sign({user}, SECRET_KEY)
        return res.json({token})
    }catch(e){
        next(e)
    }
})

router.patch('/:id/edit', async(req,res,next)=>{
    try{
    const user = await User.getUserId(req.params.id) //When editing, none must be empty if labeled NOT NULL
    user.firstName = req.body.first_name //user must be constructor name and req.body must be db name
    user.lastName = req.body.last_name
    user.username = req.body.username
    user.password = req.body.password
    await user.save()
    return res.json(user)
    }catch(e){
        next(e)
    }
})

router.delete('/:id', async(req,res,next)=>{
    try{
    const user = await User.getUserId(req.params.id)
    await user.delete()
    return res.json({user: "Deleted"})
    }catch(e){
        next(e)
    }
})

module.exports = router