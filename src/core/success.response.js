'use strict'

const statusCode = require("../constants/statusCode");
const reasonPhrases = require("../constants/reasonPhrases");

class SuccessResponse {
    constructor({message, status = statusCode.OK, reason = reasonPhrases.OK, metadata = {}}) {
        this.message = message ? message : reason
        this.status = status
        this.metadata = metadata
    }
    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({message, metadata = {}}) {
        super({message, metadata})
    }
}
class CREATED extends SuccessResponse {
    constructor({options = {}, message, status = statusCode.CREATED, reason = reasonPhrases.CREATED, metadata}) {
        super({message, status, reason, metadata})
        this.options = options
    }
}

module.exports = {
    OK,
    CREATED
}
