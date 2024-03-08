require('dotenv').config()

const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb')
const app = express()
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=techteam3`;
const port = process.env.PORT

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

app.get('/registreer', async (req, res) => {
  res.render('registreer')
})