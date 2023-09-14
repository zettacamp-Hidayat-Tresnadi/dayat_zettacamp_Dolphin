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
            msg = 'Please log in first and fill the requirement data'
            break;
        case 'Invalid Token':
            status = 403
            msg = 'Token Invalid'
            break;
        case 'Relogin':
            status = 403
            msg = 'Please do relogin, the token has expired'
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