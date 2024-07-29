'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventoires'

var inventorySchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    location: {
        type: String,
        default: 'Unknow'
    },
    stock: {
        type: Number,
        required: true
    },
    shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    reservations: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = {
    inventory: model(DOCUMENT_NAME, inventorySchema)
}