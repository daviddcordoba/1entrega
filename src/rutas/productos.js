const { Router } = require('express');

const routerProductos = Router();

const control = require('../controladores/productsController');

const productsController = new control('productos.txt');

/* ---------- GET ------------ */

// Obtener todos los productos
routerProductos.get('/', async (req, res) => {
    const productos = await productsController.getAll();

    res.json(productos)
})

// Obtener por ID
routerProductos.get('/:id', async (req, res) => {
    const producto = await productsController.getById(req.params.id);

    !producto ? res.json({ error: 'producto no encontrado' }) : res.json(producto);
})

/* ---------- POST ------------ */

// Agregar un producto
routerProductos.post('/', async (req, res) => {

    await productsController.save(req.body, true);
    res.redirect('/productos'); // cuando guardo me redirecciona para volver a agregar
})


/* ---------- PUT ------------ */

// Actualizar un producto
routerProductos.put('/:id', async (req, res) => {
    const productoParaActualizar = await productsController.getById(req.params.id);

    if (!productoParaActualizar) {
        res.json({ error: 'producto no encontrado' })
    } else {
        await productsController.deleteById(req.params.id);

        const { title, price, thumbnail } = req.body;

        productoParaActualizar.title = title;
        productoParaActualizar.price = price;
        productoParaActualizar.thumbnail = thumbnail;
        productoParaActualizar.id = parseInt(req.params.id);

        await productsController.save(productoParaActualizar, false);

        res.json(req.body)
    }

})

/* ---------- DELETE ------------ */

// Eliminar un producto
routerProductos.delete('/:id', async (req, res) => {
    const productoParaEliminar = await productsController.getById(req.params.id);

    if (!productoParaEliminar) {
        res.json({ error: 'producto no encontrado' })
    } else {
        await productsController.deleteById(req.params.id);
        res.json({ msg: 'producto eliminado' })
    }
})

module.exports = routerProductos;