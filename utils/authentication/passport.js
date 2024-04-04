// Se requieren los módulos necesarios para la autenticación con Passport.
const passport = require('passport'); // Se importa el módulo 'passport' para la autenticación.
const User = require('../../models/User'); // Se importa el modelo de usuario para interactuar con la base de datos.
const LocalStrategy = require('passport-local').Strategy; // Se importa la estrategia local de Passport para la autenticación.
const bcrypt = require('bcrypt'); // Se importa bcrypt para el hash y comparación de contraseñas.

// Se define una estrategia de autenticación para el registro de usuarios.
passport.use(
    'register', // Se establece un nombre único para esta estrategia, en este caso, 'register'.
    new LocalStrategy( // Se crea una instancia de la estrategia local de Passport.
        {
            usernameField: "email", // Se define el campo del nombre de usuario como 'email'.
            passwordField: "password", // Se define el campo de la contraseña como 'password'.
            passReqToCallback: true // Se especifica que se pasará el objeto 'req' a la función de callback.
        }, 
        async (req, email, password, done) => { // Se define la función de callback con async/await para operaciones asincrónicas.
            // Se busca si existe un usuario con el mismo correo electrónico en la base de datos.
            const previousUser = await User.findOne({ email });

            // Si se encuentra un usuario con el mismo correo electrónico, se devuelve un error.
            if (previousUser) {
                return done(createError('Este usuario ya existe, inicia sesión'));
            }

            // Si no se encuentra un usuario previo con el mismo correo electrónico, se procede a crear uno nuevo.
            // Se cifra la contraseña utilizando bcrypt con un factor de coste de 10.
            const encPassword = await bcrypt.hash(password, 10);
            // Se crea una nueva instancia de usuario con el correo electrónico y la contraseña cifrada.
            const newUser = new User({
                email,
                password: encPassword
            });
            // Se guarda el nuevo usuario en la base de datos.
            const savedUser = await newUser.save();

            // Se devuelve el usuario guardado como éxito de la operación de registro.
            return done(null, savedUser);
        }
    )
);


// Se define la estrategia de autenticación 'login' para Passport.
passport.use(
    'login', // Se establece un nombre único para esta estrategia, en este caso, 'login'.
    new LocalStrategy( // Se crea una instancia de la estrategia local de Passport.
        {
            usernameField: 'email', // Se define el campo del nombre de usuario como 'email'.
            passwordField: 'password', // Se define el campo de la contraseña como 'password'.
            passReqToCallback: true // Se especifica que se pasará el objeto 'req' a la función de callback.
        },
        async (req, email, password, done) => { // Se define la función de callback con async/await para operaciones asincrónicas.
            // Se busca el usuario con el correo electrónico proporcionado en la base de datos.
            const currentUser = await User.findOne({ email });

            // Si no se encuentra un usuario con el correo electrónico proporcionado, se devuelve un error.
            if (!currentUser) {
                return done(createError('No existe un usuario con este email, registrate'));
            }

            // Se compara la contraseña proporcionada con la contraseña almacenada en la base de datos para el usuario encontrado.
            const isValidPassword = await bcrypt.compare(
                password,
                currentUser.password
            );

            // Si la contraseña no es válida, se devuelve un error.
            if (!isValidPassword) {
                return done(createError('La contraseña es incorrecta'));
            }

            // Si la autenticación es exitosa, se elimina la contraseña del usuario para no enviarla en la respuesta.
            currentUser.password = null;
            // Se devuelve el usuario autenticado como éxito de la operación de inicio de sesión.
            return done(null, currentUser);
        }
    )
);

// Se define la función 'serializeUser' para Passport.
passport.serializeUser((user, done) => {
    return done(null, user._id); // Se serializa al usuario utilizando su ID y se pasa al siguiente middleware.
});

// Se define la función 'deserializeUser' para Passport.
passport.deserializeUser(async (userId, done) => {
    try {
        // Se busca el usuario en la base de datos utilizando su ID.
        const existingUser = await User.findById(userId);
        // Se devuelve el usuario encontrado como éxito de la operación de deserialización.
        return done(null, existingUser);
    } catch (err) {
        // Si ocurre un error durante la deserialización, se pasa al siguiente middleware para su manejo.
        return done(err);
    }
});
