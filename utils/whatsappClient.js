const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

var clientReady = true; // Estado del cliente

// Inicializar el cliente de WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(), // Persistencia local
});

// Evento para generar el QR
client.on('qr', (qr) => {
    console.log('Escanea este código QR con tu WhatsApp:');
    qrcode.generate(qr, { small: true });
});

// Evento cuando el cliente está listo
client.on('ready', () => {
    clientReady = true;
    console.log('Cliente de WhatsApp listo!', client.info, clientReady ,'listo!!');
     
});

// Evento para manejar desconexiones
// client.on('disconnected', () => {
//     clientReady = false;
//     console.log('Cliente de WhatsApp desconectado');
// });

// Inicializar cliente

// Función para enviar mensajes
// async function sendMessage(phone, message) {
//     try {
//         // Asegúrate de que la función 'sendMessage' esté correctamente implementada
//         await client.sendMessage(phone, message);
//     } catch (error) {
//         console.error('Error al enviar el mensaje:', error);
//     }
// }

// const sendMessage = async (phones, message) => {
//     if (!clientReady) {
//         throw new Error('El cliente de WhatsApp no está listo.');
//     }

//     const promises = phones.map((phone) =>
//         client
//             .sendMessage(`${phone}@c.us`, message)
//             .then(() => console.log(`Mensaje enviado a ${phone}`))
//             .catch((error) => console.error(`Error enviando mensaje a ${phone}:`, error))
//     );

//     // Esperar a que todas las promesas terminen
//     await Promise.all(promises);
// };
const sendMessage = async (phones, message) => {
    if (!clientReady) {
        throw new Error('El cliente de WhatsApp no está listo.');
    }

    // Asegúrate de que 'phones' sea un array
    const phoneNumbers = Array.isArray(phones) ? phones : [phones];

    const promises = phoneNumbers.map((phone) => {
        const validPhone = phone.replace(/\D/g, ''); // Elimina cualquier caracter no numérico
        
        // Verificar si el número es válido (debe tener al menos 10 dígitos para un número válido)
        if (validPhone.length < 10) {
            console.error(`Número inválido: ${phone}`);
            return;
        }

        return client
            .sendMessage(`${validPhone}@c.us`, message)
            .then(() => console.log(`Mensaje enviado a ${phone}`))
            .catch((error) => console.error(`Error enviando mensaje a ${phone}:`, error));
    });

    // Esperar a que todas las promesas terminen
    await Promise.all(promises);
};


// const validatePhoneNumber = (phones) => {
//     const phoneRegex = /^\d{11,15}$/; // Ajusta el rango según tus necesidades
//     return phoneRegex.test(phones);
// };
// const sendMessage = async (phones, mensaje) => {
//     try {
//         if (!validatePhoneNumber(phones)) {
//             throw new Error(`Número de teléfono inválido: ${phones}`);
//         }
//         const formattedPhone = `${phones}@c.us`;
//         await client.sendMessage(formattedPhone, mensaje);
//         console.log(`Mensaje enviado a ${phones}`);
//     } catch (error) {
//         console.error(`Error enviando mensaje a ${phones}:`, error);
//         throw error;
//     }
// };

client.initialize();

module.exports = { client, clientReady, sendMessage };
