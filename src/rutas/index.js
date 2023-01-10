const express = require('express');
const router = express.Router();

const productos = require('./productos');
const carrito = require('./carrito');

router.use('/productos',productos);
router.use('/carrito',carrito);

module.exports = router;
