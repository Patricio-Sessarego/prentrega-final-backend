const productRouter = require('./api/products.router.js')
const cartRouter = require('./api/carts.router.js')
const viewRouter = require('./api/views.router.js')
const { Router } = require('express')
const router = Router()

router.use('/' , viewRouter)
router.use('/api/carts' , cartRouter)
router.use('/api/products' , productRouter)

module.exports = router