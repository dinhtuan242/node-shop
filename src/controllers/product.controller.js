'use strict'

const productService = require("../services/product.service")
const { SuccessResponse } = require('../core/success.response')

class ProductController {
    createProduct = async (req, res, next) => {
        console.log('createproduct controller');
        new SuccessResponse({
            message: 'Create new product success',
            metadata: await productService.createProduct(req.body.type, req.body)
        }).send(res)
    }
}

module.exports = new ProductController()