const { Schema, model } = require('mongoose');

const EventoSchema = Schema(
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

EventoSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Evento', EventoSchema);