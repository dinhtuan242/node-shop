'use strict'
const { model, Schema } = require('mongoose')
const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

const orderSchema = new Schema({
    userId: { type: Number, required: true },
    checkout: { type: Object, default: {} },
    shipping: { type: Object, default: {} },
    payment: { type: Object, default: {} },
    product: { type: Object, required: true },
    trackingNumber: { type: String, default: '#00106082024' },
    status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending' }
}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn',
    }
})

module.exports = {
    order: model(DOCUMENT_NAME, orderSchema)
}
