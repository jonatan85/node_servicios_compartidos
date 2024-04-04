require('dotenv').config();

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const cloudinary = require('cloudinary');

const DB_URL = "mongodb+srv://root:55hJkNFETwtUGAtl@joni.auofi0k.mongodb.net/?retryWrites=true&w=majority";

const connect = require('./utils/db/connect.js');

const userRouter = require('./routes/user.routes.js');
const gastoRouter = require('./routes/gasto.routes.js');
const gastoDeParticipanteRouter = require('./routes/gastoDeParticipantes.routes.js');
const groupRouter = require('./routes/group.routes.js');
const groupMemberRouter = require('./routes/groupMember.routes.js');
const usuarioRouter = require('./routes/usuario.routes.js');

connect();

const PORT = process.env.PORT || 4000;
const server = express();
          
cloudinary.config({ 
  cloud_name: 'dpokwpezz', 
  api_key: '736563599769218', 
  api_secret: 'rVdWk1rSazOLtA4h8NeeFoJvimg' 
});

server.set("secretKey", "moneHeistApi");

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use(express.static(path.join(__dirname, 'public')));

require('./utils/authentication/passport.js');

server.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    },
    store: MongoStore.create({
        mongoUrl: DB_URL
    })
}));

server.use(passport.initialize());
server.use(passport.session());

server.get('/', (req, res) => {
    res.json("¡Bienvenido a mi ring!");
});

server.use('/user', userRouter);
server.use('/gasto', gastoRouter);
server.use('/gasto-de-participantes', gastoDeParticipanteRouter);
server.use('/group', groupRouter);
server.use('/group-member', groupMemberRouter);
server.use('/usuario', usuarioRouter);



server.listen(PORT, () => {
    console.log(`El servidor está escuchando en http://localhost:${PORT}`);
});

