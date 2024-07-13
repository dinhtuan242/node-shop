'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, AuthFailureError, FobiddenError } = require('../core/error.response')
const { findByEmail } = require("./shop.service")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            // check email exists
            const holderShop = await shopModel.findOne({ email }).lean()
            if (holderShop) {
                throw new BadRequestError('Error: Shop already exists!')
            }
            const passwordHashed = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({ name, email, password: passwordHashed, roles: [RoleShop.SHOP] })
            if (newShop) {
                // created privateKey, publicKey
                // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     },
                // })
                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey,
                })
                if (!keyStore) {
                    throw new BadRequestError('Error: publickey str error!')
                }
                // const publickeyObj = crypto.createPublicKey(publicKeyStr)
                const token = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
                return {
                    code: '20001',
                    shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                    token
                }
            }
            return {
                code: '20000',
                metadata: null
            }
        } catch (error) {
            throw new BadRequestError(`Error: ${error.message}`)
        }
    }

    static login = async ({ email, password, refreshToken = null}) => {
        const foundShop = await findByEmail({email})
        if (!foundShop) throw new BadRequestError('Error: Shop not exists!')

        const match = bcrypt.compare(password, foundShop.password)
        if (!match) throw new AuthFailureError('Error: Credential does not match')

        // create key
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        // generate token by key
        const { _id: userId } = foundShop
        const token = await createTokenPair({userId: foundShop._id, email}, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            refreshToken: token.refreshToken,
            privateKey,
            publicKey,
            userId
        })
        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            token
        }
    }

    static logout = async (keyStore) => {
        return await KeyTokenService.removeKeyById(keyStore._id)
    }

    static handleRefreshToken = async (refreshToken) => {
        // check refresh token is used
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        if (foundToken) {
            // decode token to users
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
            console.log({userId, email});

            // delete all token in key store because leak token
            await KeyTokenService.deleteKeyByUserId(userId)
            throw new FobiddenError('Error: Token is leak! Please relogin')
        }

        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if (!holderToken) throw new AuthFailureError('Shop is not registered!')

        // verify refresh token
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
        // check userId
        const foundShop = await findByEmail({email})
        if (!foundShop) throw new AuthFailureError('Shop is not registered!')

        // create 2 token
        const tokens = await createTokenPair({userId, email}, holderToken.publicKey, holderToken.privateKey)

        // update token
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })
        return {
            user: {userId, email},
            tokens
        }
    }

    static handleRefreshTokenV2 = async ({refreshToken, user, keyStore}) => {

        const {userId, email} = user
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyByUserId(userId)
            throw new FobiddenError('Something wrong! Please re-login')
        }
        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop is not registered!')

        // check userId
        const foundShop = await findByEmail({email})
        if (!foundShop) throw new AuthFailureError('Shop is not registered!')

        // create 2 token
        const tokens = await createTokenPair({userId, email}, keyStore.publicKey, keyStore.privateKey)

        // update token
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })
        return {
            user,
            tokens
        }
        
    }
}

module.exports = AccessService
