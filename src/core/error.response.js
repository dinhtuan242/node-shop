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

class AuthFailureError extends ErrorResponse {
    constructor(message = reasonPhrases.UNAUTHORIZED, status = statusCode.UNAUTHORIZED) {
        super(message, status)
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = reasonPhrases.NOT_FOUND, status = statusCode.NOT_FOUND) {
        super(message, status)
    }
}
class FobiddenError extends ErrorResponse {
    constructor(message = reasonPhrases.FORBIDDEN, status = statusCode.FORBIDDEN) {
        super(message, status)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    FobiddenError,
}
