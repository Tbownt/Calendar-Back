const Evento = require("../models/Evento");

const crearEventos = async (req, res) => {
  const evento = new Evento(req.body);

  try {
    evento.user = req.uid;
    const eventoGuardado = await evento.save();

    res.status(200).json({ ok: true, evento: eventoGuardado });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: false, msg: "Error interno en el servidor" });
  }
};

const getEventos = async (req, res) => {
  //Mongo es un poco diferente a PostGreSQL, para obtener un usuario de una pseudo tabla intermedia (mongo no es una base de datos relacional)
  //se debe especificar el path con la propiedad y el valor de lo que se busca con el metodo populate
  const eventos = await Evento.find().populate("user", "name");
  res.status(200).json({ ok: true, eventos: eventos });
};

const actualizarEvento = async (req, res) => {
  const eventoId = req.params.id;
  const uid = req.uid;

  try {
    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res
        .status(404)
        .json({ ok: false, msg: "No hay un evento con ese ID" });
    }

    if (evento.user.toString() !== uid) {
      return res
        .status(401)
        .json({ ok: false, msg: "No tiene privilegio de editar este evento" });
    }
    const nuevoEvento = {
      ...req.body,
      user: uid,
    };

    //en Mongo cuando se actualiza un modelo por el metodo findByIdAndUpdate si actualiza la request
    //pero devuelve el anterior para verificar la informacion, para que esto no pase, se añade un tercer argumento
    //el cual es el objeto {new: true} para que este solo devuelva la nueva version
    const eventoActualizado = await Evento.findByIdAndUpdate(
      eventoId,
      nuevoEvento,
      { new: true }
    );
    res.status(200).json({ ok: true, eventoActualizado });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msg: "Error interno en el servidor" });
  }
};

const eliminarEvento = async (req, res) => {
  const eventoId = req.params.id;
  const uid = req.uid;
  try {
    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res
        .status(404)
        .json({ ok: false, msg: "No hay un evento con ese ID" });
    }
    if (evento.user.toString() !== uid) {
      return res
        .status(401)
        .json({ ok: false, msg: "No tiene privilegio de editar este evento" });
    }

    const eventoBorrado = await Evento.findByIdAndDelete(eventoId);

    res.status(200).json({ ok: true, eventoBorrado });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error interno del Servidor",
    });
  }
};

module.exports = {
  getEventos,
  crearEventos,
  actualizarEvento,
  eliminarEvento,
};
