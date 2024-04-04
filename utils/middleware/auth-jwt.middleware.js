// Importar el módulo 'jsonwebtoken' para trabajar con tokens JWT
const jwt = require('jsonwebtoken');

// Importar la función 'createError' para manejar errores personalizados
const createError = require('../errors/create-error.js');

// Middleware para verificar la autenticación JWT
const isAuthJWT = (req, res, next) => {
    // Obtener el encabezado 'Authorization' de la solicitud
    const authorization = req.headers.authorization;
    
    // Si no hay encabezado 'Authorization', devolver un error 401 (No autorizado)
    if (!authorization) {
        return next(createError('No estás autorizado', 401));
    }

    // Dividir el encabezado 'Authorization' en partes usando el espacio como separador
    const splitAuth = authorization.split(" ");
    
    // Verificar si el encabezado 'Authorization' está en el formato correcto
    if (splitAuth.length !== 2 || splitAuth[0] !== "Bearer") {
        // Si no está en el formato correcto, devolver un error 400 (Solicitud incorrecta)
        return next(createError('Cabecera authorization incorrecta', 400));
    }

    // Extraer el token de acceso JWT de las partes del encabezado
    const token = splitAuth[1];
    let payload;

    try {
        // Verificar y decodificar el token JWT utilizando la clave secreta de la aplicación
        payload = jwt.verify(token, req.app.get("secretKey"));
    } catch (err) {
        // Si hay un error al verificar el token, pasarlo al siguiente middleware con el error
        return next(err);
    }

    // Si el token se verifica correctamente, asignar la información del usuario al objeto 'authority' en la solicitud
    req.authority = {
        id: payload.id,
        email: payload.email
    };

    // Pasar al siguiente middleware
    next();
}

// Exportar el middleware 'isAuthJWT' para su uso en otras partes de la aplicación
module.exports = isAuthJWT;
