const jwt = require('jsonwebtoken');

const getJWT = (userInfo, secretKey) => {
    return jwt.sign(

        {
            id: userInfo._id,
            email: userInfo._email
        },
        secretKey,
        {

            expiresIn: 120
            
        }

    );
};

module.exports = getJWT;