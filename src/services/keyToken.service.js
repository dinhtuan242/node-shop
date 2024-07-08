'use strict'

const keyTokenModel = require('../models/keytoken.model')

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey }) => {
        try {
            const token = await keyTokenModel.create({
                user: userId,
                publicKey,
                privateKey
            })

            return token ? token.publicKey : null
        } catch (errors) {
            return errors
        }
    }
}

module.exports = KeyTokenService
