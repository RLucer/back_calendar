const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

// Esquema para los participantes
const ParticipanteSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            
        },
        role: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: Number,
            required: true,
        
        }
    },
    {
        timestamps: true,
    }
);


// Método para personalizar la respuesta JSON
ParticipanteSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});


module.exports = model('Participante', ParticipanteSchema);