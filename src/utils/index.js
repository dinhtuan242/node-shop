'use strict'

const _ = require('lodash')
const { Types } = require('mongoose')
const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}
const unSelectData = (unSelect = []) => {
    return Object.fromEntries(unSelect.map(el => [el, 0]))
}

const removeUndefinedObject = (object) => {
    Object.keys(object).forEach(key => {
        if (object[key] === null) {
            delete object[key]
        }
    })

    return object
}

const updateNestedObjectParser = (object) => {
    const result  = {}
    Object.keys(object).forEach(i => {
        if (object[i] && typeof object[i] === 'object' && !Array.isArray(object[i])) {
            const response = updateNestedObjectParser(object[i])
            Object.keys(object[i]).forEach(j => {
                result[`${i}.${j}`] = response[j]
            })
        } else {
            result[i] = object[i]
        }
    })
    return result
}

const convertToObjectIdMongoose = id => {
    return new Types.ObjectId(id)
}

module.exports = {
    getInfoData,
    getSelectData,
    unSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectIdMongoose,
}
