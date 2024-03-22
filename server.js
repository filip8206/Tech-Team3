require('dotenv').config()

const express = require('express')
const app = express()
const session = require('express-session')
const { MongoClient, ServerApiVersion } = require('mongodb')
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

app.get('/', async (req, res) => {
  res.render('index')
  console.log(req.session.userID + ' is ingelogd')
})

/////////// Inloggen
app.get('/inloggen', async (req, res) => {
  res.render('inloggen', { incorrect })
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
