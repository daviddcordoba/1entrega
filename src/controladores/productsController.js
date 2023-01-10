const fs = require('fs');

class productsOperations{

    constructor(){
        this.path = 'productos.txt';
    }

    async getAll(){
        try{
            if(!fs.existsSync(this.path)){
                console.log('El archivo no existe, debes crearlo');
            }

            let data = await fs.promises.readFile(this.path,'utf-8');
            if(data == '' || data.length == 0){
                console.log('El archivo esta vacio');
            }

            data = JSON.parse(data);
            data = data.sort( (a,b) => a.id - b.id);
            return data;
        }
        catch(error) {
            console.log(`Error: ${error}`);
            
            await fs.promises.writeFile(this.path, '[]')
            const file = await fs.promises.readFile(this.path, 'utf-8')
            const arrayItems = JSON.parse(file)
            
            
            return arrayItems
        }
    }

    async getById(id){
        try{
            if( !id || typeof id != 'number'){
                console.log('Debes ingresar un numero para el id');
            }
            
            let data = await fs.promises.readFile(this.path,'utf-8')
            if( data == '' || data.length == 0){
                console.log('El archivo esta vacio');
            }

            data = JSON.parse(data);

            const found = data.find( prod => prod.id == id);

            if(!found){
                console.log('El producto no existe');
            }
            return found;
        }
        catch(error){
            console.log(`Error: ${error}`);
        }
    }

    async deleteById(id) {
        try {
            if (!id || typeof id !== 'number') {
                console.log('Debes ingresar un numero');
            }
            if (!fs.existsSync(this.path)) {
                console.log('El archivo no existe, debes crearlo');
            }
            let data = await fs.promises.readFile(this.path, 'utf-8');
            if (data === '' && data.length === 0) {
                console.log('El archivo esta vacio');
            }
            data = JSON.parse(data);
            const index = data.findIndex((product) => {
                return product.id === id;
            });
            if (index === -1) return 'Producto no encontrado';
            data = data.filter((product) => {
                return product.id != id;
            });
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(data, null, 2),
                'utf-8'
            );
            return 'El producto ha sido eliminado';
            } catch (error) {
                console.log(`Error: ${error}`);
                }
        }

        async save(product) {
            try {
                if (!product || typeof product !== 'object') {
                    console.log('El producto no es un objeto');
                }

                if (Object.keys(product).length === 0) {
                    console.log("No podes agregar un objeto vacio");
                }
                if (!fs.existsSync(this.path)) {
                    await fs.promises.writeFile(
                    this.path,
                    JSON.stringify([], null, 2),
                    'utf-8'
                    );
                }
                let data = await fs.promises.readFile(this.path, 'utf-8');
                let newProduct = {};

                const timestamp = Date.now();
                delete product.admin;
                if (data !== '') {
                    data = JSON.parse(data);
                }
                if (data.length > 0) {
                    data = data.sort((a, b) => a.id - b.id);
                    newProduct = {
                    ...product,
                    id: data[data.length - 1].id + 1,
                    timestamp,
                    };
                    data = [...data, newProduct];
                } else {
                    newProduct = { ...product, id: 1, timestamp };
                    data = [newProduct];
                }
                await fs.promises.writeFile(
                    this.path,
                    JSON.stringify(data, null, 2),
                    'utf-8'
                );
                return newProduct.id;
                } catch (error) {
                    console.log(`Error:${error}`);
                }
        }

        async updateById(id, newProduct) {
            try {
                if (!id || typeof id !== 'number') {
                    throw Error('La id debe ser un numero');
                }
                if (!fs.existsSync(this.path)) {
                    console.log(`El archivo no existe, debes crearlo`);
                }
                const currentProduct = await this.getById(id);
                await this.deleteById(id);

                let data = await this.getAll();
                data = [...data, { id: currentProduct.id, newProduct }];

                await fs.promises.writeFile(
                    this.path,
                    JSON.stringify(data, null, 2),
                    'utf-8'
                );

                return 'Producto actualizado';
            } catch (error) {
                console.log(`Error:${error}`);
            }
        }

        async deleteAll() {
            try {
                if (!fs.existsSync(this.path)) {
                    throw Error('El archivo no existe, debes crearlo');
                }

            let data = await fs.promises.readFile(this.path, 'utf-8');
                if (data === '' && data.length === 0) {
                    console.log('El archivo esta vacio');
                }
            data = JSON.parse(data);
            await fs.promises.writeFile(
                this.path,
                JSON.stringify([], null, 2),
                'utf-8'
            );
            return 'Los productos se borraron';
            } catch (error) {
                console.log(`Error: ${error}`);
            }
    
    }
}

module.exports = productsOperations;

