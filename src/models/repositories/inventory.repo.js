'use strict'

const { inventory } = require("../inventory.model")
const { Types } = require('mongoose')

const insertInventory = async ({productId, shopId, stock, location = 'Unknow'}) => {
    return await inventory.create({
        productId,
        shopId,
        stock,
        location
    })
}

module.exports = {
    insertInventory,
}
