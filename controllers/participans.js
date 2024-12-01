const { response } = require("express");

const  Participante = require('../models/Participante');


const obtenerParticipantes = async (req, res) => {
    try {
        // Buscar todos los documentos en la colección Participantes
        const participantes = await Participante.find();

        res.json({
            ok: true,
            participantes
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener los participantes.'
        });
    }
};
// Crear y agregar un participante a un equipo específico
const crearParticipante = async (req, res) => {
    try {
        const { name, role, email, phone } = req.body;

        // Verificar si ya existe un participante con el mismo correo
        const participanteExistente = await Participante.findOne({ email });

        if (participanteExistente) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un participante con este correo electrónico.'
            });
        }

        // Crear un nuevo participante
        const nuevoParticipante = new Participante({
            name,
            role,
            email,
            phone,
        });

        // Guardar en la base de datos
        await nuevoParticipante.save();

        res.status(201).json({
            ok: true,
            participante: nuevoParticipante
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear el participante.'
        });
    }
};

// Actualizar la información de un participante en un equipo
const actualizarParticipante = async (req, res) => {
    const { participanID } = req.params; // ID del participante
    const { name, role, email, phone } = req.body; // Datos a actualizar

    try {
        // Buscar y actualizar el participante por su ID
        const participanteActualizado = await Participante.findByIdAndUpdate(
            participanID,
            { name, role, email, phone },
            { new: true } // Para que devuelva el documento actualizado
        );

        // Verificar si el participante existe
        if (!participanteActualizado) {
            return res.status(404).json({
                ok: false,
                msg: 'Participante no encontrado.'
            });
        }

        res.json({
            ok: true,
            participante: participanteActualizado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar el participante.'
        });
    }
};

const eliminarParticipante = async (req, res) => {
    const { participanID } = req.params;

    try {
        // Buscar y eliminar el equipo por su ID
        const participante = await Participante.findByIdAndDelete(participanID);

        if (!participante) {
            return res.status(404).json({
                ok: false,
                msg: 'Participante no encontrado.'
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'Participante eliminado correctamente.',
            participante
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar el participante.'
        });
    }
};

module.exports = {
    obtenerParticipantes,
    crearParticipante,
    actualizarParticipante,
    eliminarParticipante,
};
