const express = require('express');
const { sendWhatsAppMessage, scheduleWhatsAppReminder,getAllScheduledJobs, getAllJobsDataBase} = require('../controllers/whatsappController');

const router = express.Router();

//ruta cancelar un jobs agendado
//router.delete('/jobs/:jobName', cancelScheduledJob);
//ruta consultar jobs agendados
router.get('/jobs', getAllJobsDataBase);//-> los vulve a cargar al local pero no los muestra...
router.get('/jobsLocal', getAllScheduledJobs);
// Ruta para enviar un mensaje inmediato
router.post('/send-message', sendWhatsAppMessage);

// Ruta para programar un recordatorio
router.post('/schedule-reminder', scheduleWhatsAppReminder);

module.exports = router;
