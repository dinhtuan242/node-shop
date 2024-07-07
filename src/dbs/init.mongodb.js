'use strict'

const mongoose = require('mongoose')

const connectString = `mongodb://localhost:27017/shopDev`


class Database {
    constructor() {
        this.connect()
    }

    connect(type = 'mongodb') {
        if (type.toLowerCase() === 'mongodb') {
            mongoose.connect(connectString)
            .then(_ => console.log(`Connected mongodb success`))
            .catch(err => console.log('error connect!'))
        }
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongoDb = Database.getInstance()

module.exports = instanceMongoDb
