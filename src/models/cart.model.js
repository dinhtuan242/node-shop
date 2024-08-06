const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'
const cartSchema = new Schema({
    state: {
        type: String,
        enum: [
            'active', 'completed', 'failed', 'pending'
        ],
        default: 'active'
    },
    products: {
        type: Array,
        required: true,
        default: []
    },
    countProduct: {
        type: Number,
        default: 0
    },
    userId: {
        type: Number,
        required: true
    }
}, {
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn',
    },
    collection: COLLECTION_NAME
})

module.exports = {
    cart: model(DOCUMENT_NAME, cartSchema)
}
