const express = require('express')
const router = express.Router()
const db = require('../db')
const { getUserId } = require('../models/users')
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
    const {id} = req.params
    const user = await getUserId(id)
    return res.json(user)
    }catch(e){
        next(e)
    }
})

router.post('/register', async(req,res,next)=>{
    const {first_name, last_name, username, password, email} = req.body
    const newUser = new User(first_name, last_name, username, password, email)
    newUser.save()
    return res.status(201).json(newUser)
})

module.exports = router