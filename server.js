require('dotenv').config()

const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb')
const app = express()
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=${process.env.DB_NAME}`
// const validator = require('express-validator')
// import { inlogSchema } from "./schema.js"

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  const bcrypt = require('bcrypt')
  const xss = require('xss')
  const saltRounds = 10

// Middleware
app.use(express.static('public'))

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.set('view engine', 'ejs')

console.log('Server gestart');

app.listen(process.env.PORT, () => {
    console.log(`Project Tech Data API listening on port ${process.env.PORT}`)
})

//foutmeldingen
let incorrect

// Routes

app.get('/', async (req,res) => {
  res.render('index')
})

app.get('/inloggen', async (req,res) => {
  res.render('inloggen', {incorrect})
})

app.post('/login', async (req,res) => {
  const db = client.db("muve")
  const coll = db.collection("users")
  const {email, password} = req.body

  const user = await coll.findOne({ email: email })
  bcrypt.compare(password, user.password).then(function(result) {
    if(result === true){
      res.redirect('/')
    } else {
      incorrect = "Uw gebruikersnaam of wachtwoord is incorrect."
      res.redirect('/inloggen')
    }
  })
})

app.get('/registreer', async (req, res) => {
  res.render('registreer')
})