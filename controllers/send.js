require('dotenv').config();
const { format } = require('date-fns');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');


// Configuración de nodemailer con POP3/SMTP
const transporter = nodemailer.createTransport({
  host: 'mail.girona.cl', // El servidor SMTP de tu proveedor de correo
  port: 465, // El puerto SMTP, 465 para SSL, 587 para TLS
  secure: true, // Usa true para SSL y false para TLS
  auth: {
    user: process.env.EMAIL_USER, // Usa variables de entorno para el correo
    pass: process.env.EMAIL_PASS  // Usa variables de entorno para la contraseña
  }
});

// Función para enviar el correo electrónico
const sendReminderEmail = (email, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // El correo desde el que se enviará
    to: email,
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar el correo:', error);
    } else {
      console.log('Correo enviado: ' + info.response);
    }
  });
};

// Función para manejar la solicitud de envío de correo
const sendEmail = async (req, res) => {
  const { email, eventName, eventDate, eventDateSend, text } = req.body; // Asegúrate de que req.body tenga estos datos

  if (!email || !eventName || !eventDate || !text || !eventDateSend) {
    return res.status(400).send('Faltan datos requeridos');
  }

//formateo la fecha pa mostrarla mejor el en correo

const fechaFormateada = format(new Date(eventDate), 'dd/MM/yyyy');

  // Programar el envío del correo para la fecha del evento
  const date = new Date(eventDateSend);
  schedule.scheduleJob(date, function() {
    sendReminderEmail(email, `Recordatorio: ${eventName} para el día:  ${fechaFormateada} `, text);
  });


  res.status(200).json({
    ok: true,
    msg: 'Correo programado correctamente.'
})



  
};

module.exports = { sendEmail };
