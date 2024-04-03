class ProductManager {
    constructor(){
        this.products = [];
    }

    static id = 0

    addProduct(title, description, price, thumbnail, code, stock){
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].code === code) {
                console.log(`El código ${code} se repite`);
                break;
            }
        }

        const newProducts = {
            title, 
            description, 
            price, 
            thumbnail, 
            code, 
            stock
        }

        if (!Object.values(newProducts).includes(undefined)) {
            ProductManager.id++;
            this.products.push({
                ...newProducts,
                id:ProductManager.id 
            });
        } else{
            console.log("Se requieren todos los campos")
        }
    }

    getProduct() {k
        return this.products;
    }

    exist(id) {
        return this.products.find((producto) => producto.id === id);
    }

    getProductById(id) {
        !this.exist(id) ? console.log("Not found") : console.log(this.exist(id));
    } 
}

const productos = new ProductManager

//Array vacio
console.log(productos.getProduct())

//Agregamos productos
productos.addProduct('titulo1', 'descripcion1', 500, 'imagen1', 'a1', 6)
productos.addProduct('titulo2', 'descripcion2', 800, 'imagen2', 'a2', 7) 

//Array con producto
console.log(productos.getProduct())

//Se valida que el CODE no se repita
productos.addProduct('titulo3', 'descripcion3', 200, 'imagen3', 'a2', 5)

//Busqueda de producto por ID
productos.getProductById(2)

//Producto "Not found"
productos.getProductById(4)