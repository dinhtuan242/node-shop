'use strict'

const express = require('express')
const { asyncHandler } = require("../../helpers/asyncHandler");
const InventoryController = require("../../controllers/inventory.controller");
const { authenticationV2 } = require("../../auth/authUtils");

const router = express.Router()

router.use(authenticationV2)
router.post('', asyncHandler(InventoryController.addStock));

module.exports = router
