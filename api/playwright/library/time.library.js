/**
* @author 	Philippe Goffin
* @name   	Time utility
* @property	javascript 
*
* @description 
*  Time functions
*
* @version 
* V1.0 PGO	03/04/2024	Initial version   
*
*/


/**
 * @function
 *   timeEpoch: return a date converted into epoch (Unix) date and time
 *
 * @param {string} myDate a date in any valid format
 * @param {string} myFormat any valid format
 * 
 * @returns {number} epoch date
 *
 */
async function timeEpoch(myDate, myFormat) {
    let moment = require('moment');
    let myEpoch = moment(myDate, myFormat).valueOf();
    return myEpoch;
}


/**
 * @function
 *   timeEpochDate: Convert an epoch to a date
 *
 * @param {number} myEpoch  epoch date
 * @param {string} myFormat any valid format
 * 
 * @returns {number} epoch date
 *
 */
async function timeEpochDate(myEpoch, myFormat) {
    let moment = require('moment');
    myEpoch = myEpoch * 1
    let myDate = moment(myEpoch).format(myFormat);
    //let myDate = moment(1714651259000).format(myFormat);
    return myDate;
}


/**
 * @function
 *   timeEpochAdd: return a date + a value converted into epoch (Unix) date and time
 *
 * @param {string} myDate a date in any valid format or empty pour the current date time
 * @param {string} myFormat any valid format
 * @param {number} myvalue a value to add to the date
 * @param {string} myUnit any valid unit format
 *  ---------------------------------------
 *  Key                 Shorthand
 *  ---------------------------------------
 *  years               y
 *  quarters            Q
 *  months              M
 *  weeks               w
 *  days                d
 *  hours               h
 *  minutes             m
 *  seconds             s
 *  milliseconds        ms
 * 
 * 
 * @returns {number} epoch date
 *
 */
async function timeEpochAdd(myDate, myFormat, myValue, myUnit) {
    let moment = require('moment');
    let myEpoch = 0;
    if (myDate == 'NOW') {
        myEpoch = moment(new Date()).add(myValue, myUnit).valueOf();
    } else {
        myEpoch = moment(myDate, myFormat).add(myValue, myUnit).valueOf();
    }
    return myEpoch; 
}


module.exports = {
    timeEpoch: timeEpoch,
    timeEpochDate: timeEpochDate,
    timeEpochAdd: timeEpochAdd
};   