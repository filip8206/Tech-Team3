const express = require('express')
const app = express()
const port = 9000

// Middleware
app.use(express.static('public'))

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.set('view engine', 'ejs')