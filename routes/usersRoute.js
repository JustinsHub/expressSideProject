const express = require('express')
const router = express.Router()
const db = require('../db')
const User = require('../models/users')

router.get('/', async(req,res,next)=>{
    try{
    const users = await User.getAll()
    return res.json(users)
    }catch(e){
        next(e)
    }
})

router.get('/:id', async(req,res,next)=>{
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

module.exports = router