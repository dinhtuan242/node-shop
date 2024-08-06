'use strict'
const { cart } = require("../cart.model")
const { convertToObjectIdMongoose } = require('../../utils')

const findCartById = async (cartId) => {
    return cart
        .findOne(
            {
                _id: convertToObjectIdMongoose(cartId),
                state: 'active'
            }
        )
        .lean();
}

module.exports = {
    findCartById,
}
