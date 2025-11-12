# E-Commerce Backend con Node.js, Express y MongoDB

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express.js-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)
![Docker](https://img.shields.io/badge/Docker-Container-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

Este proyecto es un backend completo para una tienda e-commerce desarrollado con **Node.js**, **Express** y **MongoDB**.  
Permite gestionar productos, carritos y usuarios, además de contar con vistas dinámicas creadas con **Handlebars**.  
El sistema incluye autenticación mediante **email y contraseña** o **cuenta de GitHub**, envío automático de tickets de compra por correo electrónico y la posibilidad de enviar SMS con **Twilio**.  
Además, el proyecto está **documentado con Swagger** y **containerizado con Docker** para facilitar su despliegue y uso.

---

## Características principales

- Gestión completa de productos: creación, lectura, actualización y eliminación.
- Gestión de carritos de compra: agregar, eliminar o vaciar productos.
- Autenticación de usuarios con **email y contraseña** o mediante **GitHub**.
- Vista de perfil de usuario.
- Vista de listado de productos y detalle individual.
- Proceso de compra con generación automática de **ticket de compra**.
- Envío de tickets al correo del cliente mediante **Nodemailer**.
- Envío de mensajes SMS utilizando **Twilio** (desde Postman).
- Vistas dinámicas con **Handlebars**.
- API RESTful compatible con **Postman**.
- Conexión a **MongoDB** mediante **Mongoose**.
- Paginación, filtrado y ordenamiento de productos.
- **Documentación interactiva con Swagger**.
- **Docker** para despliegue fácil y aislado.

---

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB + Mongoose
- Handlebars
- Multer
- Nodemailer
- Twilio
- Passport + GitHub OAuth
- Bcrypt (encriptación de contraseñas)
- Toastify (notificaciones en vistas)
- Postman (para pruebas de endpoints)
- **Swagger (OpenAPI 3.0)**
- **Docker**

---

## Instalación

### Opción 1: Ejecución local

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/tuusuario/tu-repo.git
   cd tu-repo
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Configurar el archivo .env con las credenciales necesarias:

   ```bash
   PORT=8080
   MONGO_URL=mongodb+srv://...
   GITHUB_CLIENT_ID=...
   GITHUB_CLIENT_SECRET=...
   GMAIL_USER=tu_correo@gmail.com
   GMAIL_PASS=tu_contraseña_o_token
   TWILIO_SID=...
   TWILIO_AUTH_TOKEN=...
   TWILIO_PHONE=...
   ```

4. Iniciar el servidor:

   ```bash
   npm start
   # o en modo desarrollo:
   npm run dev
   ```

### Opción 2: Ejecución con Docker

Podés correr el proyecto directamente desde la imagen publicada en Docker Hub:

```bash
   docker pull nehuis/backend-cluster-docker:1.0.0
```

Ejecutar el contenedor:

```bash
   docker run -d \
   p 8080:8080 \
   --name backend-ecommerce \
   -e MONGO_URL=mongodb://host.docker.internal:27017/backend \
   -e PORT=8080 \
   nehuis/backend-cluster-docker:1.0.0
```

Imagen en Docker Hub:

<https://hub.docker.com/r/nehuis/backend-cluster-docker>

---

## Endpoints principales de la API

### Productos

| Método | Ruta                      | Descripción                               |
| ------ | ------------------------- | ----------------------------------------- |
| GET    | `/api/products`           | Listar productos con paginación y filtros |
| GET    | `/api/products/:pid`      | Obtener producto por ID                   |
| POST   | `/api/products`           | Crear nuevo producto                      |
| POST   | `/api/products/thumbnail` | Crear producto con imagen (Multer)        |
| PUT    | `/api/products/:pid`      | Actualizar producto                       |
| DELETE | `/api/products/:pid`      | Eliminar producto                         |

### Carritos

| Método | Ruta                            | Descripción                   |
| ------ | ------------------------------- | ----------------------------- |
| POST   | `/api/carts`                    | Crear carrito nuevo           |
| GET    | `/api/carts/:cid`               | Obtener carrito con productos |
| POST   | `/api/carts/:cid/products/:pid` | Agregar producto al carrito   |
| DELETE | `/api/carts/:cid/products/:pid` | Eliminar producto del carrito |
| DELETE | `/api/carts/:cid`               | Vaciar carrito                |

---

## Documentación Swagger

El proyecto cuenta con documentación interactiva generada con Swagger UI, accesible desde el navegador.

- Ruta de acceso:
  <http://localhost:8080/api/docs>
- Formato OpenAPI 3.0
- Permite:
  - Probar endpoints directamente desde el navegador.
  - Ver los parámetros esperados, esquemas y respuestas.
  - Autenticarse con JWT si la ruta lo requiere.

Las especificaciones Swagger se encuentran en la carpeta:

```bash
    /src/docs/
```

---

## Vistas con Handlebars

- `/` → Página principal con listado de productos (paginación y filtros)
- `/products/:pid` → Detalle del producto
- `/carts/:cid` → Vista del carrito de compra
- `/views/users/register` → Registro de usuario
- `/views/users/login` → Inicio de sesión
- `/profile` → Perfil del usuario logueado

---

## Envío de tickets y SMS

- Al completar una compra, el sistema genera automáticamente un ticket de compra.
- El ticket se envía al correo electrónico del cliente mediante Nodemailer.
- Además, desde Postman se pueden enviar mensajes SMS utilizando Twilio.

---

## Licencia

Este proyecto se distribuye bajo la licencia MIT.

## Autor

Desarrollado por Nehuel Caraballo.
