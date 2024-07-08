'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")

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
                return {
                    code: '400',
                    message: 'Shop already exists!'
                }
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
                    return {
                        code: '400',
                        message: 'publickey str error'
                    }
                }
                // const publickeyObj = crypto.createPublicKey(publicKeyStr)
                const token = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
                return {
                    code: '20001',
                    metadata: {
                        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                        token
                    }
                }
            }
            return {
                code: '20000',
                metadata: null
            }
        } catch (error) {
            return {
                code: '400',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService
