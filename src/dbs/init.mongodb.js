'use strict'

const mongoose = require('mongoose')
const { db: { host, name, port, user, password } } = require('../configs/config.mongodb')

const connectString = `mongodb://${user}:${password}@${host}:${port}/${name}?authSource=admin`


class Database {
    constructor() {
        this.connect()
    }

    connect(type = 'mongodb') {
        if (type.toLowerCase() === 'mongodb') {
            console.log(connectString);
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
