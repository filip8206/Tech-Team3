require('dotenv').config()

const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=techteam3`;

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

client.connect();

// Middleware
app.use(express.static('public'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

console.log('Server gestart');

// Routes

app.get('/', async (req, res) => {
  res.render('index')
})

app.get('/inloggen', async (req, res) => {
  res.render('inloggen')
})

app.get('/registreer', async (req, res) => {
  res.render('registreer')
})

app.post('/registreer', async (req, res) => {
  const db = client.db('DatabaseTechTest')
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
    const formName = xss(req.body.name)

    const hashedPassword = bcrypt.hashSync(formPassword, saltRounds);

    if (formName == null || formEmail == null || formPassword == null) {
      const foutmelding = ''
      res.render('registreer', { foutmelding })
    } else {

      console.log(req.body)

      coll.insertOne({
        email: formEmail,
        password: hashedPassword,
        name: formName
      })

      res.redirect('/klaar')
    }
  }
})

app.get('/klaar', async (req, res) => {
  res.render('klaar')
})

app.listen(process.env.PORT, () => {
  console.log(`Project Tech Data API listening on port ${process.env.PORT}`)
})
