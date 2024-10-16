/* 
* /api/send
*/
const { Router } = require('express');
// const { check } = require('express-validator');
// const { obtenerEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { sendEmail } = require('../controllers/send');
// const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();
// const { validarCampos } = require('../middlewares/validar-campos');
// const { isDate } = require('../helpers/isDate');

//* Obtener eventos
//* Todas tienen que pasar por la validacion del JWT 
//router.use(validarJWT);


router.post('/', sendEmail);

//* Crear evento
// router.post('/',
//     [
//         check('title', 'El título es obligatorio').not().isEmpty(),
//         check('start', 'Fecha de inicio es obligatoria').custom(isDate),
//         check('end', 'Fecha de finalización es obligatoria').custom(isDate),
//         validarCampos
//     ],
//     crearEvento);

// //* Actualizar evento
// router.put('/:id', actualizarEvento);

// //* Borrar evento
// router.delete('/:id', eliminarEvento);

module.exports = router;