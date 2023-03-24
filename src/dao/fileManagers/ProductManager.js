import fs from 'fs'
import __dirname from '../utils.js';

export default class ProductManager {
        constructor() {
            this.path = `${__dirname}/files/Products.json`;
            //this.path = '../files/Products.json'
        }
    
        addProduct = async (title, description, price, thumbnail, code, stock) => {

            const products = await this.getProducts()

            try {
    
                const product = {
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock
                }
    
                if (products.length === 0) {
                    product.id = 1
                } else {
                    product.id = products[products.length - 1].id + 1
                }
    
                const codeIndex = products.findIndex(e => e.code === product.code)
    
                const values = Object.values(product)

                const valuesString = values.filter(e => typeof e == 'string') 

                const checkTrim = valuesString.findIndex(e => e.trim() === "") 
    
    
                if (codeIndex === -1 && checkTrim === -1) {
                    products.push(product)
                } else {
                    codeIndex !== -1 && console.error('El identificador ya existe')
                    checkTrim !== -1 && console.error('Debe completar todos los campos')
                }
    
    
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
    
                return product
    
            } catch (error) {
                console.log(error)
            }
    
        }
    
        getProducts = async () => {
            try {
    
                if (fs.existsSync(this.path)) {
                    const data = await fs.promises.readFile(this.path, 'utf-8')
                    const products = JSON.parse(data)
                    return products
                } else {
                    return []
                }
    
            } catch (error) {
                console.log(error)
            }
        }
    
        getProductById = async (idProduct) => {

            const products = await this.getProducts()

            const productFind = products.find(e => e.id === idProduct)
            if (productFind == undefined) {
                console.error('Not found')
                return
            } else {
                const find = products.find(e => e.id === idProduct)
                console.log('El producto buscado es:')
                console.log(find)
                return find
            }
        }
    
        updateProduct = async (idProduct, key) => {
            const products = await this.getProducts()
            let productIndex = products.findIndex(e => e.id === idProduct)
            if (productIndex === -1) {
                console.log('Produdcto no encontrado')
                return
            }
            let product = products[productIndex]
            const newProduct = {
                ...product,
                newPrice: key
            }
            await this.deleteProduct(newProduct.id)
            products.push(newProduct)
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
        }
    
        deleteProduct = async (idProduct) => {
            const objs = await this.getProducts()
            const index = objs.findIndex(o => o.id == idProduct)
            if (index == -1) {
                throw new Error(`Error: no se encontró el id ${idProduct}`)
            }

            objs.splice(index, 1)
            try {
                await fs.promises.writeFile(this.path, JSON.stringify(objs, null, 2))
            } catch (error) {
                throw new Error(`Error: ${error}`)
            }
        }
    }