/* 
* /api/teams
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerEquipos, obtenerEquipo,crearEquipo, actualizarEquipo, 
         agregarParticipanteAEquipo, eliminarParticipanteAEquipo,
        eliminarEquipo } = require('../controllers/teams');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');

//* Obtener eventos
//* Todas tienen que pasar por la validacion del JWT 
router.use(validarJWT);

router.get('/', obtenerEquipos);
router.get('/:equipoId', obtenerEquipo);

//* Crear evento
// router.post('/',
//     [
//         check('title', 'El título es obligatorio').not().isEmpty(),
//         check('start', 'Fecha de inicio es obligatoria').custom(isDate),
//         check('end', 'Fecha de finalización es obligatoria').custom(isDate),
//         check('send', 'Fecha de finalización es obligatoria').custom(isDate),
//         validarCampos
//     ],
//     crearEvento);
router.post('/', crearEquipo);

// //* Actualizar evento
// router.put('/:id', actualizarEvento);
router.put('/:equipoId', actualizarEquipo);
router.put('/:equipoId/participante/:participanteId', agregarParticipanteAEquipo);

// //* Borrar 
router.delete('/:equipoId/participante/:participanteId', eliminarParticipanteAEquipo);
router.delete('/:equipoId/', eliminarEquipo);

module.exports = router;