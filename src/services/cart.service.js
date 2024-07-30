'use strict'

const { cart } = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");
const { NotFoundError }  = require("../core/error.response");

class CartService {
    static async createUserCard({ userId, product }) {
        const query = { userId, state: 'active' }
        const updateOrInsert = {
            $addToSet: {
                products: product
            }
        }
        const options = { new: true, upsert: true }
        return cart.findOneAndUpdate(query, updateOrInsert, options);
    }

    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product
        const query = {
            userId,
            'products.productId': productId,
            state: 'active'
        }
        const updateSet = {
            $inc: {
                'products.$.quantity': quantity
            }
        }
        const options = { new: true, upsert: true }
        console.log('query', query, 'updateSet', updateSet, 'options', options)
        return cart.findOneAndUpdate(query, updateSet, options)
    }

    static async addToCart({ userId, product = {} }) {
        const userCart = await cart.findOne({
            userId
        })
        if (!userCart) {
            return CartService.createUserCard({ userId, product })
        }
        if (!userCart.products.length) {
            userCart.products = [product]
            return userCart.save();
        }

        return await CartService.updateUserCartQuantity({ userId, product })
    }

    static async addToCartV2({ userId, shopOrderIds }) {
        const { productId, quantity, oldQuantity } = shopOrderIds[0]?.itemProducts[0]
        const foundProduct = await getProductById(productId)
        if (!foundProduct) throw new NotFoundError('Product not found!')

        if (foundProduct.shop.toString() !== shopOrderIds[0]?.shopId.toString()) {
            throw new NotFoundError('Product not belong to the shop!')
        }

        if (quantity === 0) {
            // delete
        }

        return await CartService.updateUserCartQuantity({
            userId, product: {
                productId, quantity: quantity - oldQuantity
            }
        })
    }

    static async deleteUserCart({ userId, productId = {} }) {
        const query = { userId, state: 'active' }
        const updateSet = {
            $pull: {
                products: {
                    productId
                }
            }
        }

        return cart.updateOne(query, updateSet)
    }

    static async getListCart({ userId }) {
        return cart.findOne({
            userId: +userId
        }).lean()
    }
}

module.exports = CartService
