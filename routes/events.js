const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  getEventos,
  eliminarEvento,
  actualizarEvento,
  crearEventos,
} = require("../controllers/events");

const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const isDate = require("../helpers/isDate");

const router = Router();
//Todas las rutas pasan por el middleware de JWT
router.use(validarJWT);

router.get("/", getEventos);

router.post(
  "/",
  [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("start", "Fecha de inicio es obligatoria").custom(isDate),
    check("end", "Fecha de finalizacion es obligatoria").custom(isDate),
    validarCampos,
  ],
  crearEventos
);

router.put("/:id", actualizarEvento);

router.delete("/:id", eliminarEvento);

module.exports = router;
