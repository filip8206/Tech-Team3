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
  const {sorteren} = req.query
  const key = req.query.key.split(",")
  const genre = req.query.genre.split(",")
  let bpm = req.query.bpm.split(",")
  bpm = [parseInt(bpm[0]), parseInt(bpm[1])]
  console.log(key, genre, sorteren, bpm)
  // const db = client.db("muve")
  // const coll = db.collection("songs")
  // const songs = await coll.find().toArray()
  // res.render('index', {songs})
  const db = client.db("muve")
  const coll = db.collection("songs")
  let songs = await coll.find({
    "bpm": { $gte: bpm[0], $lte: bpm[1] },
    "genre": { $in: Array.isArray(genre) ? genre : [genre] },
    "key": { $in: Array.isArray(key) ? key : [key] }
  }).sort({[sorteren]: -1}).toArray()
  res.render('index', {songs})
})

app.post('/', async (req,res) => {
  let genre, key = []
  genre = req.body.genre
  if(genre === undefined){genre=["pop"]}
  key = req.body.key
  if(key === undefined){key=["a", "b", "c", "d", "e", "f", "g"]}
  const {sorteren, bpmMin, bpmMax} = req.body
  const bpm = [parseInt(bpmMin), parseInt(bpmMax)]
  const url = `/?key=${key}&genre=${genre}&sorteren=${sorteren}&bpm=${bpm}`
  console.log(key, genre, sorteren, bpm)
  res.redirect(url)

  // const db = client.db("muve")
  // const coll = db.collection("songs")
  // let songs = await coll.find({
  //   "bpm": { $gte: bpm[0], $lte: bpm[1] },
  //   "genre": { $in: Array.isArray(genre) ? genre : [genre] },
  //   "key": { $in: Array.isArray(key) ? key : [key] }
  // }).sort({[sorteren]: -1}).toArray()
  // res.render('index', {songs})
})

app.get('/inloggen', async (req,res) => {
  let incorrect
  res.render('inloggen', incorrect)
})

app.get('/detail', async (req,res) => {
  res.render('detail')
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