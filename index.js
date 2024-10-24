
const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

//* Crear el servidor de express
const app = express();

//* BD
mongoose.set('strictQuery', false);
dbConnection();

//* CORS
app.use(cors());

//* Directorio publico
//* Middleware
//app.use( express.static('public') );

//* Lectura y Parseo del body
app.use( express.json() )

//* Rutas
app.use( '/api/auth', require('./routes/auth') );
app.use( '/api/events', require('./routes/events') );
app.use( '/api/send', require('./routes/send') );

// app.get('*', (req, res) => {
//     res.sendFile( __dirname + '/public/index.html' )
// });

app.get('/', (req, res) => {
    res.send('api calendar funcionando ok');
})


//TODO: CRUD: Eventos del calendario

//* Escuchar peticiones
app.listen(process.env.PORT, () =>{
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
})