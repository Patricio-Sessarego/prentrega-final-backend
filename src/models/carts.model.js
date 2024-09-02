const { Schema , model } = require('mongoose')
const collectionName = 'carts'

const CartsSchema = new Schema({
    products: {
        type: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: {
                type: Number
            },
            _id: false
        }]
    }
})

//POPULTATION
CartsSchema.pre('findOne' , function(){
    this.populate('products.product')
})

const cartModel = model(collectionName , CartsSchema)

module.exports = {
    cartModel
}