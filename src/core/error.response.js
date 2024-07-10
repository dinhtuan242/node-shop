'use strict'

const reasonPhrases = require("../constants/reasonPhrases");
const statusCode = require("../constants/statusCode");

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}
class ConflictRequestError extends ErrorResponse {
    constructor(message = reasonPhrases.CONFLICT, status = statusCode.FORBIDDEN) {
        super(message, status)
    }
}
class BadRequestError extends ErrorResponse {
    constructor(message = reasonPhrases.CONFLICT, status = statusCode.FORBIDDEN) {
        super(message, status)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError
}
