'use strict'

const { findCartById } = require("../models/repositories/cart.repo");
const { NotFoundError, BadRequestError } = require("../core/error.response");
const { checkProductByServer } = require("../models/repositories/product.repo");
const DiscountService = require("../services/discount.service");
const { acquireLock, releaseLock } = require("./redis.service");
const { order } = require("../models/order.model");

class CheckoutService {
    static async checkoutReview({ cardId, userId, shopOrderIds = [] }) {
        // check cardId
        const foundCard = await findCartById(cardId)
        if (!foundCard) throw new NotFoundError('Cart does not exists!')
        const checkoutOrder = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0
        }
        const shopOrderIdsNew = []
        for (let i = 0; i < shopOrderIds.length; i++) {
            const { shopId, shopDiscounts = [], itemProducts = [] } = shopOrderIds[i]
            // check product available
            const checkProductServer = await checkProductByServer(itemProducts)
            if (!checkProductServer[0]) throw new NotFoundError('Product not found!')
            // total order price
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.price * product.quantity)
            }, 0)

            checkoutOrder.totalPrice += checkoutPrice
            const itemCheckout = {
                shopId,
                shopDiscounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                itemProducts: checkProductServer
            }
            // if shopDiscount available, check if it valid
            if (shopDiscounts.length) {
                // get amount discount
                const { totalPrice = 0, discount = 0 } = await DiscountService.getDiscountAmount({
                    codeId: shopDiscounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })
                checkoutOrder.totalDiscount += discount
                if (discount) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }
            checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount
            shopOrderIdsNew.push(itemCheckout)
        }
        return {
            shopOrderIds,
            shopOrderIdsNew,
            checkoutOrder,
        }
    }

    static async orderByUser({ shopOrderIds, cartId, userId, userAddress = {}, userPayment = {} }) {
        const { shopOrderIdsNew, checkoutOrder } = this.checkoutReview({
            cartId,
            userId,
            shopOrderIds
        })

        // re-check inventory
        // get new array products
        const products = shopOrderIdsNew.flatMap(order => order.itemProducts)
        console.log(`[1]::`, products)
        const acquireProduct = []
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i]
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireProduct.push(!!keyLock)
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }
        // check if a product out of stock
        if (acquireProduct.includes(false)) {
            throw new BadRequestError('Một số sản phẩm đã được cập nhật. Vui lòng quay lại giỏ hàng')
        }
        const newOrder = await order.create({
            userId: userId,
            checkout: checkoutOrder,
            shipping: userAddress,
            payment: userPayment,
            products: shopOrderIdsNew
        })
        if (newOrder) {
            // remove product in cart
        }
        return newOrder
    }
    static async getOrderByUser() {

    }
    static async getOneOrderByUser() {

    }
    static async cancelOrderByUser() {

    }
    static async updateOrderByAdmin() {

    }
}

module.exports = CheckoutService
