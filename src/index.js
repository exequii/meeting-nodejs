const cors = require('cors')
const express = require('express');
const bodyParser = require('body-parser');
const routes = require("./delivery/router/router");
const { addHeaders } = require('./delivery/middlewares/addHeaders');
const { logErrors, errorHandler, errorNotFound } = require('./delivery/middlewares/errorHandler')
const { connectToDatabase } = require('./infrastructure/utils/database');

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
app.use('/api/common', routes.commonRoutes)
app.use('/api/users', routes.userRouter);
app.use('/api/projects', routes.projectsRoutes);
app.use('/api/posts', routes.postsRoutes);
app.use('/api/messages', routes.messagesRoutes);
app.use('/api/recommendations', routes.recommendationsRoutes);

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