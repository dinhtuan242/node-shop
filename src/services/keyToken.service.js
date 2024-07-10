'use strict'

const keyTokenModel = require('../models/keytoken.model')

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            const filter = {user: userId}
            const update = {
                publicKey, privateKey, refreshTokenUsed: [], refreshToken
            }
            const options = { upsert: true, new: true}
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null
        } catch (errors) {
            return errors
        }
    }
}

module.exports = KeyTokenService
