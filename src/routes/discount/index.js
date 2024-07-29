'use strict'

const express = require('express')
const { asyncHandler } = require("../../helpers/asyncHandler");
const discountController = require("../../controllers/discount.controller");
const { authenticationV2 } = require("../../auth/authUtils");

const router = express.Router()

router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/list-product-code', asyncHandler(discountController.getAllDiscountCodeWithProduct))

router.use(authenticationV2)
router.post('', asyncHandler(discountController.createDiscountCode))
router.get('', asyncHandler(discountController.getAllDiscountCode))

module.exports = router
