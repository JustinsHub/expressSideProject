const db = require('../db')
const ExpressError = require('../expressError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {BCRYPT_WORK_FACTOR, SECRET_KEY} = require('../config')

class User {
    constructor(id, firstName, lastName, username, password){
        this.id = id,
        this.firstName = firstName,
        this.lastName = lastName,
        this.username = username,
        this.password = password
    }
    static async getAll(){
        const results = await db.query(`SELECT id, username, first_name AS "firstName", last_name AS "lastName" FROM users`) //Has to match database and "AS" to match the user class this.
        const users = results.rows.map(u => new User(u.id, u.firstName, u.lastName, u.username, u.password))
        return users
    }
    static async getUserId(user_id){
        const result = await db.query(`SELECT id, username, first_name AS "firstName", last_name AS "lastName" FROM users WHERE id=$1`, [user_id])
        const u = result.rows[0]
        if(u === undefined){
            throw new ExpressError('Invalid user', 404)
        }
        return new User(u.id ,u.firstName, u.lastName, u.username)
    }

    static async register(first, last, user, pw){
        const hashPassword = await bcrypt.hash(pw, BCRYPT_WORK_FACTOR)
        const result = await db.query(`INSERT INTO users (first_name, last_name, username, password) 
                                    VALUES ($1,$2,$3,$4) RETURNING username`, [first, last, user, hashPassword])
        const newUser = result.rows[0]
        if(newUser){
        const token = jwt.sign({newUser: newUser.id}, SECRET_KEY)
        return new User(newUser)
        }
    }

    static async login(username, password){
        if(!username || !password ){
            throw new ExpressError('Username/Password required', 404)
        }
        const result = await db.query(`SELECT id, username, password FROM users WHERE username=$1`, [username]) // Looks for username in DB to login
        const user = result.rows[0]
        if(user){
            if(await bcrypt.compare(password, user.password)){
                const token = jwt.sign({user: user.id}, SECRET_KEY)
                return {message: `Welcome ${username}`, token}
            }
        }
    }
    async save(){
        await db.query(`UPDATE users SET first_name=$1, last_name=$2, username=$3, password=$4 WHERE id=$5`,
                        [this.firstName, this.lastName, this.username, this.password, this.id])
        
    }
    async delete(){
        if(this.id === undefined){
            throw new ExpressError('Invalid User', 404)
        }
        await db.query(`DELETE FROM users WHERE id=$1`, [this.id])
    }
}

module.exports = User;