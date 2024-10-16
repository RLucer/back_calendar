

// ***



const nodemailer = require('nodemailer');
const schedule = require('node-schedule');

// Configura nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // O cualquier otro servicio de correo
  auth: {
    user: 'lucero.ricardo@gmail.com',
    pass: 'Ju271216'
  }
});




const sendReminderEmail = (email, subject, text) => {
  const mailOptions = {
    from: 'lucero.ricardo@gmail.com',
    to: email,
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Correo enviado: ' + info.response);
    }
  });
};

// Programar el envío de recordatorios para una fecha específica
const scheduleEmail = (eventDate, email, eventName) => {
  const date = new Date(eventDate);
  schedule.scheduleJob(date, function(){
    sendReminderEmail(email, `Recordatorio: ${eventName}`, `Tienes un evento llamado ${eventName} programado.`);
  });
};















// Exporta las funciones
module.exports = {
  sendReminderEmail,
  scheduleEmail
};



