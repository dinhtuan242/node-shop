'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()

router.post('/shop/sign-up', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

// authentication
router.use(authenticationV2)
router.post('/shop/refresh-token', asyncHandler(accessController.refreshToken))
router.post('/shop/logout', asyncHandler(accessController.logout))

module.exports = router
