const express = require('express');
// const { getAllJobs } = require('../controllers/jobController');
const { getAllJobsDataBase } = require('../controllers/whatsappController');

const router = express.Router();

router.get('/', getAllJobsDataBase); // Ruta para obtener todos los trabajos

module.exports = router;
