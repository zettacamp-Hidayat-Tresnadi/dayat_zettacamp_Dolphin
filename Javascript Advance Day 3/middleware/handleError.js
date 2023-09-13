function errorHandler(err, req, res, next) {
    let status = 500
    let msg = 'internal server error'
    switch (err.name) {
        case 'bad request':
            status = 400
            msg = err.errors;
            break;
        case 'Wrong Credentials':
            status = 401
            msg = 'error invalid username or password'
            break;
        case 'Unauthorized':
            status = 401
            msg = 'You are not authorized, please log in first and fill the requirement data'
            break;
        case 'Not Found':
            status = 404
            msg = 'Error 404 Route not found'
            break;
        default:
            break;
    }
    res.status(status).json({ message: msg })
}

module.exports = { errorHandler }