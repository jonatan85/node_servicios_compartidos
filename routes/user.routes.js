const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');


const User = require('../models/User');
const getJWT = require('../utils/authentication/jsonwebtoken.js');
const createError = require('../utils/errors/create-error.js');

// Se crea un enrutador utilizando Express.
const userRouter = express.Router();

// Se define la ruta POST '/register' para el registro de usuarios.
userRouter.post('/register', (req, res, next) => {
    // Se define la función 'done' que maneja el resultado de la autenticación.
    const done = (err, user) => {
        // Si hay un error durante la autenticación, se pasa al siguiente middleware para su manejo.
        if (err) {
            return next(err);
        }
        // Si la autenticación es exitosa, se inicia sesión con el usuario.
        req.logIn(
            user, // El usuario autenticado.
            (err) => {
                // Si hay un error durante el inicio de sesión, se pasa al siguiente middleware para su manejo.
                if (err) {
                    return next(err);
                }
                // Si el inicio de sesión es exitoso, se devuelve una respuesta JSON con el usuario y un estado HTTP 201 (creado).
                return res.status(201).json(user);
            }
        );
    };

    // Se utiliza el middleware 'passport.authenticate' para manejar la autenticación con la estrategia 'register'.
    passport.authenticate('register', done)(req);
});

// Se define una ruta GET '/' para obtener todos los usuarios.
userRouter.get('/', async (req, res, next) => {
    try {
        // Se utiliza el método 'find()' del modelo User para obtener todos los usuarios de la base de datos.
        const users = await User.find();
        // Se devuelve una respuesta JSON con los usuarios obtenidos y un estado HTTP 200 (OK).
        return res.status(200).json(users);
    } catch(err) {
        // Si ocurre un error durante la búsqueda de usuarios, se pasa al siguiente middleware para su manejo.
        next(err);
    }
});

// Se define una ruta POST '/login' para el inicio de sesión de usuarios.
userRouter.post('/login', (req, res, next) => {
    // Se define la función 'done' que maneja el resultado del inicio de sesión.
    const done = (err, user) => {
        // Si hay un error durante el inicio de sesión, se pasa al siguiente middleware para su manejo.
        if (err) {
            return next(err);
        }

        // Si el inicio de sesión es exitoso, se inicia sesión con el usuario.
        req.logIn(
            user, // El usuario autenticado.
            (err) => {
                // Si hay un error durante el inicio de sesión, se pasa al siguiente middleware para su manejo.
                if (err) {
                    return next(err);
                }
                // Si el inicio de sesión es exitoso, se devuelve una respuesta JSON con el usuario y un estado HTTP 200 (OK).
                return res.status(200).json(user);
            }
        );
    };

    // Se utiliza el middleware 'passport.authenticate' para manejar la autenticación con la estrategia 'login'.
    passport.authenticate('login', done)(req);
});

userRouter.post('logout', (req, res, next) => {
    if (req.user) {
        req.logOut();

        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            return res.status(200).json("Hasta luego");
        });
    } else {
        return res.status(304).json('No hay un usuario logueado en este momento');
    }
});

// Manejar la solicitud POST a la ruta '/login-jwt'
userRouter.post('/login-jwt', async (req, res, next) => {
    
    // Extraer el correo electrónico y la contraseña del cuerpo de la solicitud
    const { email, password } = req.body;

    // Buscar el usuario en la base de datos utilizando el correo electrónico proporcionado en la solicitud
    const user = await User.findOne({ email });

    // Si no se encuentra ningún usuario con el correo electrónico proporcionado, devolver un error 404
    if (!user) {
        return next(createError('El usuario no existe'), 404);
    }

    // Verificar si la contraseña proporcionada coincide con la contraseña almacenada en la base de datos
    const isValidPassword = await bcrypt.compare(password, user.password);

    // Si la contraseña no es válida, devolver un error 403
    if (!isValidPassword) {
        return next(createError('La contraseña no es válida'), 403);
    }

    // Borrar la contraseña del objeto de usuario antes de enviarlo en la respuesta
    user.password = null;

    // Generar un token JWT utilizando la función getJWT y la clave secreta de la aplicación
    const token = getJWT(user, req.app.get('secretKey'));

    // Enviar una respuesta con un código de estado 200 OK, junto con el objeto de usuario y el token JWT
    return res.status(200).json({
        user,
        token
    });
});


// Se exporta el enrutador de usuarios para que esté disponible para su uso en otros archivos.
module.exports = userRouter;
