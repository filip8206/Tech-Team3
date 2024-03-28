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
    cb(null, req.session.email + path.extname(file.originalname));
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

//algemene variabelen
const alleGenres = ["pop", "nederlands", "rap", "rock", "house"]

// Routes
app.get('/', async (req,res) => {
  console.log(req.session.userID)
  if(!req.session.userID){
    req.session.redirect = '/'
    res.redirect('/inloggen')
  } else{
  const db = client.db("muve")
  const songColl = db.collection("songs")
  const userColl = db.collection("users")
  const userID = req.session.userID

  //likes ophalen
  const user = await userColl.findOne({_id: new ObjectId(userID)})
  const likes = user.likes

  //nummers ophalen + pagina renderen
  if(Object.keys(req.query).length > 0){
    const {sorteren} = req.query
    const key = req.query.key.split(",")
    const genre = req.query.genre.split(",")
    let bpm = req.query.bpm.split(",")
    bpm = [parseInt(bpm[0]), parseInt(bpm[1])]
    console.log(key, genre, sorteren, bpm)

    let songs = await songColl.find({
      "bpm": { $gte: bpm[0], $lte: bpm[1] },
      "genre": { $in: Array.isArray(genre) ? genre : [genre] },
      "key": { $in: Array.isArray(key) ? key : [key] }
    }).sort({[sorteren]: -1}).toArray()
    res.render('index', {songs, likes})
  }else{
    let songs = await songColl.find({}).toArray()
    res.render('index', {songs, likes})
  }
  }
})

// filteren van home
app.post('/', async (req,res) => {
  let genre, key = []
  genre = req.body.genre
  if(genre === undefined){genre=alleGenres}
  key = req.body.key
  if(key === undefined){key=["a", "b", "c", "d", "e", "f", "g"]}
  const {sorteren, bpmMin, bpmMax} = req.body
  const bpm = [bpmMin, bpmMax]
  const url = `/?key=${key}&genre=${genre}&sorteren=${sorteren}&bpm=${bpm}`
  res.redirect(url)
})

// een post liken
app.post('/likePost', async (req, res) => {
  const songID = req.body.songID
  const userID = req.session.userID
  const db = client.db("muve")
  const coll = db.collection("users")
  const songColl = db.collection("songs")

  //like aan de user db toevoegen
  await coll.updateOne({_id: new ObjectId(userID)}, { $push: {likes: songID}})

  //like aan de nummer db toevoegen
  await songColl.updateOne({_id: new ObjectId(songID)}, { $push: {likes: userID}})
})

// een post unliken
app.post('/unlikePost', async (req, res) => {
  const songID = req.body.songID
  const userID = req.session.userID
  const db = client.db("muve")
  const coll = db.collection("users")
  const songColl = db.collection("songs")

  //like van de user db verweideren
  await coll.updateOne({_id: new ObjectId(userID)}, { $pull: {likes: songID}})

  //like van de nummer db verweideren
  await songColl.updateOne({_id: new ObjectId(songID)}, { $pull: {likes: userID}})
})


////////// NUMMERS DETAILPAGINA

app.get('/detail', async (req,res) => {
  if(!req.session.userID){
    req.session.redirect = '/detail'
    res.redirect('/inloggen')
  } else{
    const songID = req.query.id
    const db = client.db("muve")
    const coll = db.collection("songs")
    const song = await coll.findOne({_id: new ObjectId(songID)})
    const userID = req.session.userID

    res.render('detail', {song, userID})
  }
})


////////// MATCHES

app.get('/match', async (req,res) => {
  if(!req.session.userID){
    req.session.redirect = '/match'
    res.redirect('/inloggen')
  } else{
    const db = client.db("muve")
    const coll = db.collection("users")

    if(Object.keys(req.query).length > 0){
      const {sorteren} = req.query
      const genre = req.query.genre.split(",")

      const users = await coll.find({genre: { $in: Array.isArray(genre) ? genre : [genre] }}).sort({[sorteren]: -1}).toArray()
      console.log("de gebruikers zijn: " + users)
      res.render('match', {users})
    } else {
      const users = await coll.find({}).toArray()
      res.render('match', {users})
    }
  }
})

// matches filteren
app.post('/match', async (req,res) => {
  const {sorteren, genre} = req.body
  if(!genre){genre = alleGenres}
  const url = `/match/?sorteren=${sorteren}&genre=${genre}`
  res.redirect(url)
})

app.get('/matchprofiel', async (req,res) => {
  if(!req.session.userID){
    req.session.redirect = '/matchprofiel'
    res.redirect('/inloggen')
  } else{
    res.render('matchprofiel')
  }
})

app.get('/profiel', async (req,res) => {
  if(!req.session.userID){
    req.session.redirect = '/profiel'
    res.redirect('/inloggen')
  } else{
    const userID = req.session.userID
    const db = client.db("muve")
    const coll = db.collection("users")
    const user = await coll.findOne({_id: new ObjectId(userID)})
    res.render('profiel', {user})
  }
})

app.get('/inbox', async (req,res) => {
  if(!req.session.userID){
    req.session.redirect = '/inbox'
    res.redirect('/inloggen')
  } else{
    const userID = req.session.userID
    const db = client.db("muve")
    const coll = db.collection("chats")
    // const chatOverzicht = await coll.find({users: new ObjectId(userID)}).toArray
    const chat = await coll.findOne({users: new ObjectId(userID)})
    console.log(chat.chat)
    res.render('inbox', {chat})
  }
})

app.get('/chat', async (req,res) => {
  if(!req.session.userID){
    req.session.redirect = '/chat'
    res.redirect('/inloggen')
  } else{
    res.render('chat')
  }
})


////////// INLOGGEN

app.get('/inloggen', async (req,res) => {
  res.render('inloggen')
})

app.post('/login', async (req,res) => {
  const db = client.db("muve")
  const coll = db.collection("users")
  const {email, password} = req.body

  
  console.log('gegevens zoeken')
  const user = await coll.findOne({ email: email })
  console.log(user)
  if (user != null) {
  bcrypt.compare(password, user.password).then(function(result) {
    if(result === true){
      console.log('gegevens kloppen')
      req.session.email = user.email
      req.session.userID = user._id
      if (req.session.redirect) {
        console.log('redirect naar ' + req.session.redirect)
        res.redirect(req.session.redirect)
      } else {
        res.redirect('/')
      }
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
    const formBirthdate = req.body.date

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
          name: formName,
          birthdate: formBirthdate
        })

        console.log(req.body + 'geregistreerd')
        req.session.email = formEmail
        res.redirect('/profiel-aanmaken')
      }
    }
  }
})


////////// Profiel aanmaken

app.get('/profiel-aanmaken', async (req, res) => {
  const email = req.session.email
  console.log ('user ' + email)
  if (email != null) {
  res.render('profiel-aanmaken', {email})
  } else {
    req.session.redirect = '/profiel-aanmaken'
    res.redirect('/inloggen')
  }
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
    description: formDescription,
    genres: req.body.genres,
    profilePicturePath: req.file.path
}})
  console.log('profiel bijgewerkt')
  res.redirect('/')
})

app.get('/klaar', async (req, res) => {
  res.render('klaar')
})

////////// Profiel bewerken routes



////////// App listen
app.listen(process.env.PORT, () => {
  console.log(`Project Tech Data API listening on port ${process.env.PORT}`)
})