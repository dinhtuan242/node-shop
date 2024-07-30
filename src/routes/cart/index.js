'use strict'

const express = require('express')
const { asyncHandler } = require("../../helpers/asyncHandler");
const CartController = require("../../controllers/cart.controller");

const router = express.Router()

router.post('', asyncHandler(CartController.addToCart));
router.delete('', asyncHandler(CartController.delete));
router.post('/update', asyncHandler(CartController.updateCart));
router.get('', asyncHandler(CartController.listToCart));

module.exports = router
