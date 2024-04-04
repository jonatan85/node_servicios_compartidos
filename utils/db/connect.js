const mongoose = require('mongoose');

const DB_URL = "mongodb+srv://root:55hJkNFETwtUGAtl@joni.auofi0k.mongodb.net/?retryWrites=true&w=majority";

const connect = () => {
    mongoose.connect(DB_URL);
};

module.exports = connect;