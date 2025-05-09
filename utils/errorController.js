
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2023-11-28 07:46:48 
 * @Last Modified by: 
 * @Last Modified time: 2023-12-05 13:14:33
 * @Description: Manage the error depending of the environment: dev or prod (defined in the file .env with the attribute: NODE_ENV=dev)
 */

const sendErrorDev = (err, res) => {


    const statusCode = err.statusCode || 200;
    res.status(statusCode).json({
        success: 0,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorProd = (err, res) => {
    const statusCode = err.statusCode || 500;
    if (err.isOperational) {
        res.status(statusCode).json({
            success: 0,
            message: err.message
        })        
    } else {
        res.status(statusCode).json({
            success: 0,
            message: "Sorry, something went wrong!"
        })        
    }

}

module.exports = (err, req, res, next) => {
    if (process.env.NODE_ENV === 'dev') {
        sendErrorDev(err, res);
    } else {
        sendErrorProd(err, res);
    }
} 