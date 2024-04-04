// Se define un middleware de autorización llamado isAuthPassport.
const isAuthPassport = (req, res, next) => {
    // Se verifica si el usuario está autenticado.
    if (req.isAuthenticated()) {
        // Si el usuario está autenticado, se pasa al siguiente middleware en la cadena.
        return next();
    } else {
        // Si el usuario no está autenticado, se crea un error de autorización con código 401 (No autorizado)
        // y se pasa al siguiente middleware para su manejo.
        return next(createError('No tienes permisos', 401));
    }
};

// Se exporta el middleware de autorización para que esté disponible para su uso en otros archivos.
module.exports = isAuthPassport;
