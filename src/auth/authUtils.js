'use strict'
const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { findByUserId } = require('../services/keyToken.service')
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'x-rtoken-id'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        })
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        })
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`error verify::`, err)
            } else {
                console.log(`decode verify::`, decode);
            }
        })
        return { accessToken, refreshToken }
    } catch (errors) {

    }
}

const authentication = asyncHandler(async (req, res, next) => {
    // check user id in request
    const userId = req.headers[HEADER.CLIENT_ID]?.toString()
    if (!userId) throw new AuthFailureError('Invalid request')

    // get key store by user id
    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not found key store')

    // verify token
    const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString()
    if (!accessToken) throw new AuthFailureError('Invalid request')

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid user')

        req.keyStore = keyStore
        return next()
    } catch (errors) {
        throw errors
    }
})


const authenticationV2 = asyncHandler(async (req, res, next) => {
    // check user id in request
    const userId = req.headers[HEADER.CLIENT_ID]?.toString()
    if (!userId) throw new AuthFailureError('Invalid request')

    // get key store by user id
    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not found key store')

    if (req.headers[HEADER.REFRESH_TOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESH_TOKEN]
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
            if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid user')

            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (errors) {
            throw errors
        }
    }

    // verify token
    const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString()
    if (!accessToken) throw new AuthFailureError('Invalid request')

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid user')

        req.keyStore = keyStore
        return next()
    } catch (errors) {
        throw errors
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
    authenticationV2,
}
