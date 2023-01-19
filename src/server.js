const express = require('express');
const app = express();

const Contenedor = require('./contenedor');

const Productos = new Contenedor("productos.json",["timestamp", "title", "price", "description", "code", "image", "stock"] );
const Carrito = new Contenedor("carrito.json", ["timestamp", "products"]);


app.use(express.json());
app.use(express.urlencoded({extended:true}));

const routerProducts = express.Router();
const routerCart = express.Router();

app.use('/api/productos', routerProducts);
app.use('/api/carrito', routerCart);

                                                /* Products Endpoints */
routerProducts.get('/', async (req, res) => {
    const products = await Productos.getAll();
    res.status(200).json(products);
})

routerProducts.get('/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Productos.getById(id);
    
    product
            ? res.status(200).json(product)
            : res.status(400).json({"error": "El producto no existe"})
})

routerProducts.post('/', async (req,res, next) => {
    const {body} = req;
    
    body.timestamp = Date.now();
    
    const newProduct = await Productos.save(body);
    
    newProduct
        ? res.status(200).json({"success" : "Producto agregado: "+ newProduct.title})
        : res.status(400).json({"error": "Algo salio mal, revisar body"})
})

routerProducts.put('/:id',async (req, res, next) => { //problemas aca ---> contenedor.js-linea 99?
    const {id} = req.params;
    const {body} = req;
    
    const productUpdated = await Productos.updateById(id,body);
    console.log(productUpdated);
    
    productUpdated
        ? res.status(200).json({"success" : "Producto actualizado"})
        : res.status(404).json({"error": `Producto no actualizado`})
})

routerProducts.delete('/:id',async (req, res, next) => {
    const {id} = req.params;
    const productDeleted = await Productos.deleteById(id);
    
    productDeleted 
        ? res.status(200).json({"success": "Producto eliminado"})
        : res.status(404).json({"error": "Producto no eliminado"})
})

                                                /* Cart Endpoints */
routerCart.get('/', async (req, res) => {
    const cart = await Carrito.getAll();
    res.status(200).json(cart);
})
routerCart.post('/', async(req, res) => {
    const {body} = req;
    
    body.timestamp = Date.now();
    
    const newCart = await Carrito.save(body);
    
    newCart
        ? res.status(200).json({"success" : "Carrito creado"})
        : res.status(400).json({"error": "Carrito no creado"})
})

routerCart.delete('/:id', async (req, res) => {
    const {id} = req.params;
    const cartDeleted = await Carrito.deleteById(id);
    
    cartDeleted 
        ? res.status(200).json({"success": "Carrito eliminado"})
        : res.status(404).json({"error": "Carrito no eliminado"})
})

routerCart.post('/:id/productos', async(req,res) => {
    const {id} = req.params;
    const { body } = req;
    
    const product = await Productos.getById(body['id']);    // tengo que buscar un producto en mi lista de productos y por la id mandarlo al carri
    
    if (product) { //si existe el producto que estoy buscando
        const cart = await Carrito.addToArrayById(id, {"products": product}); //lo agrego al carrito
        cart
            ? res.status(200).json({"success" : "Producto agregado al carrito"})
            : res.status(404).json({"error": "Producto no agregado al carrito"})
    } else {
        res.status(404).json({"error": "Producto no encontrado, verificar el id"})
    }
})

routerCart.get('/:id/productos', async(req, res) => {
    const { id } = req.params;
    const newProductIncart = await Carrito.getById(id)
    
    newProductIncart
        ? res.status(200).json(cart.products)
        : res.status(404).json({"error": "Carrito no encontrad"})
})


routerCart.delete('/:id_cart/productos/:id_prod', async(req, res) => {
    const {id_cart, id_prod } = req.params;
    const productExists = await Productos.getById(id_prod);
    if (productExists) {
        const deletedFromCart = await Carrito.removeFromArrayById(id_cart, id_prod, 'products')
        deletedFromCart
            ? res.status(200).json({"success" : "Productos eliminados"})
            : res.status(404).json({"error": "Productos no eliminados"})
    } else {
        res.status(404).json({"error": "Productos no encontrados"})
    }
})


const PORT = 8080;
const server = app.listen(PORT, () => {
console.log(` >>>>>  Server andando en http://localhost:${PORT}`)
})

server.on('error', (err) => console.log(err));

/* NO anda:

1) /api/productos

*put para actualizar, el erro esta en _validateKeysExist


2) /api/carrito/1/productos
* no me pasa la linea 99 

3) routerCart.get('/:id/productos' ...

4)routerCart.delete tampoco

*/