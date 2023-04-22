const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('../src/routes/usersRoutes');
const cors = require('cors')

// Crear la aplicación de Express
const app = express();

// Configurar el puerto
const port = process.env.PORT || 3000;

// // Configurar la conexión a la base de datos


//Colocamos cors
app.use(cors())

// Configurar el middleware para parsear el cuerpo de las solicitudes HTTP
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rutas
app.use('/api/users', userRouter);

// Iniciar el servidor
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server Running on port ${port}`);
    });
}


module.exports = app;