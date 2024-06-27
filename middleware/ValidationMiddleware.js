const jwt = require('jsonwebtoken');
const UserCreationRequest = require('../model/UserEntities').UserCreationRequest;
const UserLoginRequest = require('../model/UserEntities').UserLoginRequest;

const SECRET_KEY = "your-secret-key"; // Replace with your own secret key
const checkAuthorization = (req, res, next) => {
    // Get the JWT token from the request headers
    var token = req.headers.authorization;
    console.log(req.headers);
    console.log(token);

    // Check if the token exists
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        //Remove Barear from token
        console.log("Verifing Tokebn");
        token = token.replace('Bearer ', '');
        console.log(token);
        // Verify the JWT token
        var decodedToken = jwt.verify(token, SECRET_KEY);

        // Attach the decoded token to the request object
        req.user = decodedToken;

        // Call the next middleware
        next();
    } catch (error) {
        console.log("Error in token");
        console.log(error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

const UserCreationRequestValidation = (req, res, next) => {
    const { error } = UserCreationRequest.safeParse(req.body);
    if (error) {
        return res.status(400).json({ message: error });
    }
    next();
};

const UserLoginRequestValidation = (req, res, next) => {
    const { error } = UserLoginRequest.safeParse(req.body);
    if (error) {
        return res.status(400).json({ message: error });
    }
    next();
};

module.exports = {
    checkAuthorization,
    UserCreationRequestValidation,
    UserLoginRequestValidation,
};