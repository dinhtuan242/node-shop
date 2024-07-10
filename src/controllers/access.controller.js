'use strict'

const accessService = require("../services/access.service")
const { CREATED, SuccessResponse } = require('../core/success.response')

class AccessController {
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Registed OK',
            metadata: await accessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res)
    }

    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await accessService.login(req.body)
        }).send(res)
    }

    logout = async (req, res, next) => {
        new SuccessResponse({
            mesage: 'Logout success',
            metadata: await accessService.logout(req.keyStore)
        }).send(res)
    }
}

module.exports = new AccessController()