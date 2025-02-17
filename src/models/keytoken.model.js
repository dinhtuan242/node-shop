'use strict'

const { model, Schema } = require('mongoose'); // Erase if already required


const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        refer: 'Shop'
    },
    publicKey: {
        type: String,
        require: true,
        trim: true
    },
    privateKey: {
        type: String,
        require: true,
        trim: true
    },
    refreshTokensUsed: {
        type: Array,
        default: []
    },
    refreshToken: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema)