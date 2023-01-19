const fs = require("fs");

class Contenedor {
  constructor(fileName, keys) {
    this._filename = fileName;
    this._keys = [...keys, "id"]; //las keys son los valores
    this._readFileOrCreateNewOne();
  }
  
  _validateKeysExist(newData) { // para ver si la id que me pasan esta bien
    
    const objectKeys = Object.keys(newData); // se va ir guardando las id que le pase en el array
    console.log(objectKeys);
    let exists = true;
    
    objectKeys.forEach((key) => { // la idea es que es _keys este id entonces pora cada key en objectKey se fije si esta el mismo valor osea id con id
        if(!this._keys.includes(key)) {
            exists = false;
        }
    })
    console.log(`desde validated: ${objectKeys}`);
    return exists;
  }

  async _readFileOrCreateNewOne() {
    try {
      await fs.promises.readFile(this._filename, "utf-8");
    } catch (error) {
      error.code === "ENOENT" // si no puedo abrir el archivo..
        ? this._createEmptyFile()
        : console.log(
            `Error Code: ${error.code} | Hubo un error al intntar leer ${this._filename}`
          );
    }
  }

  async _createEmptyFile() {
    fs.writeFile(this._filename, "[]", (error) => {
      error
        ? console.log(error)
        : console.log(`Archivo ${this._filename} creado por primera vez`);
    });
  }

  async getById(id) {
    id = Number(id);
    try {
      const data = await this.getData();
      const parsedData = JSON.parse(data);

      return parsedData.find((producto) => producto.id === id);
    } catch (error) {
      console.log(
        `Error Code: ${error.code} | Hubo un error al intentar traer el elemento con ID (${id})`
      );
    }
  }

  async deleteById(id) {
    try {
      id = Number(id);
      const data = await this.getData();
      const parsedData = JSON.parse(data);
      const objectIdToBeRemoved = parsedData.find(
        (producto) => producto.id === id
      );

      if (objectIdToBeRemoved) {
        const index = parsedData.indexOf(objectIdToBeRemoved);
        parsedData.splice(index, 1);
        await fs.promises.writeFile(this._filename, JSON.stringify(parsedData));
        return true;
      } else {
        console.log(`ID ${id} no existe`);
        return null;
      }
    } catch (error) {
      console.log(
        `Error Code: ${error.code} | Hubo un error al intentar eliminar el elemnto con ID (${id})`
      );
    }
  }

  async updateById(id, newData) {
    
    if(this._validateKeysExist(newData)){
      try {
        id = Number(id);
        const data = await this.getData();
        
        const parsedData = JSON.parse(data);
        
        const objectIdToBeUpdated = parsedData.find(
          (producto) => producto.id === id
        );

        
        if (objectIdToBeUpdated) {
          const index = parsedData.indexOf(objectIdToBeUpdated);
          
          objectKeys.forEach( (key) => {
            parsedData[index][key] = newData[key];
          })

          console.log(objectKeys);
          
          
          await fs.promises.writeFile(this._filename, JSON.stringify(parsedData));
          return true;
        } else {
          console.log(`ID ${id} no existe`);
          return null;
        }
  
      } catch (error) {
        `Error Code: ${error.code} | Hubo un error al intentar actualizar el elemento con ID (${id})`
      }
    } else {
      return false;
    }
  }
  
  async addToArrayById(id, objectToAdd) {
    if(this._validateKeysExist(objectToAdd)) {
    try {
      id = Number(id);
      const data = await this.getData();
      const parsedData = JSON.parse(data);
      const objectIdToBeUpdated = parsedData.find(
        (producto) => producto.id === id
      );
      if (objectIdToBeUpdated) {
        const index = parsedData.indexOf(objectIdToBeUpdated);
        
        const valorActual = parsedData[index][objectKey];
        
        const newArray = [...valorActual, objectToAdd[objectKey]];
        
        
        
        parsedData[index][objectKey] = newArray;
        
        await fs.promises.writeFile(this._filename, JSON.stringify(parsedData));
        return true;
      } else {
        console.log(`ID ${id} no encontrada`);
        return false;
      }

    } catch (error) {
      `Error Code: ${error.code} | Hubo un error al intentar agregar el producto con ID (${id})`
    }
    } else {
      return false;
    }
  }

  async removeFromArrayById(id, objectToRemoveId, keyName) {
    try {
      id = Number(id);
      const data = await this.getData();
      const parsedData = JSON.parse(data);
      
      const objectIdToBeUpdated = parsedData.find(
        (producto) => producto.id === id
      );
      
      if (objectIdToBeUpdated) {
        const index = parsedData.indexOf(objectIdToBeUpdated);
        
        const valorActual = parsedData[index][keyName];
        let indexToBeRemoved = -1;
        valorActual.forEach((element, indexE) => {
          if(element.id == objectToRemoveId) {
            indexToBeRemoved = indexE
          }
        })
        const newArray = [...valorActual];
        
        if (indexToBeRemoved>-1) {
          console.log(indexToBeRemoved)
          newArray.splice(indexToBeRemoved,1)
        }
    
        parsedData[index][keyName] = newArray;
        await fs.promises.writeFile(this._filename, JSON.stringify(parsedData));
        return true;
      } else {
        console.log(`ID ${id} no existe`);
        return false;
      }

    } catch (error) {
      `Error Code: ${error.code} | Hubo un error al intentar borrar el elemento con ID (${id})`
    }
  
  }

  async save(object) {    
    if(this._validateKeysExist(object)) {
      try {
        const allData = await this.getData();
        const parsedData = JSON.parse(allData);
  
        object.id = parsedData.length + 1;
        parsedData.push(object);
  
        await fs.promises.writeFile(this._filename, JSON.stringify(parsedData));
        return object; // retorno el objeto entero para despues poder usar el punto
      } catch (error) {
        console.log(
          `Error Code: ${error.code} | Hubo un error al intentar guardar`
        );
      }
    } else {
      return false;
    }
    
  }

  async deleteAll() {
    try {
      await this._createEmptyFile();
    } catch (error) {
      console.log(
        `Hubo un error (${error.code}) al intentar borrar todo`
      );
    }
  }

  async getData() {
    const data = await fs.promises.readFile(this._filename, "utf-8");
    return data;
  }

  async getAll() {
    const data = await this.getData();
    return JSON.parse(data);
  }
}

module.exports = Contenedor;