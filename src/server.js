const express = require('express');
const {urlencoded} = require('express');

const router = require('./rutas/index.js'); // para que me traiga los /productos y /carrito
const app = express();

app.use(express.json());
app.use(urlencoded({extended: true}));

app.set('port', process.env.PORT || 8080);

//Router base 
app.use('/api', router);

app.use( (req,res,next) =>{
    res.status(404).send({
        status: 404,
        messages: 'Pagina no encontrada'
    })
})

app.listen(app.get('port'), ()=>{
    console.log(`Server escuchando en el puerto ${app.get('port')}`)
})
