require('dotenv').config();
const { format } = require('date-fns');
const schedule = require('node-schedule');
const sgMail = require('@sendgrid/mail');

// Configuración de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Función para enviar el correo usando SendGrid
const sendReminderEmail = async (email, subject, text) => {
  const msg = {
    to: email,
    from: process.env.EMAIL_USER, // Tu correo verificado en SendGrid
    subject: subject,
    text: text,
  };

  // Retornamos una promesa para manejar el envío correctamente
  return new Promise((resolve, reject) => {
    sgMail
      .send(msg)
      .then((response) => {
        console.log('Correo enviado:', response[0].statusCode);
        resolve(response);
      })
      .catch((error) => {
        console.error('Error al enviar el correo:', error);
        reject(error); // Rechaza la promesa si hay un error
      });
  });
};

// Función principal que maneja la solicitud de envío de correo
const sendEmail = async (req, res) => {

  
  try {
    const { email, eventName, eventDate, eventDateSend, text } = req.body;

    // Verificación de los campos necesarios
    if (!email || !eventName || !eventDate || !text || !eventDateSend) {
      return res.status(400).send('Faltan datos requeridos');
    }

    // Formatear la fecha para el correo
    const fechaFormateada = format(new Date(eventDate), 'dd/MM/yyyy');

    // Programar el envío del correo para la fecha del evento
    const date = new Date(eventDateSend);

    console.log(`Correo programado para: ${date}`); // Depuración

    schedule.scheduleJob(eventDateSend, async function () {
      console.log(`Ejecutando tarea programada para enviar correo a: ${email}`); // Depuración

      try {
        // Enviar el correo y esperar a que se complete
        await sendReminderEmail(email, `Recordatorio: ${eventName} para el día: ${fechaFormateada}`, text);
        console.log('Correo programado enviado correctamente.');
      } catch (error) {
        console.error('Error al enviar el correo programado:', error);
      }
    });

    // Respuesta exitosa
    res.status(200).json({
      ok: true,
      msg: 'Correo programado correctamente.'
    });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).send('Error interno del servidor');
  }
};

module.exports = { sendEmail };
