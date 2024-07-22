'use strict'

const productService = require("../services/product.service")
const { SuccessResponse } = require('../core/success.response')

class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new product success',
            metadata: await productService.createProduct(req.body.type, {
                ...req.body,
                shop: req.user.userId
            })
        }).send(res)
    }

    getAllDaftForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Find draft product success',
            metadata: await productService.findAllDraftForShop({shop: req.user.userId})
        }).send(res)
    }

    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Find publish product success',
            metadata: await productService.findAllPublishForShop({shop: req.user.userId})
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Publish product success',
            metadata: await productService.publishProductByShop({shop: req.user.userId, id: req.params.id})
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Un publish product success',
            metadata: await productService.unPublishProductByShop({shop: req.user.userId, id: req.params.id})
        }).send(res)
    }

    searchProductPublished = async (req, res, next) => {
        new SuccessResponse({
            message: 'Search product success',
            metadata: await productService.searchProduct(req.params)
        }).send(res)
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Find all product success',
            metadata: await productService.findAllProducts(req.query)
        }).send(res)
    }

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Find one product success',
            metadata: await productService.findProduct({
                id: req.params.id
            })
        }).send(res)
    }

    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update product success',
            metadata: await productService.updateProduct(
                req.body.type,
                req.params.productId,
                {
                    ...req.body,
                    shop: req.user.userId
                }
            )
        }).send(res)
    }
}

module.exports = new ProductController()