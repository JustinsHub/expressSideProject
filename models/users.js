const db = require('../db')
const ExpressError = require('../expressError')

class User {
    constructor(id, firstName, lastName, username, password){
        this.id = id,
        this.firstName = firstName,
        this.lastName = lastName,
        this.username = username,
        this.password = password
    }
    static async getAll(){
        const results = await db.query(`SELECT * FROM users`)
        const users = results.rows.map(u => new User(u.id, u.firstName, u.lastName, u.username, u.password))
        return users
    }
    static async getUserId(user_id){
        const result = await db.query(`SELECT username, password, first_name, last_name WHERE id=$1 RETURNING username`, [user_id])
        const {id, firstName, lastName, username, password}= result.rows[0]
        if(result.rows.length === 0){
            throw new ExpressError('Invalid user input', 404)
        }
        return new User(id, firstName, lastName, username, password)
    }
    async save(){
        if(this.id === undefined){
        const result = await db.query(`INSERT INTO users (first_name, last_name, username, password, email) 
                                VALUES ($1,$2,$3,$4,$5) RETURNING username, first_name, email`,
                                [this.firstName, this.lastName, this.username, this.password, this.email])
        this.id = result.rows[0].id
        }else {
            await db.query(`UPDATE users SET first_name=$1, last_name=$2, username=$3, password=$4, email=$5`,
                            [this.firstName, this.lastName, this.username, this.password, this.email])
        }
    }
}

module.exports = User;