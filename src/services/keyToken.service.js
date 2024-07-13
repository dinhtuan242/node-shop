'use strict'

const keytokenModel = require('../models/keytoken.model')
const keyTokenModel = require('../models/keytoken.model')
const { Types } = require('mongoose')

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            const filter = { user: userId }
            const update = {
                publicKey,
                privateKey,
                refreshTokenUsed: [],
                refreshToken
            }
            const options = { upsert: true, new: true }
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null
        } catch (errors) {
            return errors
        }
    }

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({ user: new Types.ObjectId(userId) })
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne({ _id: id })
    }
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshTokenUsed: refreshToken }).lean()
    }
    static deleteKeyByUserId = async (userId) => {
        return await keytokenModel.deleteOne({ user: userId })
    }
    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshToken })
    }
}

module.exports = KeyTokenService
