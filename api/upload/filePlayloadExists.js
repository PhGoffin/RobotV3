/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-16
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-16 08:09:53
 * @Description: check if there is file to upload
 */
const filesPayloadExists = (req, res, next) => {
    if (!req.files) return res.status(400).json({ status: "error", message: "Missing files" })

    next()
}

module.exports = filesPayloadExists