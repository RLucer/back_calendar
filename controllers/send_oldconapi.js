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
    from: process.env.EMAIL_USER, // Correo verificado en SendGrid
    subject: subject,
    text: text,
  };

  try {
    const response = await sgMail.send(msg);
    console.log('Correo enviado:', response[0].statusCode);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
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
    const dateSen = new Date(eventDateSend);

    console.log(`Correo programado para: ${date}`); // Depuración

    const date = new Date(eventDateSend);
    if (isNaN(date.getTime())) {
      console.error('Fecha de envío inválida:', eventDateSend);
      return res.status(400).json({ ok: false, msg: 'Fecha de envío inválida' });
    }

    schedule.scheduleJob(date, async function () {

      try {
        // Enviar el correo y esperar a que se complete
        await sendReminderEmail(email, `Recordatorio: ${eventName} para el día: ${fechaFormateada}`, text);
        console.log('Correo programado enviado correctamente.');
      } catch (error) {
        console.error('Error al enviar el correo programado:', error);
      }
    });

    // Respuesta exitosa
    console.log(res);

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
