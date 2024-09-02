const { ProductDaosMongo } = require('../../daos/MONGO/productsDaos.mongo')
const { CartDaosMongo } = require('../../daos/MONGO/cartsDaos.mongo')
const { Router } = require('express')

const productService = new ProductDaosMongo
const cartService = new CartDaosMongo
const router = Router()

//HOME
router.get('/' , async (req , res) => {
    try{
        const page = parseInt(req.query.page) || 1
        const limit = 9
        
        const skip = (page - 1) * limit
        const mongoProducts = await productService.getProducts({} , limit , skip , {}) //COPIA DE 'mongoProducts'
        const products = mongoProducts.map(product => ({ ...product._doc }))

        const totalProducts = await productService.getCountedProducts({})
        const totalPages = Math.ceil(totalProducts / limit)

        let isProducts = products.length== 0 ? true : false
        products.forEach((product) => {

            product.price = ponerComas(product.price) //AGREGAMOS LAS COMAS
            product.stock = ponerComas(product.stock) //AGREGAMOS LAS COMAS

            product.price = product.price.toString().trim().toUpperCase()
            product.stock = product.stock.toString().trim().toUpperCase()
            product.category = product.category.trim().toUpperCase()
            product.title = product.title.trim().toUpperCase()
            product.code = product.code.trim().toUpperCase()
        })

        const prevLink = page > 1 ? `/?page=${page - 1}` : null;
        const nextLink = page < totalPages ? `/?page=${page + 1}` : null;

        res.render('home.handlebars' , {
            hasNextPage: page < totalPages,
            totalPages: totalPages,
            isProducts: isProducts,
            hasPrevPage: page > 1,
            products: products,
            prevLink: prevLink,
            nextLink: nextLink,
            currentPage: page,
            style: 'home.css',
            title: 'Home'
        })
    }catch(error){
        console.error(error)
    }
})

//REAL TIME PRODUCTS
router.get('/realTimeProducts' , (req , res) => {
    res.render('realTimeProducts.handlebars' , {
        style: 'realTimeProducts.css',
        title: 'Real Time'
    })
})

//CARTS | CART ID
router.get('/carts/:cid' , async (req , res) => {
    const { cid } = req.params
    const mongoCart = await cartService.getCart(cid)
    const cart = mongoCart.products.map(cart => ({ ...cart._doc })) //COPIA DE 'mongoCart'

    let isProducts = cart.length== 0 ? true : false
    cart.forEach((productInCart) => {

        productInCart.product.price = ponerComas(productInCart.product.price.toString().trim().toUpperCase())
        productInCart.product.stock = ponerComas(productInCart.product.stock.toString().trim().toUpperCase())
        productInCart.quantity = ponerComas(productInCart.quantity.toString().trim().toUpperCase())
        productInCart.product.category = productInCart.product.category.trim().toUpperCase()
        productInCart.product.title = productInCart.product.title.trim().toUpperCase()
        productInCart.product.code = productInCart.product.code.trim().toUpperCase()
        productInCart.product._id = productInCart.product._id.toString()
    })

    const cartCopy = cart.map(prod => ({
        _id: prod.product._id.toString(),
        category: prod.product.category,
        title: prod.product.title,
        price: prod.product.price,
        stock: prod.product.stock,
        code: prod.product.code,
        quantity: prod.quantity,
    }))

    res.render('cart.handlebars' , {
        isProducts: isProducts,
        cartProducts: cartCopy,
        style: 'cart.css',
        title: 'Cart',
        id: cid
    })
})

//FUNCIONES
function ponerComas(value){
    let float = parseFloat(value)
    let parseado = float.toLocaleString('en-US', { maximumFractionDigits: 0 })

    return parseado
}

module.exports = router