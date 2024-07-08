'use strict'

const config = {
    app: {
        port: process.env.PORT
    },
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    }
}

module.exports = config
