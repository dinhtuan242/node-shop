'use strict'

const { Types } = require("mongoose")
const { BadRequestError, NotFoundError } = require("../core/error.response")
const { discount } = require("../models/discount.model")
const { findAllProducts } = require("../models/repositories/product.repo")
const { convertToObjectIdMongoose } = require('../utils/index')
const { findAllDiscountCodesUnselect, checkDiscountExists } = require("../models/repositories/discount.repo")

/**
 * Discount service
 * 1 - Generate discount code [Shop|Admin]
 * 2 - Get discount amount [User]
 * 3 - Get all discount codes [User|Shop]
 * 4 - Verify discount code [User]
 * 5 - Delete discount code [Admin|Shop]
 * 6 - Cancel discount code [User]
 */

class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code, startDate, endDate, isActive, shopId, minOrderValue, productIds, appliesTo, name, description, type,
            value, maxValue, maxUses, usesCount, maxUsesPerUser, usersUsed
        } = payload

        const now = new Date()
        if (now > new Date(endDate)) {
            throw new BadRequestError('Discount code has expired!')
        }

        if (new Date(startDate) >= new Date(endDate)) {
            throw new BadRequestError('Start date must be before end date')
        }

        // create index for discount code
        const foundDiscount = await discount.findOne({ code, shopId: convertToObjectIdMongoose(shopId) }).lean()
        if (foundDiscount && foundDiscount.isActive) {
            throw new BadRequestError('Discount exists!')
        }
        return await discount.create({
            name,
            description,
            type,
            code,
            value,
            minOrderValue: minOrderValue || 0,
            maxValue,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            maxUses,
            usesCount,
            usersUsed,
            shopId,
            maxUsesPerUser,
            isActive,
            appliesTo,
            productIds: appliesTo === 'all' ? [] : productIds
        })
    }

    static async updateDiscountCode() {
        // Todo
    }

    static async getAllDiscountCodeWithProduct({ code, shopId, userId, limit, page }) {
        const foundDiscount = await discount.findOne({ code, shopId: convertToObjectIdMongoose(shopId) }).lean()

        if (!foundDiscount || !foundDiscount.isActive) {
            throw new NotFoundError('Discount not exists!')
        }
        const { appliesTo, productIds } = foundDiscount
        let products
        if (appliesTo === 'all') {
            products = await findAllProducts({
                filter: {
                    shop: convertToObjectIdMongoose(shopId),
                    isPublish: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['name']
            })
        }
        if (appliesTo === 'specific') {
            products = await findAllProducts({
                filter: {
                    _id: {
                        $in: productIds
                    },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['name']
            })
        }
        return products
    }

    static async getAllDiscountCodeByShop({
        limit, page, shopId
    }) {
        return await findAllDiscountCodesUnselect({
            limit: +limit,
            page: +page,
            filter: {
                shopId: convertToObjectIdMongoose(shopId),
                isActive: true,
                unselect: ['__v', 'shopId'],
                model: discount
            }
        })
    }

    static async getDiscountAmount({ codeId, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                code: codeId,
                shopId: convertToObjectIdMongoose(shopId)
            }
        })
        if (!foundDiscount) throw new NotFoundError('Discount does not exists!')
        const now = new Date()
        const { isActive, maxUses, startDate, endDate, minOrderValue, maxUsesPerUser, usersUsed, type, value } = foundDiscount
        if (!isActive) throw new NotFoundError('Discount expired!')
        if (!maxUses) throw new NotFoundError('Discount is out!')
        if (now > new Date(endDate)) throw new NotFoundError('Discount expired')

        let totalOrder = 0
        if (minOrderValue > 0) {
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)
            if (totalOrder < minOrderValue)
                throw new NotFoundError(`Discount requires a minium order value of ${minOrderValue}`)
        }

        if (maxUsesPerUser > 0) {
            const userDiscount = usersUsed.find(user => user.userId === userId)
            if (userDiscount && userDiscount.length > maxUsesPerUser) {
                throw new NotFoundError(`Per users can use ${maxUsesPerUser} time`)
            }
        }

        const amount = type === 'fixed_amount' ? value : totalOrder * (value / 100)

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscountCode({ shopId, codeId }) {
        return discount.findOneAndDelete({
            code: codeId,
            shopId: convertToObjectIdMongoose(shopId)
        });
    }

    static async cancelDiscountCode ({codeId, shopId, userId}) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                code: codeId,
                shopId: convertToObjectIdMongoose(shopId)
            }
        })
        if (!foundDiscount) {
            throw new NotFoundError('Discount does not exists!')
        }

        return discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                usersUsed: userId
            },
            $inc: {
                maxUses: 1,
                usesCount: -1
            }
        });
    }
}
module.exports = DiscountService
