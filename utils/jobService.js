const Job = require('../models/JobModel');
const schedule = require('node-schedule');
const { sendMessage, clientReady, client } = require('../utils/whatsappClient');

const saveJobToDatabase = async (jobName, dateTime, phones, message) => {
    try {
        const job = new Job({
            jobName,
            dateTime,
            phones, 
            message,
        });
        await job.save();
        console.log('Trabajo guardado en la base de datos:', job);
    } catch (error) {
        console.error('Error al guardar el trabajo en la base de datos:', error);
    }
};

const loadJobsFromDatabase = async () => {
    try {
        const jobs = await Job.find();
        jobs.forEach((job) => {
            // Aseguramos que 'phones' siempre sea un array
            const phones = Array.isArray(job.phones) ? job.phones : [job.phones];
            console.log(`Ejecutando recordatorio para los números: ${phones.join(', ')}`);

            // Verificamos que realmente 'phones' sea un array antes de continuar
            if (!Array.isArray(phones)) {
                console.error(`El campo 'phones' no es un array para el trabajo ${job.jobName}`);
                return;
            }

            // Programar el trabajo
            schedule.scheduleJob(job.jobName, new Date(job.dateTime), async () => {
                try {
                    for (const phone of phones) {
                        // Enviamos el mensaje a cada número de teléfono
                        await sendMessage(`${phone}@c.us`, job.message);
                        console.log(`Mensaje enviado a ${phone}`);
                    }
                } catch (error) {
                    console.error('Error al enviar mensajes:', error);
                }
            });

            console.log(`Trabajo recargado: ${job.jobName}`);
        });
    } catch (error) {
        console.error('Error al cargar trabajos desde la base de datos:', error);
    }
};

// Función para enviar el mensaje (asegúrate de que esté correctamente definida)




const deleteJobFromDatabase = async (jobName) => {
     try {
        const deletedJob = await Job.findOneAndDelete({ jobName });
        if (deletedJob) {
            console.log('Trabajo eliminado de la base de datos:', deletedJob);
            const scheduledJob = schedule.scheduledJobs[jobName];
            if (scheduledJob) {
                scheduledJob.cancel();
                console.log(`Trabajo cancelado: ${jobName}`);
            }
        } else {
            console.log('Trabajo no encontrado en la base de datos.');
        }
    } catch (error) {
        console.error('Error al eliminar el trabajo de la base de datos:', error);
    }
};


module.exports = {
   saveJobToDatabase,
   loadJobsFromDatabase,
   deleteJobFromDatabase,
};
