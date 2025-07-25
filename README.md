# E-Commerce Backend con Node.js, Express y MongoDB

Este proyecto es un backend para una tienda e-commerce que permite manejar productos, carritos de compra, y vistas dinámicas utilizando Handlebars. Además, se pueden cargar productos con imágenes usando Multer.

## Características principales

- Gestión de productos (crear, leer, actualizar, eliminar)
- Gestión de carritos y productos dentro de los mismos
- Paginación, filtrado por categoría y ordenamiento por precio
- Carga de imágenes con `multer`
- API RESTful con endpoints compatibles con Postman
- Vistas dinámicas con `handlebars`
- Conexión a base de datos MongoDB con `mongoose`

---

## Instalación

1. Cloná el repositorio:
   ```bash
   git clone https://github.com/tuusuario/tu-repo.git
   cd tu-repo
   ```
2. Instalá las dependencias:
   ```bash
   npm install
   ```
3. Configurá tu archivo .env si es necesario.
4. Iniciá el servidor:
   ```bash
   npm start
   ```
   o en desarrollo:
   ```bash
   npm run dev
   ```
## Endpoints de la API
La API expone las siguientes rutas principales:

Productos
Método	Ruta	Descripción
- GET	/api/products	Listar productos con paginación, filtro y orden
- GET	/api/products/:pid	Obtener producto por ID
- POST	/api/products	Crear producto
- POST	/api/products/thumbnail	Crear producto con imagen
- PUT	/api/products/:pid	Actualizar producto
- DELETE	/api/products/:pid	Eliminar producto

Filtros disponibles: ?category=laptops, ?sort=asc o ?sort=desc, ?limit=5&page=2

Carritos
Método	Ruta	Descripción
- POST	/api/carts	Crear carrito nuevo
- GET	/api/carts/:cid	Obtener carrito con productos
- POST	/api/carts/:cid/products/:pid	Agregar producto al carrito
- DELETE	/api/carts/:cid/products/:pid	Eliminar producto del carrito
- DELETE	/api/carts/:cid	Vaciar el carrito

## Vistas con Handlebars
/ → Listado de productos con paginación

/products/:pid → Detalle del producto

/carts/:cid → Vista de un carrito específico

## Carga de imágenes
Las imágenes se almacenan en la carpeta /public/img y se acceden desde la vista mediante rutas relativas como:
   ```bash
    <img src="/img/nombre-imagen.jpg" />
   ```

## Tecnologías utilizadas
Node.js

Express

MongoDB + Mongoose

Handlebars

Multer

Toastify (para notificaciones)

Postman (pruebas)

## Autor
Desarrollado por Nehuel Caraballo.

## Licencia
Este proyecto se distribuye bajo la licencia MIT.
