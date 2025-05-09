/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2023-11-29 06:54:50 
 * @Last Modified by: 
 * @Last Modified time: 2023-11-29 06:56:12
 * @Description: catchAsync is a wrapper to encapsulate un try() {} catch() method in the controller
 *  the objective is to reduce the code and provide a uniform way  to manage the error
 */

module.exports = fn => {
    return (req, res, next) => {
        fn (req, res, next).catch(next);
    }
}