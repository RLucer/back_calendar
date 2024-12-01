const { sendMessage, clientReady, client } = require('../utils/whatsappClient');
const { scheduleReminder, listScheduledJobs, cancelScheduledJob } = require('../utils/scheduler');
const { loadJobsFromDatabase } = require('../utils/jobService');

// Enviar un mensaje de WhatsApp inmediato

const sendWhatsAppMessage = async (req, res) => {
    const { phones, message } = req.body;

    // Validar datos de entrada
    if (!Array.isArray(phones) || phones.length === 0 || !message) {
        return res.status(400).json({ error: 'Debe proporcionar un array de números de teléfono y un mensaje.' });
    }

    try {
        // Verificar el estado del cliente
        if (!clientReady) {
            return res.status(503).json({ error: 'El cliente de WhatsApp no está listo. Inténtalo más tarde...' });
        }
        //recibo datos y creo un mensaje ordenado
        const mensaje = `Hola, se te agendo una reunion..:\n\n` +
            `📅 Fecha: ${message.date}\n` +
            `🕒 Hora: ${message.time}\n` +
            `📍 Lugar: ${message.location || 'Virtual'}\n\n` +
            `¡Te recordaremos pronto...!\n\n` +
            `Team Girona S.A.\n\n`;
        // Enviar los mensajes
        await sendMessage(phones, mensaje);

        return res.status(200).json({ mensaje: 'Mensajes enviados con éxito' });
    } catch (error) {
        console.error('Error enviando mensajes:', error);
        return res.status(500).json({ error: 'No se pudieron enviar los mensajes.' });
    }
};

// Programar un recordatorio de reunión
const scheduleWhatsAppReminder = (req, res) => {
    const { dateTime, phones, message } = req.body;

    try {
        const mensaje = `Hola, recuerda que tienes una reunión agendada:\n\n` +
            `📅 Fecha: ${message.date}\n` +
            `🕒 Hora: ${message.time}\n` +
            `📍 Lugar: ${message.location || 'Virtual'}\n\n` +
            `¡No faltes!\n\n` +
            `Team Girona S.A.\n`;

        scheduleReminder(dateTime, phones, mensaje);
        res.status(200).json({ message: 'Recordatorio programado con éxito' });
    } catch (error) {
        console.error('Error programando recordatorio:', error);
        res.status(500).json({ error: 'No se pudo programar el recordatorio' });
    }
};

const getAllScheduledJobs = (req, res) => {
    try {
        const jobs = listScheduledJobs(); // consulta lo agengado en node no base de datos
        res.status(200).json({
            success: true,
            jobs, // Devuelve los trabajos programados
        });
    } catch (error) {
        console.error('Error al listar los trabajos programados:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los trabajos programados',
        });
    }
};
const getAllJobsDataBase= (req, res) => {
    try {
        const jobs = loadJobsFromDatabase(); // consulta lo agengado en node no base de datos
        res.status(200).json({
            success: true,
            jobs, // Devuelve los trabajos programados
        });
    } catch (error) {
        console.error('Error al listar los trabajos programados:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los trabajos programados',
        });
    }
};


module.exports = {
    sendWhatsAppMessage,
    scheduleWhatsAppReminder,
    getAllScheduledJobs,
    getAllJobsDataBase,
   
};
