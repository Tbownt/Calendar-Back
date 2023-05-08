const jwt = require("jsonwebtoken");

const generarJWT = (uid, name) => {
  //segun fernando, este paquete de JWT aun se maneja por callbacks asi que la manera mas optima de utilizarlo es creando una promesa
  return new Promise((resolve, reject) => {
    //el jwt necesita un payload asi que se le enviara un name y id del usuario
    const payload = { uid, name };

    jwt.sign(
      payload,
      //aparte necesita una clave secreta para funcionar
      process.env.SECRET_JWT_SEED,
      //una duracion del token, en lo personal le puse 2 horas ya que me parece suficiente
      {
        expiresIn: "2h",
      },
      //si hay un error al generar el token envio un mensaje por consola en vez de informacion sensible de el usuario
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        }
        //si todo sale bien, devuelve el token
        resolve(token);
      }
    );
  });
};

module.exports = {
  generarJWT,
};
