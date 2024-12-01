const { Schema, model } = require('mongoose');

const RecordatorioSchema = Schema(
    {
        title: {
            type: String,
            required: true
        },
        notes: {
            type: String
        },
        start: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
            required: true
        },
        send: {
            type: Date,
            required: false
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario',
            required: true
        }
    },
    {
        timestamps: true,
    }
);

module.exports = model('Recordatorio', RecordatorioSchema);