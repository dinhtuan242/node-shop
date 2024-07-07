const express = require('express')
const morgan = require('morgan')
const { default: helmet } = require('helmet')
const compression = require('compression')
const app = express()

// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

// init DB
require('./dbs/init.mongodb')

// init routers
app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: "welcome!"
    })
})

// handling errors

module.exports = app