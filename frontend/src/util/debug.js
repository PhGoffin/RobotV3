/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-10 
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:06:57
 * @Description: Format debug message
 */



/**
 * @function
 *  consoleLog: display a debug message on the console
 *
 * @param {string} context : name of the module
 * @param {integer} level : identation level
 * @param {string} message : debug message
 * 
 *
 */
export function consoleLog(context, level, message, traceOnOff) {

    // if message is not defined, set the value to a string to avoid problem!
    if (message == undefined) {
        message = 'undefined!'
    }

    // if traceOnOff is not defined, it must be set to false
    // if (traceOnOff == undefined || traceOnOff == false) {
    //     return // no trace must be displayed
    // }

    // if traceOnOff is not defined, it must be set to true
    if (traceOnOff == false) {
        return // no trace must be displayed
    }



    if (level == 0) {
        if (typeof (message) == 'object') {
            console.log("> [" + context + "] ", message);
        } else {
            console.log("> [" + context + "] " + message);
        }
    } else if (level == 1) {
        if (typeof (message) == 'object') {
            console.log(">--> [" + context + "] ", message);
        } else {
            console.log(">--> [" + context + "] " + message);
        }
    } else {
        let msg = ">--> [" + context + "] ";
        for (let myId = 0; myId < level - 1; myId++) {
            msg = msg + "-=-";
        }
        msg = msg + ">> ";
        if (typeof (message) == 'object') {
            console.log(msg, message);
        } else {
            console.log(msg + message);
        }

    }
}


/**
 * @function
 *  displayMsg: display a message on the console with a frame
 *
 * @param {string} message Display a message on the console.
 *
 */
export function displayMsg(message, traceOnOff) {


    // if traceOnOff is not defined, it must be set to false
    if (traceOnOff == undefined || traceOnOff == false) {
        return // no trace must be displayed
    }

    message = message.replace(/<BR>/g, "\n");
    message = message.replace(/&quot/g, '"');

    let i = Math.max(message.length, 40);
    for (var word = ''; word.length < i + 4; word += '-') { }
    console.log(">    " + word);

    var myText = message.split('\n');
    for (var elt in myText) {
        console.log(">    - " + myText[elt]);
    }
    console.log(">    " + word);
}









