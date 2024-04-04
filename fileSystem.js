import {promises as fs} from 'fs'

class ProductManager {
    constructor(){
        this.patch = "./productos.txt"
        this.products = []
    }

    static id = 0

    addProduct = async (title, description, price, thumbnail, code, stock) => {

        ProductManager.id++;

        let newProduct = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            id: ProductManager.id
        };

        this.products.push(newProduct);

        await fs.writeFile(this.patch, JSON.stringify(this.products));
    };

    readProducts = async () => {
        let respuesta = await fs.readFile(this.patch, "utf-8");
        return JSON.parse(respuesta);
    }

    getProducts = async () => {
        let respuesta2 = await this.readProducts();
        return console.log(respuesta2);
    }

    getProductsById = async (id) => {
        let respuesta3 = await this.readProducts()
        if(!respuesta3.find(product => product.id === id)){
            console.log("Producto no encontrado")
        } else {
            console.log(respuesta3.find((product) => product.id === id))
        }
    }

    deleteProducts = async (id) => {
        let respuesta3 = await this.readProducts();
        let productFilter = respuesta3.filter(products => products.id != id);
        await fs.writeFile(this.patch, JSON.stringify(productFilter));
        console.log("Producto eliminado")
    }

    updateProducts = async ({id, ...producto}) => {
        await this.deleteProducts(id);
        let oldProduct = await this.readProducts();
        let updatedProduct = [{...producto, id},...oldProduct];
        await fs.writeFile(this.patch, JSON.stringify(updatedProduct));
    }
}

const productos = new ProductManager();

// productos.addProduct("titulo1", "Descripcion1", "400", "imagen1", "ba1", 5);
// productos.addProduct("titulo2", "Descripcion2", "800", "imagen2", "ba2", 9);
// productos.addProduct("titulo3", "Descripcion3", "200", "imagen3", "ba3", 6);

//Se crea el archivo .txt con los 3 productos
// productos.getProducts()

//Buscamos el producto por su ID
// productos.getProductsById(1)

//Se borra el producto según su ID
// productos.deleteProducts(2)

//Se modifica un producto
// productos.updateProducts({
//     title: 'titulo3',
//     description: 'Descripcion3',
//     price: '1000',
//     thumbnail: 'imagen3',
//     code: 'ba3',
//     stock: 6,
//     id: 3
// })