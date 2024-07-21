'use strict'

const { product, clothing, electronic, furniture } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
const {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser,
} = require('../models/repositories/product.repo')

// define Factory class to create product
class ProductFatory {
    static async createProduct(type, payload) {
        switch (type) {
            case 'Electronics':
                return new Electronic(payload).createProduct()
            case 'Clothes':
                return new Clothing(payload).createProduct()
            case 'Furnitures':
                return new Furniture(payload).createProduct()
            default:
                throw new BadRequestError(`Invalid product type: ${type}`)
        }
    }

    static async findAllDraftForShop({ shop, limit = 50, skip = 0 }) {
        const query = { shop, isDraft: true }
        return await findAllDraftForShop({ query, limit, skip })
    }

    static async publishProductByShop({ shop, id }) {
        return await publishProductByShop({ shop, id })
    }

    static async unPublishProductByShop({ shop, id }) {
        return await unPublishProductByShop({ shop, id })
    }

    static async findAllPublishForShop({ shop, limit = 50, skip = 0 }) {
        const query = { shop, isPublish: true }
        return await findAllPublishForShop({ query, limit, skip })
    }

    static async searchProduct({ keySearch }) {
        return await searchProductByUser({ keySearch })
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

// define sub-class for difference product types Furniture
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create(this.attributes)
        if (!newFurniture) throw new BadRequestError('Error: cannot create new furniture')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('Error: cannot create new product')

        return newProduct
    }
}

module.exports = ProductFatory
