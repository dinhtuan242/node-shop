'use strict'

const { getProductById } = require("../models/repositories/product.repo");
const { NotFoundError } = require("../core/error.response");
const { inventory } = require("../models/inventory.model");

class InventoryService {
    static async addStockToInventory({ stock, productId, shopId, location = 'Trung Van' }) {
        const product = await getProductById(productId)
        if (!product) {
            throw new NotFoundError('The product does not exist!')
        }
        const query = {
            shopId, productId
        }
        const updateSet = {
            $inc: {
                stock: stock
            },
            $set: {
                location
            }
        }
        const options = { upsert: true, new: true }
        return inventory.findOneAndUpdate(query, updateSet, options)
    }
}

module.exports = InventoryService
