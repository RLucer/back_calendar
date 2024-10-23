const { response } = require("express");
const Evento = require('../models/Evento');

const obtenerEventos = async (req, res = response) => {
    const eventos = await Evento.find()
        .populate('user', 'name');
    return res.json({
        ok: true,
        eventos
    })
}

const crearEvento = async (req, res = response) => {
    const evento = new Evento(req.body);
    try {
        evento.user = req.uid;
        const eventoDB = await evento.save();
        res.json({
            ok: true,
            evento: eventoDB
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador no guarda.'
        })
    }
}

const actualizarEvento = async (req, res = response) => {

    const eventoID = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoID);
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            })
        }

        //* Sino es la misma persona que creo el evento quiere actualizar
        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            })
        }

        //* Si es la misma persona que creo el evento quiere actualizar
        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoID, nuevoEvento, { new: true });

        res.json({
            ok: true,
            evento: eventoActualizado
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        })
    }
}

const eliminarEvento = async(req, res = response) => {
    const eventoID = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoID);
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            })
        }

        //* Sino es la misma persona que creo el evento quiere actualizar
        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            })
        }

        await Evento.findByIdAndDelete(eventoID);

        res.json({
            ok: true
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        })
    }
}

module.exports = {
    obtenerEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}