'use strict'

const { product, clothing, electronic } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')

// define Factory class to create product
class ProductFatory {
    static async createProduct(type, payload) {
        console.log('create product service');
        switch (type) {
            case 'Electronic':
                return new Electronic(payload).createProduct()
            case 'Clothing':
                return new Clothing(payload).createProduct()
            default:
                throw new BadRequestError(`Invalid product type: ${type}`)
        }
    }
}

// define base product class
class Product {
    constructor({
        name, thumb, description, price, quantity, type, shop, attributes
    }) {
        this.name = name
        this.thumb = thumb
        this.description = description
        this.price = price
        this.quantity = quantity
        this.type = type
        this.shop = shop
        this.attributes = attributes
    }

    // create new product
    async createProduct() {
        return await product.create(this)
    }
}

// define sub-class for difference product types clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.attributes)
        if (!newClothing) throw new BadRequestError('Error: cannot create new clothing')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('Error: cannot create new product')

        return newProduct
    }
}

// define sub-class for difference product types electronic
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create(this.attributes)
        if (!newElectronic) throw new BadRequestError('Error: cannot create new electronic')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('Error: cannot create new product')

        return newProduct
    }
}

module.exports = ProductFatory
