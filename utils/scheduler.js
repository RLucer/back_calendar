const schedule = require('node-schedule');
//const client = require('./whatsappClient');
const { sendMessage, client, clientReady } = require('../utils/whatsappClient');
const { saveJobToDatabase } = require('../utils/jobService');

// Función para programar un mensaje
// const scheduleReminder = async (dateTime, phones, mensaje) => {
//     const jobName = `reminder_${phones}_${new Date(dateTime).getTime()}`; // Nombre único
    
//     try {
//         // Guardar el recordatorio en la base de datos al programarlo
//         await saveJobToDatabase(jobName, dateTime, phones, mensaje);

//         // Programar el trabajo
//         const job = schedule.scheduleJob(jobName, new Date(dateTime), async () => {
//             try {
//                 await sendMessage(phones, mensaje);
//                 console.log(`Mensaje enviado a ${phones}: ${mensaje}`);
//             } catch (error) {
//                 console.error(`Error enviando mensaje a ${phones}:`, error);
//             }
//         });

//         console.log(`Trabajo programado: ${jobName}`);
//         return jobName; // Devuelve el nombre del trabajo programado
//     } catch (error) {
//         console.error('Error al programar el recordatorio:', error);
//         throw new Error('No se pudo programar el recordatorio');
//     }
// };

// Función para programar un mensaje
const scheduleReminder = async (dateTime, phone, mensaje) => {
    const jobName = `reminder_${phone}_${new Date(dateTime).getTime()}`; // Nombre único

    try {
        // Guardar el recordatorio en la base de datos al programarlo
        await saveJobToDatabase(jobName, dateTime, phone, mensaje);

        // Programar el trabajo
        const job = schedule.scheduleJob(jobName, new Date(dateTime), async () => {
            console.log(`Ejecutando recordatorio para los números: ${phone}`);
            try {
                await sendMessage(phone, mensaje); // Llama a sendMessage
                console.log(`Mensaje enviado a ${phone}: ${mensaje}`);
            } catch (error) {
                console.error(`Error al enviar mensajes:`, error);
            }
        });

        console.log(`Trabajo programado: ${jobName}`);
        return jobName; // Devuelve el nombre del trabajo programado
    } catch (error) {
        console.error('Error al programar el recordatorio:', error);
        throw new Error('No se pudo programar el recordatorio');
    }
};


// Función para listar todos los trabajos programados
const listScheduledJobs = () => {
    const jobs = Object.entries(schedule.scheduledJobs).map(([name, job]) => ({
        name,
        nextInvocation: job.nextInvocation() ? job.nextInvocation().toString() : 'No programado',
    }));
    return jobs; // Devuelve la lista de trabajos
};

// Función para cancelar un trabajo programado
const cancelScheduledJob = (jobName) => {
    const job = schedule.scheduledJobs[jobName];
    if (job) {
        job.cancel();
        console.log(`Trabajo ${jobName} cancelado.`);
        return { message: `Trabajo ${jobName} cancelado.` };
    } else {
        console.log(`Trabajo ${jobName} no encontrado.`);
        return { error: `Trabajo ${jobName} no encontrado.` };
    }
};

// Exportar las funciones
module.exports = {
    scheduleReminder,
    listScheduledJobs,
    cancelScheduledJob,
};
