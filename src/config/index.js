const { connect } = require('mongoose')
const { productModel } = require('../models/products.model')
const { cartModel } = require('../models/carts.model')

module.exports.connectDB = async () => {
    console.log('BASE DE DATOS CONECTADA')
    return await connect('mongodb+srv://Patricio-Sessarego:Patricio2005@clustercoderhouse.jdm36.mongodb.net/ProyectoFinal?retryWrites=true&w=majority&appName=ClusterCoderHouse')


    //CARGA 50 PRODUCTOS
    const products = [];
    for (let i = 1; i <= 50; i++) {
        products.push({
            title: `Producto ${i}`,
            category: 'Gaming',
            price: i,
            stock: i,
            code: i
        });
    }
    
    await productModel.insertMany(products)
}