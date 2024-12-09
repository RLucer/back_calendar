const { response } = require("express");
const  Equipo  = require('../models/Equipo');
const Participante = require('../models/Participante');
const mongoose = require('mongoose');

const obtenerEquipos = async (req, res = response) => {
    //const equipos = await Equipo.find()      // -->muestro todo lo de la tabla 
    const equipos = await Equipo.find().populate('participants');   // muestro de manera que fuera un join
    // .populate('user', 'name'); es un join  otra tabla
    return res.json({
        ok: true,
        equipos
    })
}


const obtenerEquipo = async (req, res = response) => {
    try {
        // Extrae el ID del equipo de los parámetros de la solicitud
        const { equipoId } = req.params;

        // Busca el equipo por su ID y popula los participantes
        const equipo = await Equipo.findById(equipoId).populate('participants');

        if (!equipo) {
            return res.status(404).json({
                ok: false,
                msg: 'Equipo no encontrado'
            });
        }

        return res.json({
            ok: true,
            equipo
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al obtener el equipo'
        });
    }
};


const crearEquipo = async (req, res = response) => {
    const equipo = new Equipo(req.body)

    try {
        //equipo.name = req.uid;
        const equipoDB = await equipo.save();
        res.json({
            ok: true,
            equipo: equipoDB
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Verifique posiblemente el equipo ya se encuentre creado.'
        })
    }
}
const actualizarEquipo = async (req, res = response) => {
    const { equipoId } = req.params;
    const updateData = req.body;

    // Validar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(equipoId)) {
        return res.status(400).json({
            ok: false,
            msg: 'El ID de equipo proporcionado no es válido.'
        });
    }

    try {
        const equipoActualizado = await Equipo.findByIdAndUpdate(
            equipoId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!equipoActualizado) {
            return res.status(404).json({
                ok: false,
                msg: 'Equipo no encontrado.'
            });
        }

        res.json({
            ok: true,
            equipo: equipoActualizado
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar el equipo.'
        });
    }
};

const agregarParticipanteAEquipo = async (req, res) => {
    const { equipoId, participanteId } = req.params;

    try {
        // Buscar el equipo por su ID
        const equipo = await Equipo.findById(equipoId);
        if (!equipo) {
            return res.status(404).json({
                ok: false,
                msg: 'Equipo no encontrado.'
            });
        }

        // Verificar si el participante ya existe en la base de datos
        const participante = await Participante.findById(participanteId);
        if (!participante) {
            return res.status(404).json({
                ok: false,
                msg: 'Participante no encontrado.'
            });
        }

        // Verificar si el participante ya está en el equipo
        if (equipo.participants.includes(participanteId)) {
            return res.status(400).json({
                ok: false,
                msg: 'El participante ya está en el equipo.'
            });
        }

        // Agregar el ID del participante al array de participantes del equipo
        equipo.participants.push(participanteId);

        // Guardar los cambios en el equipo
        await equipo.save();
        await equipo.populate('participants');
        res.status(200).json({
            ok: true,
            equipo
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al agregar participante al equipo.'
        });
    }
};
const eliminarParticipanteAEquipo = async (req, res) => {
    const { equipoId, participanteId } = req.params;

    try {
        // Buscar el equipo por su ID
        const equipo = await Equipo.findById(equipoId);
        if (!equipo) {
            return res.status(404).json({
                ok: false,
                msg: 'Equipo no encontrado.'
            });

        }

        // Verificar si el participante existe en la base de datos
        const participante = await Participante.findById(participanteId);
        if (!participante) {
            return res.status(404).json({
                ok: false,
                msg: 'Participante no encontrado.'
            });
        }

        // Verificar si el participante está en el equipo
        if (!equipo.participants.includes(participanteId)) {
            return res.status(400).json({
                ok: false,
                msg: 'El participante no pertenece a este equipo.'
            });
        }

        // Eliminar el ID del participante del array de participantes del equipo
        equipo.participants = equipo.participants.filter(id => id.toString() !== participanteId);

        // Guardar los cambios en el equipo
        await equipo.save();

        return res.status(200).json({
            ok: true,
            msg: 'Participante eliminado del equipo.',
            equipo
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar participante del equipo.'
        });
    }
};

const eliminarEquipo = async (req, res) => {
    const { equipoId } = req.params;

    try {
        // Buscar y eliminar el equipo por su ID
        const equipo = await Equipo.findByIdAndDelete(equipoId);

        if (!equipo) {
            return res.status(404).json({
                ok: false,
                msg: 'Equipo no encontrado.'
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'Equipo eliminado correctamente.',
            equipo
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar el equipo.'
        });
    }
};

module.exports = {
    obtenerEquipos,
    obtenerEquipo,
    crearEquipo,
    actualizarEquipo,
    agregarParticipanteAEquipo,
    eliminarParticipanteAEquipo,
    eliminarEquipo
}