'use strict'

const express = require('express')
const { authenticationV2 } = require('../../auth/authUtils')
const { asyncHandler } = require('../../helpers/asyncHandler')
const productController = require('../../controllers/product.controller')
const router = express.Router()

router.get('/search/:keySearch', asyncHandler(productController.searchProductPublished))
router.get('/:id', asyncHandler(productController.findProduct))
router.get('/', asyncHandler(productController.findAllProducts))

router.use(authenticationV2)
router.post('', asyncHandler(productController.createProduct))
router.get('/drafts/all', asyncHandler(productController.getAllDaftForShop))
router.get('/publish/all', asyncHandler(productController.getAllPublishForShop))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/un-publish/:id', asyncHandler(productController.unPublishProductByShop))

module.exports = router
