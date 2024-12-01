
const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
const mongoose = require('mongoose');
const jobRoutes = require('./routes/jobRoutes');
const { loadJobsFromDatabase } = require('./utils/jobService'); // Método que deseas ejecutar

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



//cargo los recordatorios que tengo en la DB al sistema node
const initApp = async () => {
    try {
        console.log('Cargando trabajos programados...');
        await loadJobsFromDatabase(); // Ejecutar la función al iniciar el servidor
        console.log('Trabajos programados cargados exitosamente.');
    } catch (error) {
        console.error('Error cargando trabajos programados:', error);
    }
};




//app.use('api', require('./routes/jobRoutes'));
//* Rutas
app.use( '/api/auth', require('./routes/auth') );
app.use( '/api/events', require('./routes/events') );
app.use( '/api/send', require('./routes/send') );
app.use( '/api/teams', require('./routes/teams') );
app.use( '/api/participans', require('./routes/participans') );
app.use( '/api/whatsapp', require('./routes/whatsappRoutes') );

// app.get('*', (req, res) => {
//     res.sendFile( __dirname + '/public/index.html' )
// });

app.get('/', (req, res) => {
    res.send('api calendar funcionando ok');
})


//TODO: CRUD: Eventos del calendario

//* Escuchar peticiones
app.listen(process.env.PORT, async () =>{
    await initApp(); // Llama al método aquí
    console.log(`Servidor corriendo en puerto ${process.env.PORT} todo OK...`)
})