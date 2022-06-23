
// Defining A Custom Error Handler using the class (OOP)
class ExpressError extends Error {
    constructor(message, statusCode){
        super();
        this.message = message;
        this.status = statusCode;
    }
}

module.exports = ExpressError;