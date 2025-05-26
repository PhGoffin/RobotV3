

/**
* @author 	Philippe Goffin
* @name   	password utility
* @property	javascript 
*
* @description 
*  Password functions
*
* @version 
* V1.0 PGO	07/02/2024	Initial version   
*
*/


/**
 * @function
 *   cryptPassword: crypt a password
 *
 * @param {string} password: uncrypted password
 * 
 */
async function cryptPassword(password) {
    // Crypt the password
    const crypto = require("crypto");
    const algorithm = "aes-256-cbc";
    const initVector = '0123456789abcdef';

    // secret key generate 32 bytes of random data
    const Securitykey = process.env.SECURITY_KEY

    // the cipher function
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
    // encrypt the message
    let encryptedData = cipher.update(password, "utf-8", "hex");
    encryptedData += cipher.final("hex");

    //console.log("Encrypted message: " + encryptedData);

    ret = { success: 1, message: "Password crypted ", password: encryptedData }

    return (ret)

}



/**
 * @function
 *   decryptPassword: decrypt a password
 *
 * @param {string} password: crypted password
 * 
 */
async function decryptPassword(password) {

    // Crypt the password
    const crypto = require("crypto");
    const algorithm = "aes-256-cbc";
    const initVector = '0123456789abcdef';
    // secret key generate 32 bytes of random data
    const Securitykey = process.env.SECURITY_KEY



    // the decipher function
    const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
    let decryptedData = decipher.update(password, "hex", "utf-8");
    decryptedData += decipher.final("utf8");
    //console.log("Decrypted message: " + decryptedData);

    ret = { success: 1, message: "Password decrypted ", password: decryptedData }


    return (ret)

}



module.exports = {
    cryptPassword: cryptPassword,
    decryptPassword: decryptPassword

};


