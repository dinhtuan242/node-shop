'use strict'

const accessService = require("../services/access.service")

class AccessController {
    signUp = async (req, res, next) => {
        try {
            console.log(`[P]::signUp::`, req.body)
            return res.status(201).json(await accessService.signUp(req.body))
            
        } catch (errors) {
            next(errors)
        }
    }
}

module.exports = new AccessController()