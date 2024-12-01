const { response } = require("express");
const Job = require('../models/JobModel');
const schedule = require('node-schedule');

// Obtener todos los trabajos almacenados en la base de datos
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find(); // Recuperar todos los trabajos
        res.status(200).json(jobs); // Enviar la lista como respuesta
    } catch (error) {
        console.error('Error al obtener los trabajos:', error);
        res.status(500).json({ error: 'Error al obtener los trabajos almacenados.' });
    }
};

module.exports = {
    getAllJobs,
};
