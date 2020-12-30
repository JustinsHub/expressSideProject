process.env.NODE_ENV = "test"
const request = require('supertest')
const app = require('../app')
const db = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {BCRYPT_WORK_FACTOR, SECRET_KEY} = require('../config')

let testUsers;
let testUserToken;

beforeEach(async ()=>{
    const hashedPw = bcrypt.hash('password', BCRYPT_WORK_FACTOR)
    const user = await db.query(`INSERT INTO users (first_name, last_name, username, password) 
                                VALUES ('Dyson', 'Byson', 'Lyson', '${hashedPw}') RETURNING id, username, first_name, last_name`)
    testUsers = user.rows[0]
    testUserToken = jwt.sign(testUsers.id, SECRET_KEY)
})

afterEach(async ()=>{
    await db.query('DELETE FROM users')
})

afterAll(async ()=>{
    await db.end()
})

//User Routes
describe('GET /', ()=>{
    test('Get all users', async()=>{
        const res = await request(app).get('/')
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual([{
            "id": expect.any(Number),
            "firstName": "Dyson",
            "lastName": "Byson",
            "username": "Lyson"
        }])
    })
})

describe('GET /authorized', ()=>{
    test('access route', async()=>{
        const res = await request(app).get('/authorized').send({_token:testUserToken})
        expect(res.statusCode).toBe(200)
    })
})

describe('GET /:id',()=>{
    test('get a single user by id', async()=>{
        const res = await request(app).get(`/${testUsers.id}`)
        expect(res.statusCode).toBe(200)
    })
})

describe('POST /register', ()=>{
    test('Create a new user', async()=>{
        const res = await request(app).post('/register').send({first_name:"Bixter", last_name:"Tixter", username:"Play", password:"isithashed?"})
        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({"id":{"id":expect.any(Number)}})
    })
})

describe('POST /login', ()=>{
    test('login a user', async()=>{
        const res = await request(app).post('/login').send({username:"Lyson", password:"password"})
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(expect.objectContaining({token:expect.any(String)}))
    })
    test('invalid input',async()=>{
        const res = await request(app).post('/login').send({username:"Lyso", password:"passwo"}) //must fix 200 on username with wrong password
        expect(res.statusCode).toBe(404)
    })
})