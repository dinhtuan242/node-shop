'use strict'

const { Types } = require('mongoose')
const { product, electronic, clothing, furniture } = require('../../models/product.model')

const findAllDraftForShop = async ({ query, limit, skip }) => {
    return await productQuery({ query, limit, skip })
}

const publishProductByShop = async ({ shop, id }) => {
    const foundShop = await product.findOne({
        shop: new Types.ObjectId(shop),
        _id: new Types.ObjectId(id)
    })
    if (!foundShop) return null
    foundShop.isDraft = false
    foundShop.isPublish = true
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await productQuery({ query, limit, skip })
}

const unPublishProductByShop = async ({ shop, id }) => {
    const foundShop = await product.findOne({
        shop: new Types.ObjectId(shop),
        _id: new Types.ObjectId(id)
    })
    if (!foundShop) return null
    foundShop.isDraft = true
    foundShop.isPublish = false
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        isDraft: false,
        $text: { $search: regexSearch }
    }, { score: { $meta: 'textScore' } })
    .sort({score: { $meta: 'textScore' }})
    .lean()
    .exec()
    return results
}

const productQuery = async ({ query, limit, skip }) => {
    return await product.find(query)
        .populate('shop', 'name email -_id')
        .sort({ updatedAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean()
        .exec()
}

module.exports = {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser,
}
