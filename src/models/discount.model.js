'use strict'

const {model, Schema} = require('mongoose')

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

// Declare the Schema of the Mongo model
var discountSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'fixed_amount'
    },
    value: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    maxUses: {
        type: Number,
        required: true
    },
    usesCount: {
        type: Number,
        required: true
    },
    usersUsed: {
        type: Array,
        default: []
    },
    maxUsesPerUser: {
        type: Number,
        required: true
    },
    minOrderValue: {
        type: Number,
        required: true
    },
    shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    appliesTo: {
        type: String,
        required: true,
        enum: ['all', 'specific']
    },
    productIds: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = {
    discount: model(DOCUMENT_NAME, discountSchema)
}