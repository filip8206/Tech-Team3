require('dotenv').config()

const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb')
const app = express()
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=${process.env.DB_NAME}`
//import { bezoekerSchema } from "./schema.js"

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

client.connect();

// Middleware
app.use(express.static('public'))

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.set('view engine', 'ejs')

console.log('Server gestart');

app.listen(process.env.PORT, () => {
    console.log(`Project Tech Data API listening on port ${process.env.PORT}`)
})

// Routes

app.get('/', async (req,res) => {
  res.render('index')
})

app.get('/inloggen', async (req,res) => {
  let incorrect
  res.render('inloggen', incorrect)
})

app.post('/login', async (req,res) => {
  const db = client.db("DatabaseTechTest")
  const coll = db.collection("users")

  const user = await coll.findOne({
    username: req.body.username,
    password: req.body.password
  })

  // login checken
  if (user !== null){
    res.render('/')
  } else {
    // username and/or password incorrect
    incorrect = "Uw gebruikersnaam of wachtwoord is incorrect."
    res.render('/inloggen', {incorrect})
  }
  console.log(user)
})

app.get('/registreer', async (req, res) => {
  res.render('registreer')
})