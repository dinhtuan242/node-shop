'use strict'

const express = require('express')
const { apiKey, permission } = require('../auth/checkAuth')
const router = express.Router()

// check api key
router.use(apiKey)
router.use(permission('0000'))

// check permission

router.use('/v1/api/inventory', require('./inventory'))
router.use('/v1/api/checkout', require('./checkout'))
router.use('/v1/api/product', require('./product'))
router.use('/v1/api/discount', require('./discount'))
router.use('/v1/api/cart', require('./cart'))
router.use('/v1/api', require('./access'))

module.exports = router
