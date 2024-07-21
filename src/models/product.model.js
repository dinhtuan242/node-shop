'use strict'

const { Schema, model } = require('mongoose');
const { default: slugify } = require('slugify');

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
    slug: {
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
        enum: ['Electronics', 'Clothes', 'Furnitures']
    },
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    attributes: {
        type: Schema.Types.Mixed,
        required: true
    },
    ratings: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        set: val => Math.round(val * 10) / 10
    },
    variations: {
        type: Array,
        default: []
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },
    isPublish: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

// create index for search

productSchema.index({ name: 'text', description: 'text' })

// Document middleware: runs before save and create
productSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})

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
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
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
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    }
}, {
    collection: 'Electronics',
    timestamps: true
})

const furnitureSChema = new Schema({
    brand: {
        type: String,
        required: true
    },
    size: {
        type: String
    },
    material: {
        type: String
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    }
}, {
    collection: 'Furnitures',
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSChema),
    electronic: model('Electronic', electronicSChema),
    furniture: model('Furniture', furnitureSChema),
};
