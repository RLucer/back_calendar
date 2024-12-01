/* 
* /api/teams
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerParticipantes, crearParticipante, actualizarParticipante, eliminarParticipante } = require('../controllers/participans');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');

//* Obtener eventos
//* Todas tienen que pasar por la validacion del JWT 
router.use(validarJWT);

router.get('/', obtenerParticipantes);

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
router.post('/', crearParticipante);

// //* Actualizar evento
// router.put('/:id', actualizarEvento);
router.put('/:participanID', actualizarParticipante);
// //* Borrar evento
router.delete('/:participanID', eliminarParticipante);

module.exports = router;