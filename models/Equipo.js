
const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');
// Esquema para el equipo
const EquipoSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        },
       
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participante' }],
    },
    {
        timestamps: true,
    }
);

// Método para personalizar la respuesta JSON
EquipoSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});


module.exports = model('Equipo', EquipoSchema);