'use strict'

const { inventory } = require("../inventory.model")
const { Types } = require('mongoose')
const { convertToObjectIdMongoose } = require("../../utils");

const insertInventory = async ({ productId, shopId, stock, location = 'Unknow' }) => {
    return await inventory.create({
        productId,
        shopId,
        stock,
        location
    })
}

const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        productId: convertToObjectIdMongoose(productId),
        stock: {
            $gte: quantity,
        }
    }
    const updateSet = {
        $inc: {
            stock: -quantity
        },
        $push: {
            reservations: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }
    const options = { upsert: true, new: true }
    return inventory.updateOne(query, updateSet, options)
}

module.exports = {
    insertInventory,
    reservationInventory
}
