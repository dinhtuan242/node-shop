'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, AuthFailureError } = require('../core/error.response')
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
}

module.exports = AccessService
