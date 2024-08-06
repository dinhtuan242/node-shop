'use strict'
const redis = require('redis')
const { promisify } = require('util')
const { reservationInventory } = require("../models/repositories/inventory.repo");
const redisClient = redis.createClient()

const pexpire = promisify(redisClient.pExpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)
const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2024_${ productId }`
    const retryTime = 10
    const expireTime = 3000
    for (let i = 0; i < retryTime; i++) {
        // create a key
        const result = await setnxAsync(key, expireTime)
        console.log(`result:::`, result)
        if (result === 1) {
            const isReservation = await reservationInventory({
                productId, quantity, cartId
            })
            if (isReservation.modifiedCount) {
                await pexpire(key, expireTime)
                return key
            }
            return key
        } else {
            await new Promise(resolve => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock,
}
