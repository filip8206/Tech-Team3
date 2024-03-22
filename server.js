require('dotenv').config()

const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const app = express()
const session = require('express-session')
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=techteam3`;

//const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=${process.env.DB_NAME}`
//import { bezoekerSchema } from "./schema.js"

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
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/users/')
  },
  filename: function (req, file, cb) {
    cb(null, req.session.userID + path.extname(file.originalname));
  }
});

// Middleware
app.use(express.static('public'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

app.use(session({
  secret: 'random string',
  resave: false,
  saveUninitialized: true,
}))

const upload = multer({ storage: storage })

console.log('Server gestart');

//foutmeldingen
let incorrect

// Routes


app.get('/', async (req,res) => {
  const db = client.db("muve")
  const coll = db.collection("songs")

  if(Object.keys(req.query).length > 0){
    const {sorteren} = req.query
    const key = req.query.key.split(",")
    const genre = req.query.genre.split(",")
    let bpm = req.query.bpm.split(",")
    bpm = [parseInt(bpm[0]), parseInt(bpm[1])]
    console.log(key, genre, sorteren, bpm)

    let songs = await coll.find({
      "bpm": { $gte: bpm[0], $lte: bpm[1] },
      "genre": { $in: Array.isArray(genre) ? genre : [genre] },
      "key": { $in: Array.isArray(key) ? key : [key] }
    }).sort({[sorteren]: -1}).toArray()
    res.render('index', {songs})
  }else{
    let songs = await coll.find({}).toArray()
    res.render('index', {songs})
  }
})

app.post('/', async (req,res) => {
  let genre, key = []
  genre = req.body.genre
  if(genre === undefined){genre=["pop", "dutch", "rap", "rock"]}
  key = req.body.key
  if(key === undefined){key=["a", "b", "c", "d", "e", "f", "g"]}
  const {sorteren, bpmMin, bpmMax} = req.body
  const bpm = [bpmMin, bpmMax]
  const url = `/?key=${key}&genre=${genre}&sorteren=${sorteren}&bpm=${bpm}`
  res.redirect(url)
})

app.get('/inloggen', async (req,res) => {
  let incorrect
  res.render('inloggen', {incorrect})
})

app.get('/detail', async (req,res) => {
  const songID = req.query.id
  const db = client.db("muve")
  const coll = db.collection("songs")
  const song = await coll.findOne({_id: new ObjectId(songID)})
  res.render('detail', {song})
})

app.get('/match', async (req,res) => {
  res.render('match')
})

app.get('/matchprofiel', async (req,res) => {
  res.render('matchprofiel')
})

app.get('/profiel', async (req,res) => {
  res.render('profiel')
})

app.post('/login', async (req,res) => {
  const db = client.db("DatabaseTechTest")
})

app.get('/', async (req, res) => {
  res.render('index')
  console.log(req.session.userID + ' is ingelogd')
})


app.post('/login', async (req,res) => {
  const db = client.db("muve")
  const coll = db.collection("users")
  const {email, password} = req.body

  

  const user = await coll.findOne({ email: email })
  if (user != null) {
  bcrypt.compare(password, user.password).then(function(result) {
    if(result === true){
      console.log(user._id)
      req.session.userID = user._id
      req.session.email = user.email
      res.redirect('/')
    } else {
      incorrect = "Uw gebruikersnaam of wachtwoord is incorrect."
      res.redirect('/inloggen')
    }})
  } else {
    incorrect = "Uw gebruikersnaam of wachtwoord is incorrect."
    res.redirect('/inloggen')
  }
})

////////// Registreren
app.get('/registreer', async (req, res) => {
  res.render('registreer')
})


app.get('/genreSelect', async (req, res) => {
  res.render('genreSelect')
})

app.post('/registreer', async (req, res) => {
  const db = client.db('muve')
  const coll = db.collection('users')

  const user = await coll.findOne({
    email: req.body.email
  })

  if (user) {
    res.redirect('/registreer')
    //hier moet nog een foutmelding komen
    console.log('email bestaat al')
  } else {

    const formEmail = xss(req.body.email)
    const formPassword = xss(req.body.password)
    const formPasswordConfirm = xss(req.body.repeatPassword)
    const formName = xss(req.body.name)

    if (formPassword != formPasswordConfirm) {
      res.redirect('/registreer')
      //hier moet ook nog een foutmelding komen
      console.log('wachtwoorden komen niet overeen')
    } else {

      const hashedPassword = bcrypt.hashSync(formPassword, saltRounds);

      if (formName == null || formEmail == null || formPassword == null) {
        const foutmelding = 'Leeg'
        res.render('registreer', { foutmelding })
      } else {

        coll.insertOne({
          email: formEmail,
          password: hashedPassword,
          name: formName
        })

        console.log(req.body + 'geregistreerd')
        req.session.email = email
        res.redirect('/profiel-aanmaken')
      }
    }
  }
})

////////// Profiel aanmaken
app.get('/profiel-aanmaken', async (req, res) => {
  const email = req.session.email
  console.log ('user ' + email)
  // if (email != null) {
  res.render('profiel-aanmaken', {email})
  // } else {
    // res.redirect('/inloggen')
  // }
})

app.post('/profiel-aanmaken', upload.single('profilephoto') , async (req,res) => {
  const db = client.db('muve')
  const coll = db.collection('users')

  const formDescription = xss(req.body.description)
  console.log(req.file)
  console.log(req.body.genres)
  console.log(formDescription)
  const user = await coll.findOne({ email: req.session.email })
  console.log(user)
  coll.updateOne({ email: req.session.email},{ $set: {
    profilePicturePath: req.file.path,
    description: formDescription,
    genres: req.body.genres
}})
  console.log('profiel bijgewerkt')
  res.redirect('/')
})

app.get('/klaar', async (req, res) => {
  res.render('klaar')
})

app.listen(process.env.PORT, () => {
  console.log(`Project Tech Data API listening on port ${process.env.PORT}`)
})