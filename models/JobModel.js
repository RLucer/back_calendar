
const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');
// Esquema para el equipo


const JobSchema = new Schema(
    {
        jobName: {
            type: String,
            required: true,
            unique: true, // Asegura que no haya nombres duplicados para los trabajos
        },
        dateTime: {
            type: Date,
            required: true,
        },
        phones: {
            type: [String],
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now, // Fecha de creación del trabajo
        },
    },
    {
        timestamps: true,
    }
);

// Método para personalizar la respuesta JSON
JobSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});


module.exports = model('Job', JobSchema);