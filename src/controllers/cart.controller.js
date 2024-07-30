'use strict'

const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Cart Added Successfully',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }
    updateCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Cart update Successfully',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }
    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'Cart delete Successfully',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }
    listToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Cart list Successfully',
            metadata: await CartService.getListCart(req.query)
        }).send(res)
    }
}

module.exports = new CartController()
