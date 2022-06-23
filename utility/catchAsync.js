

// Defining an async error handler utility that help instead of using try and catch !!!!
module.exports = func => {
    return (req, res, next) =>{
        func (req, res, next) .catch(next)
    }
}