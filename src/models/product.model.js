'use strict'

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

var productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    thumb: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Electronics', 'Clothing', 'Furniture']
    },
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    attributes: {
        type: Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

const clothingSChema = new Schema({
    brand: {
        type: String,
        required: true
    },
    size: {
        type: String
    },
    material: {
        type: String
    }
}, {
    collection: 'Clothes',
    timestamps: true
})
const electronicSChema = new Schema({
    manufacturer: {
        type: String,
        required: true
    },
    model: {
        type: String
    },
    color: {
        type: String
    }
}, {
    collection: 'Electronics',
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSChema),
    electronic: model('Electronic', electronicSChema),
};
