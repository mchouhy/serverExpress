// Importación de FileSystem.
const { readFileSync } = require('fs')

// Importación de express JS.
const express = require('express')

// Función que llama a express JS.
const app = express()

// Variable que guarda el número de puerto.
const PUERTO = 8080

// Variable que guarda la ruta del archivo JSON en el que se encuentra el array de productos.
const dbPath = "./productsDB.json"

// Función global que lee el archivo JSON en el que se encuentra el array de productos.
const productsDB = readFileSync(dbPath, "utf-8")

// Método que parsea el formato JSON.
const productsDBContent = JSON.parse(productsDB)

// Función que retorna la ruta raíz del servidor.
app.get("/", (request, response) => {
      response.send("Ruta raíz del servidor")
})

// El servidor corriendo en el puerto 8080.
app.listen(PUERTO, () => {
      console.log(`Escuchando cualquier cambio en el puerto: ${PUERTO}`)
})

// Función que retorna, según el request, los primeros 5 productos (url "localhost:8080/product?limit=5") o todos los productos del array de productos (url "localhost:8080/products")
app.get("/products", (request, response) => {    
      // Se define la variable de límite y se aplica el método para que reemplazo el string por un number.  
      let limit = parseInt(request.query.limit)
      // En caso de que se aplique un query estableciendo una cantidad limitada de productos a retornar se aplica el método slice.
      if(!isNaN(limit)) {
            const limitedProducts = productsDBContent.slice(0, limit)
            const formattedJSON = JSON.stringify(limitedProducts, null, 6)
            response.setHeader('Content-Type', 'application/json')
            response.send(formattedJSON)
      // En los demás casos, se retorna todos los productos del array de productos.
      } else {
            const formattedJSON = JSON.stringify(productsDBContent, null, 6)
            response.setHeader('Content-Type', 'application/json')
            response.send(formattedJSON)
      }
})

// Función que retorna productos según el id ingresado en la ruta "localhost:8080/:id".
app.get("/products/:id", (request, response) => {
      let id = request.params.id
      const product = productsDBContent.find(product => product.id == id)
      if(product) {
            // En caso de encontrar el producto identificado con el id ingresado, retorna el producto requerido.
            response.send(product)
      } else {
            // En caso de no encontrar un producto identificado con el id ingresado, retorna un mensaje de error.
            response.send("Error. No existe un producto con el id ingresado")
      }
})