const express = require('express');
const { connectToDatabase } = require('../src/utils/database');
const bodyParser = require('body-parser');
const userRouter = require('../src/routes/usersRoutes');
//const projectsRoutes = require('../src/routes/projectsRoutes');
const addHeaders = require('./middlewares/addHeaders');
const { logErrors, errorHandler, errorNotFound } = require('./middlewares/errorHandler')
const cors = require('cors')

// Crear la aplicación de Express
const app = express();

// Configurar el puerto
const port = process.env.PORT || 3000;

// // Configurar la conexión a la base de datos
connectToDatabase()

//Colocamos cors
app.use(cors())

// Configurar el middleware para parsear el cuerpo de las solicitudes HTTP
app.use(addHeaders);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rutas
app.use('/api/users', userRouter);
//app.use('/api/projects', projectsRoutes);

//Middlewares de error
app.use(logErrors);
app.use(errorNotFound);
app.use(errorHandler);

// Iniciar el servidor
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server Running on port ${port}`);
    });
}


module.exports = app;