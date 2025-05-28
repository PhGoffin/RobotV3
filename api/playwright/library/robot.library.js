const { By, Key, Keys, until } = require("selenium-webdriver")
let frameCount = 0;
let frameID = 0;
let Frames = [];


/**
* ---------------------------------------------------------------------------- 
* @function <TbR>
*   switchToDefaultContent: Switch to the default window
*
* @param {object} page:         playwright page
* @param {object} variables:    array of all the variables
*
*/
async function switchToDefaultContent(page, variables) {

    await page.mainFrame().parentFrame() ? page.mainFrame().parentFrame().switchTo() : page.mainFrame().switchTo();

}

/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   dictionary: get a value from the dictionary
*
* @param {object} variables:  array of all the variables
* @param {object} data:       all the parameters
* @param {string} code:       code in the dictionary
* @param {string} language:   language in the dictionary
* @param {string} variable:   name of the variable
*
*/
async function dictionary(variables, data, code, language, variable) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");
    let value = '<N/A>'

    if (code == undefined) {
        return { success: 0, message: 'code is undefined in the function dictionary!', stop: 1 }
    }
    if (variable == undefined) {
        return { success: 0, message: 'variable is undefined in the function dictionary!', stop: 1 }
    }
    if (language == undefined) language = '*'

    // remove the first and the last character if it's a quote
    if (code[0] == "'") {
        code = code.substring(1, code.length)
    }
    if (code.substring(code.length, code.length - 1) == "'") {
        code = code.substring(0, code.length - 1)
    }


    code = variables.evaluateVariable(code)
    code = code.replace(/'/g, "");



    // Check if the code is expressed in a valid dictionary format
    if (code[0] == '@') {
        variables.displayLog(1, 1, 'dictionary(' + code + ', ' + language)
        const dataAPI = { projectID: data.projectID, code: code, language: language, active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            value = result[0].label
            variables.setVariable(variable, value);
            variables.displayLog(1, 1, 'Dictionary: ' + code + ' = ' + value)
            return { success: 1, message: 'dictionary OK!', value: value, stop: 0 }

        } else {
            variables.setVariable(variable, value);
            variables.displayLog(1, 1, 'Dictionary: ' + code + ' not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + code + " in the dictionary for the language: " + language + ' (or *)', stop: 1 }
        }
    } else {
        return { success: 0, message: 'Dictionary: code must start with the character @!', stop: 1 }
    }

}


/**
 * ---------------------------------------------------------------------------- 
 * @function <OK>
 *  debug: define the level of detail in the console of the server
 * 
 * @param {object} variables:  array of all the variables
 * @param {number} verbose:    Level of detail of the debug message
 */

async function debug(variables, verbose) {
    variables.debug(verbose)
}

/**
 * ---------------------------------------------------------------------------- 
 * @function <TbR>
 *  ask: Ask the user to key a value
 * 
 * @param {object} driver:     selenium driver
 * @param {object} variables:   array of all the variables
 * @param {string} myMessage:   message to prompt to the user
 * @param {string} myDefault:   default value
 * @param {string} myVariable:  name of the variable to store the value
 * @param {number} myTimeout:   timeout to close the popup automatically
 */

async function ask(driver, variables, myMessage, myDefault, myVariable, myTimeout) {

    if (myVariable == undefined || myVariable.length == 0) {
        myVariable = '$Ask';
    }

    if (myTimeout == undefined) myTimeout = 30

    variables.displayLog(1, 1, 'ask (' + myMessage + ', ' + myDefault + ', ' + myVariable + ', ' + myTimeout + ')')

    try {
        // Prompt a popup window
        await driver.executeScript("window.promptPasscode=prompt(arguments[0],arguments[1])", myMessage, myDefault);
        // Wait for the alert to be displayed
        await driver.wait(until.alertIsPresent());
    } catch (err) {
        return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
    }



    try {
        await driver.wait(async () => {
            try {
                //if alert is still present on page then return false so main browser.wait will check again.
                await driver.wait(until.alertIsPresent(), 500);
                return false;
            } catch (err) {
                return true;
            }
        }, myTimeout * 1000, 'Alert has not been closed'); // After 30 seconds, the popup is closed and the default value is used 
    } catch (err) {
        // Store the alert in a variable
        variables.setVariable(myVariable, myDefault);
        return { success: 1, message: 'Ask OK', stop: 0 }
    }

    try {
        // get the value returned by the user (before 30 seconds)
        let myInput = await driver.executeScript("return window.promptPasscode");
        if (myInput == undefined) {
            myInput = '';
        }
        // Store the alert in a variable
        variables.setVariable(myVariable, myInput);
        return { success: 1, message: 'Ask OK', stop: 0 }

    } catch (err) {
        return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
    }

}


/**
 * ---------------------------------------------------------------------------- 
 * @function <OK>
 *   email: Send email
 *
 * @param {object} variables:    array of all the variables
 * @param {object} data:         all the parameters
 * @param {string} emailTo:      to people (comma separated for multiple people)
 * @param {string} subject:      subject of the message
 * @param {string} body:         body of the message  use the special character to create multiple lines  ` ...... `
 * @param {string} attachment:   [optional]  Full path name of the attachment(s) - use ';' as a separator
 *
 */
async function email(variables, data, myEmailTo, mySubject, myBody, myAttachment) {

    const { fileExist } = require("./file.library")
    const { getParametersByCode } = require("../../parameter/parameter.service.js");


    let nodemailer = require('nodemailer');
    let fs = require('fs');
    let mailOptions = {};
    let attachments = [];
    let emailHost = ''
    let emailPort = ''
    let emailFrom = ''

    // get the Email Host
    let dataAPI = { projectID: data.projectID, code: 'Email Host' }
    const result1 = await getParametersByCode(dataAPI);
    if (result1.length) {
        let param = result1[0].paramValue
        let myArray = param.split(":");
        emailHost = myArray[0]
        emailPort = myArray[1]
    } else {
        variables.displayLog(1, 1, 'Email - parameter Email Host not found!')
        return { success: 0, message: "Cannot find the parameter Email Host!", stop: 1 }
    }

    // get the Email From
    dataAPI = { projectID: data.projectID, code: 'Email From' }
    const result2 = await getParametersByCode(dataAPI);
    if (result2.length) {
        emailFrom = result2[0].paramValue
    } else {
        variables.displayLog(1, 1, 'Email - parameter Email From not found!')
        return { success: 0, message: "Cannot find the parameter Email From!", stop: 1 }
    }

    //console.log ('emailHost: ' + emailHost + ', emailPort: ' + emailPort + ', emailFrom: ' + emailFrom)



    // evaluate the parameters
    myEmailTo = variables.evaluateVariable(myEmailTo);
    myEmailTo = myEmailTo.replace(/'/g, "");
    mySubject = variables.evaluateVariable(mySubject);
    mySubject = mySubject.replace(/'/g, "");
    mySubject = mySubject.replace(/<BR>/g, "\n");
    mySubject = mySubject.replace(/&quot/g, '"');
    myBody = variables.evaluateVariable(myBody);
    myBody = myBody.replace(/'/g, "");
    //myBody = myBody.replace(/<BR>/g, "\n");
    myBody = myBody.replace(/<BR>/g, "<br />");
    myBody = myBody.replace(/&quot/g, '"');
    myBody = myBody.replace(/<BOLD>/g, '<span style="font-weight:bold;">');
    myBody = myBody.replace(/<ITALIC>/g, '<span style="font-style:italic;">');
    myBody = myBody.replace(/<UNDERLINE>/g, '<span style="text-decoration:underline;">');
    myBody = myBody.replace(/<RED>/g, '<span style="color:red;">');
    myBody = myBody.replace(/<GREEN>/g, '<span style="color:green;">');
    myBody = myBody.replace(/<BLUE>/g, '<span style="color:blue;">');
    myBody = myBody.replace(/<BLACK>/g, '<span style="color:black;">');
    myBody = myBody.replace(/<ORANGE>/g, '<span style="color:orange;">');
    myBody = myBody.replace(/<YELLOW>/g, '<span style="color:yellow;">');
    myBody = myBody.replace(/<NORMAL>/g, '</span>');
    myBody = myBody.replace(/<th>/g, '<th style="padding-left:15px; padding-right:15px; background-color:#DCDCDC; text-align:center; border-collapse:collapse; border:1px solid black;">');
    myBody = myBody.replace(/<td>/g, '<td style="padding-left:15px; padding-right:15px; text-align:center; border-collapse:collapse; border:1px solid black;">');

    let myNotice = ` 

        --- Please do not reply, this is an automatically generated message.  ---
        `;
    myBody = myBody + myNotice;

    //console.log (myBody);

    variables.displayLog(1, 1, 'email(' + myEmailTo + ', ' + mySubject + ', ' + myBody + ')');


    var transporter = nodemailer.createTransport({
        host: emailHost,
        port: emailPort,
        secure: false,
        tls: { rejectUnauthorized: false }
    });

    if (myAttachment != undefined && myAttachment != '' && myAttachment != 'N/A' && myAttachment != '<N/A>' && myAttachment != '0') {

        myAttachment = variables.evaluateVariable(myAttachment);
        myAttachment = myAttachment.replace(/'/g, "");
        variables.displayLog(1, 2, 'email attachment(' + myAttachment + ')');
        // Split the attachment by ;
        let myAttachmentArray = myAttachment.split(";");
        let i = 1;
        for (var item in myAttachmentArray) {
            myAttachmentArray[item] = myAttachmentArray[item].trim();
            if (myAttachmentArray[item] != 'N/A' && myAttachmentArray[item] != '<N/A>') {
                // Check file exists
                ret = await fileExist(myAttachmentArray[item])
                if (ret == false) {
                    // file not found!
                    variables.displayLog(1, 1, "Email attachment: file not found! (" + myAttachmentArray[item] + ")");
                    variables.setVariable("$Error", "1");
                    return { success: 0, message: "Email attachment: file not found! (" + myAttachmentArray[item] + ")", stop: 1 }

                }
                let files = {};
                files.filename = myAttachmentArray[item].substring(myAttachmentArray[item].lastIndexOf('/') + 1);
                files.content = fs.createReadStream(myAttachmentArray[item]);
                attachments.push(files);
                variables.displayLog(1, 2, 'email attachment: ' + files.filename);
            }
        };

        mailOptions = {
            from: emailFrom,
            to: myEmailTo,
            subject: mySubject,
            //text: myBody,
            html: myBody,
            attachments: attachments
        };

        //console.log (attachments);

    } else {
        mailOptions = {
            from: emailFrom,
            to: myEmailTo,
            subject: mySubject,
            //text: myBody
            html: myBody
        };
    };


    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            variables.displayLog(0, 1, 'email - sendMail Error:', error);
            return { success: 0, message: "email - sendMail Error: " + error, stop: 1 }

        } else {
            variables.displayLog(0, 1, 'sendEmail: Email sent');
            return { success: 1, message: 'sendEmail: Email sent', stop: 0 }
        }
    });

}




/**
 * ---------------------------------------------------------------------------- 
 * @function <OK>
 *  stopTest: stop the test if the condition is true
 * 
 * @param {object} variables:  array of all the variables
 * @param {string} condition:  condition to evaluate
 * @param {string} message:    message to display if the condition is true
 */

async function stopTest(variables, condition, message) {
    variables.displayLog(1, 1, 'stopTest')

    if (condition == undefined) {
        return { success: 0, message: 'stopTest, condition is mandatory!', stop: 1 }
    }

    condition = variables.evaluateVariable(condition)
    //condition = condition.replace(/'/g, "");    
    message = variables.evaluateVariable(message)
    message = message.replace(/'/g, "");

    try {
        resultCondition = await eval(condition);
        if (resultCondition) {
            variables.displayLog(1, 2, 'stopTest is true - messsage: ' + message)
            return { success: 0, message: message, stop: 1 }
        } else {
            variables.displayLog(1, 2, 'stopTest is false, continue to test...')
            return { success: 1, message: 'stopTest is false, continue to test...', stop: 0 }
        }
    }
    catch (err) {
        variables.displayLog(1, 2, 'Error in the evaluation of the stopTest condition: ' + condition + ' Error: ' + err.message)
        return { success: 0, message: err.message, stop: 1 }
    }

}



/**
 * ---------------------------------------------------------------------------- 
 * @function <TbR> ???? To be tested
 *  detectFrame: Recursive function to detect all the frames
 * 
 * @param {object} page:       playwright page
 * @param {object} variables:  array of all the variables
 * @param {string} framePath:  Level of the frame
 */

async function detectFrame(page, variables, framePath) {

    let mySeparator = "-";
    let frameOk = 1;
    frameOk = await checkFrame(page, variables, framePath);
    if (frameOk == 1) {
        if (framePath != undefined && framePath != "") {
            Frames[frameID] = '0' + framePath;
            let myId = frameID + 1;
            frameID = frameID + 1;
        }

        try {
            let tag = "//*[self::frame or self::iframe]"
            await page.locator(tag).first().waitFor()
            const count = await page.locator(tag).count()
            if (count >= 0) {
                frameCount = frameCount + count;
                let nextLevel = 1;
                for (let i = 0; i < count; i++) {
                    let frameNextPath = framePath + mySeparator + nextLevel;
                    nextLevel = nextLevel + 1;
                    await detectFrame(page, variables, frameNextPath);
                }
                return 1;
            } else {
            }

        } catch (err) {
            return 0
        }


        // try {
        //     return driver.findElements(By.xpath("//*[self::frame or self::iframe]")).then(async (result) => {
        //         //return element.all(by.xpath("//*[self::frame or self::iframe]")).then(async (result) => {
        //         //console.log ('debug: detectFrame', result)
        //         if (result.length >= 0) {
        //             frameCount = frameCount + result.length;
        //             let nextLevel = 1;
        //             for (var item in result) {
        //                 let frameNextPath = framePath + mySeparator + nextLevel;
        //                 nextLevel = nextLevel + 1;
        //                 await detectFrame(page, variables, frameNextPath);
        //             }
        //             return 1;
        //         } else {
        //         }
        //     });
        // } catch (err) {
        //     return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
        // }

    } else {
        throw new Error("Internal error during detection of the frame (" + framePath + ")!");
    }
}


/**
 * ---------------------------------------------------------------------------- 
 * @function <OK>
 *  checkFrame: Check if a frame path exists
 * 
 * @param {object} page:        playwright page
 * @param {object} variables:   array of all the variables
 * @param {string} framePath:   Level of the frame
 */

async function checkFrame(page, variables, framePath) {

    let frameLocator

    if (framePath == undefined || framePath == "") {
        return { success: 99, message: 'No frame!', stop: 0 }
    }

    let myArray = framePath.split("-")

    let frameId = -100
    let frameOK = 0
    for (var item in myArray) {
        try {
            frameId = myArray[item] - 1
            if (frameId >= 0) {
                frameLocator = page.frameLocator(frameId)
                await frameLocator.waitFor();
                frameOK = 1
                return { success: 1, message: 'checkFrame OK!', frame: frameLocator, stop: 0 }
            }
        }
        catch (err) {
            return { success: 99, message: 'checkFrame KO!', stop: 0 }
        }
    }  // end for

    return frameOK
}


/**
 * ---------------------------------------------------------------------------- 
 * @function <OK>
 *  SwitchToBrowserTab:  Switch to the last tab of the browser
 *
 * @param {object} page:        playwright page
 * @param {number} tabID:       browser tab id (0 for the last one)
 *   
 */
async function switchToBrowserTab(page, tabID) {

    if (tabID != undefined) tabID--
    else tabID = -1

    try {

        const pages = await page.context().pages();
        let nbHandle = pages.length - 1; // Playwright uses pages, not window handles

        if (nbHandle > 0) {
            let newPage = pages[nbHandle];
            if (tabID >= 0 && tabID < pages.length) { // Check if tabID is valid
                newPage = pages[tabID];
            }

            await newPage.bringToFront(); // Bring the page to the front.  No need for switchTo().window()
            return { success: 1, message: 'Switch to the browser tab', stop: 0 };
        } else {
            return { success: 0, message: 'No extra tab open in the browser!', stop: 0 };
        }

    } catch (error) {
        console.error("Error switching tab:", error);
        return { success: 0, message: `Error switching tab: ${error.message}`, stop: 1 };
    }


}

/**
 * ---------------------------------------------------------------------------- 
 * @function <OK>
 *  CloseBrowserTab:  Close the last tab of the browser
 *  
* @param {object} page:         playwright page
 * 
 */
async function closeBrowserTab(page) {

    const pages = await page.context().pages(); // Get all pages (tabs/windows)
    const pageCount = pages.length;

    if (pageCount > 1) {
        const lastPage = pages[pageCount - 1]; // Get the last page
        await lastPage.close(); // Close the last page
        const previousPage = pages[pageCount - 2] || pages[0]; // Switch to the previous page or the first if it was the second tab
        await previousPage.bringToFront(); // Bring the previous page to the front
        return { success: 1, message: 'Closed the browser tab and returned to the previous one', stop: 0 };
    } else {
        return { success: 0, message: 'No extra tab open in the browser!', stop: 0 };
    }

}


/**
* ---------------------------------------------------------------------------- 
* @function <TbR>
*  switchToFrame:  Switch to an Frame
* 
* @param {object} page:         playwright page
* @param {object} variables:    array of all the variables
* @param {object} data:         all the parameters
* @param {string} frameId:      id of the frame starting with 1 - 0 : to back to main page 
*
*/
async function switchToFrame(page, variables, data, frameId) {
    variables.displayLog(1, 1, "switchToFrame (" + frameId + ")");
    let myFrame
    let frameLocator = ""

    // Check if the driver is still alive
    // PGO: 14/06/2024
    // try {
    //     let url = await driver.getCurrentUrl()
    //     variables.displayLog(2, 1, 'Url: ', url)
    //     if (url == null) {
    //         variables.displayLog(1, 1, 'Browser not responding (3)!')
    //         return { success: 0, message: 'Browser not responding!', stop: 1 }
    //     }
    // } catch (err) {
    //     variables.displayLog(1, 1, 'Browser not responding (4)!')
    //     return { success: 0, message: 'Browser not responding!', stop: 1 }
    // }

    try {
        if (frameId == 0) {
            let ret = await switchToDefaultContent(page, variables)
            if (!ret.success) return { success: 0, message: ret.message, stop: 1 }
            myFrame = "0";
            variables.setVariable("$myFrame", myFrame);
            data.frameID = 0
            //await driver.sleep(3000);
        } else {
            data.frameID = frameId
            frameId = frameId - 1;
            frameLocator = page.frameLocator(frameId)
            await frameLocator.waitFor();
            frameLocator.switchTo();
            myFrame = myFrame + "-" + (frameId + 1);
            variables.setVariable("$myFrame", myFrame);
            //await driver.sleep(3000);
        }
        return { success: 1, message: 'switchToFrame OK', stop: 0 }

    }
    catch (err) {
        variables.displayLog(1, 1, "switchToFrame() - Error in the frame: " + frameId + " " + err.name + ': ' + err.message);
        variables.setVariable("$Error", "1");
        return { success: 0, message: "switchToFrame() - Error in the frame: " + frameId + " " + err.name + ': ' + err.message, stop: 1 }
    }
};


/**
* ---------------------------------------------------------------------------- 
* @function <TBR>
*   getElement: get html element by xpath or by css
*
* @param {object} page:         playwright page
* @param {object} variables:    array of all the variables
* @param {object} data:         all the parameters
* @param {string} tag:          tag of the element
*
*/
async function getElement_OBSOLETE(driver, variables, data, tag) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");
    const { Left } = require("./string.library.js");

    let element
    let ret

    if (tag == undefined) {
        return { success: 0, message: 'tag is undefined in the function getElement!', stop: 1 }
    }


    // remove the first and the last character if it's a quote
    if (tag[0] == "'") {
        tag = tag.substring(1, tag.length)
    }
    if (tag.substring(tag.length, tag.length - 1) == "'") {
        tag = tag.substring(0, tag.length - 1)
    }

    // protect original quote
    tag = tag.replace(/'/g, "&apos;")

    // Check if the tag is not on the dictionary
    if (tag[0] == '@') {
        const dataAPI = { projectID: data.projectID, code: tag, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tag = result[0].label
            //console.log (link)
        } else {
            variables.displayLog(1, 1, 'Data: ' + tag + ' not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tag + " in the dictionary!", stop: 1 }
        }
    }

    //tag = tag.replace('$$-1', 'BEFORELAST');
    tag = tag.replace('$$', 'LAST');

    tag = variables.evaluateVariable(tag)
    tag = tag.replace(/''/g, "'");
    tag = tag.replace(/&apos;/g, "'")

    // remove the first and the last character if it's a quote
    if (tag[0] == "'") {
        tag = tag.substring(1, tag.length)
    }
    if (tag.substring(tag.length, tag.length - 1) == "'") {
        tag = tag.substring(0, tag.length - 1)
    }

    // detect the position (if any)
    // s.substr(a, b) is the same as s.substring(a, a+b)
    let myOccurence = 1;
    if (tag[0] == "(" && tag[1] != '/') {
        // tag contains the occurence (in the case of non unique identifier)
        let j = tag.indexOf(')', 0);
        myOccurence = tag.substring(1, j);
        //myOccurence--;
        if (Left(myOccurence, 4) != 'LAST') {
            if (Left(myOccurence, 1) == '$') {
                myOccurence = variables.evaluateVariable(myOccurence);
            }
            //myOccurence--;
        } else {
            myOccurence = myOccurence.replace('LAST', 'last()');
        }
        tag = tag.substring(j + 1);
    }

    variables.displayLog(1, 1, 'getElement - tag: ' + tag)


    //if (tag.substring(0, 2) == '//' || tag.substring(0, 3) == '(//') {
    if (tag.includes('//')) {

        /* -------------------------------------------------------------
        * Detection by xpath
        * -------------------------------------------------------------
        */
        //variables.displayLog(1, 1, '---- getElement: xpath detected in ' + tag)
        tag = '(' + tag + ')[' + myOccurence + ']'
        try {
            variables.displayLog(1, 2, 'getElement try Xpath no frame, with tag: ' + tag)
            element = await driver.findElement(By.xpath(tag))
            variables.displayLog(1, 2, 'getElement found the element by xpath')
            return { success: 1, element: element, message: 'getElement by Xpath OK', stop: 0 }
        } catch (err) {
            // Element is not detected, try to see if there is frame or iframe on the page
            Frames = [];
            frameID = 0;
            await detectFrame(driver, variables, "");
            frameID = 0;
            if (Frames[0] == undefined) { // No frame, stop the process
                variables.displayLog(1, 2, 'getElement by xpath not detected (no frame)')
                return { success: 0, message: 'getElement by xpath not detected (no frame)', stop: 0 }
            }

            try {
                // first, try with the default Content
                //await driver.switchTo().defaultContent();
                variables.displayLog(1, 2, 'Not detected, try with the frames: ', Frames)
                let ret = await switchToDefaultContent(driver, variables)
                if (!ret.success) return { success: 0, message: ret.message, stop: 1 }

                element = await driver.findElement(By.xpath(tag))
                //element = elements[myOccurence]
                variables.displayLog(1, 2, 'getElement by Xpath OK (defautlt Content)')
                return { success: 1, element: element, message: 'getElement by Xpath OK (defautlt Content)', stop: 0 }
            } catch (err) {
                // Loop through all the frames to check the existence of the element
                while ((element == undefined || element.length == 0)) {
                    let frameOk = await checkFrame(driver, variables, Frames[frameID]);
                    if (!frameOk) checkAgain = 0
                    else {
                        try {
                            variables.displayLog(1, 2, 'getElement try Xpath with frame: ' + Frames[frameID])
                            element = await driver.findElement(By.xpath(tag))
                            //element = elements[myOccurence]
                            variables.displayLog(1, 2, 'getElement by Xpath (with frame: ' + Frames[frameID] + ') OK')
                            return { success: 1, element: element, message: 'getElement by Xpath (with frame) OK', stop: 0 }
                        } catch (err) {
                            frameID = frameID + 1;
                            if (frameID >= Frames.length) {
                                // We try all the different frames, we have to stop and be resigned :)
                                variables.displayLog(1, 2, 'getElement by xpath not detected (with frame)')
                                //variables.displayLog(2, 2, tag)
                                return { success: 0, message: 'getElement by xpath not detected (with frame)', stop: 0 }
                            }
                        }
                    }
                }
            }

            ret = { success: 0, message: err.message, stop: 0 }
            return ret
        }
    } else {

        /* -------------------------------------------------------------
        * Detection by CSS
        * -------------------------------------------------------------
        */
        try {
            variables.displayLog(1, 1, '----- get element found the element by CSS')
            element = await driver.findElement(By.css(tag))
            return { success: 1, element: element, message: 'getElement by CSS OK', stop: 0 }
        } catch (err) {
            //console.log('debug: in the catch 1', err.message)
            if (err.message.indexOf('target window already closed') >= 0) {
                //console.log ('fatal error: ' + err.message + '**')
                ret = { success: 0, message: 'Browser not responding!', stop: 1 }
                return ret
            }
            // Element is not detected, try to see if there is frame or iframe on the page
            Frames = [];
            frameID = 0;
            //console.log('debug: in the catch 1.1')
            await detectFrame(driver, variables, "");
            //console.log('debug: in the catch 1.2')
            frameID = 0;
            if (Frames[0] == '0' || Frames[0] == undefined) { // No frame, stop the process
                variables.displayLog(1, 1, '----- getElement by CSS not detected (no frame)')
                return { success: 0, message: 'getElement by CSS not detected (no frame)', stop: 0 }
            }

            try {
                // first, try with the default Content
                //await driver.switchTo().defaultContent();
                let ret = await switchToDefaultContent(driver, variables)
                if (!ret.success) return { success: 0, message: ret.message, stop: 1 }
                element = await driver.findElement(By.css(tag))
                variables.displayLog(1, 1, '----- getElement by CSS OK (defautlt Content)')
                return { success: 1, element: element, message: 'getElement by CSS OK (defautlt Content)', stop: 0 }
            } catch (err) {
                //console.log('debug: in the catch 2')
                // Loop through all the frames to check the existence of the element
                while ((element == undefined || element.length == 0)) {
                    let frameOk = await checkFrame(driver, variables, Frames[frameID]);
                    if (!frameOk) checkAgain = 0
                    else {
                        try {
                            element = await driver.findElement(By.css(tag))
                            variables.displayLog(1, 1, '----- getElement by CSS (with frame) OK')
                            return { success: 1, element: element, message: 'getElement by CSS (with frame) OK', stop: 0 }
                        } catch (err) {
                            frameID = frameID + 1;
                            if (frameID >= Frames.length) {
                                // We try all the different frames, we have to stop and be resigned :)
                                variables.displayLog(1, 1, '----- getElement by CSS not detected (with frame)')
                                return { success: 0, message: 'getElement by CSS not detected (with frame)', stop: 0 }
                            }
                        }
                    }
                }
            }

            ret = { success: 0, message: err.message, stop: 0 }
            return ret
        }


    }
}



/**
* ---------------------------------------------------------------------------- 
* @function <TBR>
*   getAllElements: get html element by xpath or by css
*
* @param {object} page:         playwright page
* @param {object} variables:  array of all the variables
* @param {object} data:       all the parameters
* @param {string} tag:        tag of the element
*
*/
async function getAllElements_OBSOLETE(driver, variables, data, tag) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");
    const { Left } = require("./string.library.js");

    let elements
    let ret

    if (tag == undefined) {
        return { success: 0, message: 'tag is undefined in the function getAllElements!', stop: 1 }
    }


    // remove the first and the last character if it's a quote
    if (tag[0] == "'") {
        tag = tag.substring(1, tag.length)
    }
    if (tag.substring(tag.length, tag.length - 1) == "'") {
        tag = tag.substring(0, tag.length - 1)
    }

    // protect original quote
    tag = tag.replace(/'/g, "&apos;")


    // Check if the tag is not on the dictionary
    if (tag[0] == '@') {
        const dataAPI = { projectID: data.projectID, code: tag, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tag = result[0].label
            //console.log (link)
        } else {
            variables.displayLog(1, 1, 'Data: ' + tag + ' not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tag + " in the dictionary!", stop: 1 }
        }
    }

    tag = variables.evaluateVariable(tag)
    tag = tag.replace(/''/g, "'");
    tag = tag.replace(/&apos;/g, "'")

    // remove the first and the last character if it's a quote
    if (tag[0] == "'") {
        tag = tag.substring(1, tag.length)
    }
    if (tag.substring(tag.length, tag.length - 1) == "'") {
        tag = tag.substring(0, tag.length - 1)
    }

    // detect the position (if any)
    // s.substr(a, b) is the same as s.substring(a, a+b)
    let myOccurence = 1;
    if (tag[0] == "(" && tag[1] != '/') {
        // tag contains the occurence (in the case of non unique identifier)
        let j = tag.indexOf(')', 0);
        myOccurence = tag.substring(1, j);
        //myOccurence--;
        if (Left(myOccurence, 2) != '$$') { // $$ means the last element
            if (Left(myOccurence, 1) == '$') {
                myOccurence = variables.evaluateVariable(myOccurence);
            }
            //myOccurence--;
        }
        tag = tag.substring(j + 1);
    }

    variables.displayLog(1, 1, '     @@@@@@@@@@@@@@@@@@@@@@@@===== tag: ' + tag)

    

    //if (tag.substring(0, 2) == '//' || tag.substring(0, 3) == '(//') {
    if (tag.includes('//')) {


        /* -------------------------------------------------------------
        * Detection by xpath
        * -------------------------------------------------------------
        */
        //variables.displayLog(1, 1, '---- getElement: xpath detected in ' + tag)
        //variables.displayLog(1, 1, '     ===== Tag - occurence: ', myOccurence, ' tag: ', tag)
        try {
            elements = await driver.findElements(By.xpath(tag))
            if (elements.length > 0) {
                return { success: 1, element: elements, message: 'getAllElements by Xpath OK', stop: 0 }
            } else {
                // Provoke an error, to execute the catch
                throw new Error('No element detected!')
            }


        } catch (err) {
            // Element is not detected, try to see if there is frame or iframe on the page
            Frames = [];
            frameID = 0;
            await detectFrame(driver, variables, "");
            frameID = 0;
            if (Frames[0] == '0' || Frames[0] == undefined) { // No frame, stop the process
                variables.displayLog(1, 1, '----- getAllElements by xpath not detected (no frame)')
                return { success: 0, message: 'getAllElements by xpath not detected (no frame)', stop: 0 }
            }
            //variables.displayLog(1, 2, '----- getAllElements: ' + Frames.length + ' frame(s) detected')

            try {
                // first, try with the default Content
                //await driver.switchTo().defaultContent();
                let ret = await switchToDefaultContent(driver, variables)
                if (!ret.success) return { success: 0, message: ret.message, stop: 1 }

                elements = await driver.findElements(By.xpath(tag))
                //variables.displayLog(1, 2, '----- getAllElements by Xpath OK (defautlt Content): ' + elements.length + ' record(s)')
                if (elements.length > 0) {
                    return { success: 1, element: elements, message: 'getAllElements by Xpath OK (defautlt Content)', stop: 0 }
                } else {
                    // Provoke an error, to execute the catch
                    throw new Error('No element detected!')
                }

            } catch (err) {
                // Loop through all the frames to check the existence of the element
                let checkAgain = 1
                while ((elements == undefined || elements.length == 0) && checkAgain) {
                    frameID++
                    let frameOk = await checkFrame(driver, variables, Frames[frameID - 1]);
                    //variables.displayLog(1, 2, '----- getAllElements:  check with the frame: ' + frameID + ' value: ' + Frames[frameID - 1] + ' status: ' + frameOk)
                    if (!frameOk) checkAgain = 0
                    else {
                        try {
                            elements = await driver.findElements(By.xpath(tag))
                            //variables.displayLog(1, 2, '----- getAllElements by Xpath (with frame) OK: ' + elements.length + ' record(s)')
                            //return { success: 1, element: elements, message: 'getAllElements by Xpath (with frame) OK', stop: 0 }
                            if (elements.length > 0) {
                                return { success: 1, element: elements, message: 'getAllElements by Xpath (with frame: ' + frameID + ') OK', stop: 0 }
                            } else {
                                // Provoke an error, to execute the catch
                                //variables.displayLog(1, 2, '----- getAllElements by Xpath (with frame: ' + frameID + ') No element detected!')
                                throw new Error('No element detected!')
                            }
                        } catch (err) {
                            frameID = frameID + 1;
                            if (frameID >= Frames.length) {
                                // We try all the different frames, we have to stop and be resigned :)
                                //variables.displayLog(1, 2, '----- getAllElements by xpath not detected (with frame)')
                                return { success: 0, message: 'getAllElements by xpath not detected (with frame)', stop: 0 }
                            }
                        }
                    }
                }
            }

            ret = { success: 0, message: err.message, stop: 0 }
            return ret
        }
    } else {
        /* -------------------------------------------------------------
        * Detection by CSS
        * -------------------------------------------------------------
        */
        try {
            elements = await driver.findElements(By.css(tag))
            variables.displayLog(1, 1, '----- getAllElements found the element by CSS: ' + elements.length + ' record(s)')
            return { success: 1, element: elements, message: 'getAllElements by CSS OK', stop: 0 }
        } catch (err) {
            // Element is not detected, try to see if there is frame or iframe on the page
            Frames = [];
            frameID = 0;
            await detectFrame(driver, variables, "");
            frameID = 0;
            if (Frames[0] == '0' || Frames[0] == undefined) { // No frame, stop the process
                variables.displayLog(1, 1, '----- getAllElements by CSS not detected (no frame)')
                return { success: 0, message: 'getAllElements by CSS not detected (no frame)', stop: 0 }
            }

            try {
                // first, try with the default Content
                //await driver.switchTo().defaultContent();
                let ret = await switchToDefaultContent(driver, variables)
                if (!ret.success) return { success: 0, message: ret.message, stop: 1 }

                elements = await driver.findElements(By.css(tag))
                variables.displayLog(1, 1, '----- getAllElements by CSS OK (defautlt Content): ' + elements.length + ' record(s)')
                return { success: 1, element: elements, message: 'getAllElements by CSS OK (defautlt Content)', stop: 0 }
            } catch (err) {
                // Loop through all the frames to check the existence of the element
                while ((elements == undefined || elements.length == 0)) {
                    let frameOk = await checkFrame(driver, variables, Frames[frameID]);
                    if (!frameOk) checkAgain = 0
                    else {
                        try {
                            elements = await driver.findElements(By.css(tag))
                            variables.displayLog(1, 1, '----- getAllElements by CSS (with frame) OK: ' + elements.length + ' record(s)')
                            return { success: 1, element: elements, message: 'getAllElements by CSS (with frame) OK', stop: 0 }
                        } catch (err) {
                            frameID = frameID + 1;
                            if (frameID >= Frames.length) {
                                // We try all the different frames, we have to stop and be resigned :)
                                variables.displayLog(1, 1, '----- getAllElements by CSS not detected (with frame)')
                                return { success: 0, message: 'getAllElements by CSS not detected (with frame)', stop: 0 }
                            }
                        }
                    }
                }
            }

            ret = { success: 0, message: err.message, stop: 0 }
            return ret
        }

    }

}



/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   countElement: count the number of element
*
* @param {object} page:         playwright page
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {number} tagElement:   tag of the element to be checked
* @param {string} variable:     name of the variable to store the number of elements
* @param {number} delay:        delay in seconds
* @param {number} action:       action in case element is not found: continue (0) or stop all the tests (1) or skip the It (2)
*
*/
async function countElement(page, data, variables, tagElement, variable, delay, action) {

    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");


    // Check if the tag is not on the dictionary
    if (tagElement[0] == '@') {
        const dataAPI = { projectID: data.projectID, code: tagElement, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tagElement = result[0].label
        } else {
            variables.displayLog(1, 1, 'Data: ' + tagElement + ' not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tagElement + " in the dictionary!", stop: 1 }
        }
    }


    try {
        if (delay == undefined) delay = 10    // delay = number of loop (or second) to wait for the element

        page.setDefaultTimeout(delay * 1000);
        await page.locator(tagElement).first().waitFor()
        const count = await page.locator(tagElement).count()
        // store the value into the variable
        variables.setVariable(variable, count)
        variables.displayLog(1, 2, 'countElement: ' + count)

        return { success: 1, message: "countElement", value: count, stop: 0 }
    }
    catch (err) {
        console.log('countElement error............')
        variables.setVariable('$Error', "1")
        if (action == undefined) action = 0
        // action: 0 = continue, 1 = stop all the tests, 2 = skip the It

        let ret = { success: 0, message: 'countElement KO', stop: 0 }
        if (action == 1) { ret.stop = 1 }
        else if (action == 0) { ret.success = 1 }
        else { ret.success = 0 }
        return ret
    }

}

/**
 * @function
 *   computeGUIDistance: Compute the distance of the path (the deepest, the farthest)
 *
 * @param {string} myPath.
 *
 */
async function computeGUIDistance(myPath) {
    let distance = 0;
    let slice = 0;
    let id = myPath.indexOf('/', 0);
    while (id > 0) {
        slice = slice + 1;
        if (myPath.substring(id + 1, id + 4) == '***') {
            distance = slice * 30;
        } else if (myPath.substr(id + 1, id + 3) == '**') {
            distance = slice * 20;
        } else if (myPath.substr(id + 1, id + 2) == '*') {
            distance = slice * 10;
        }
        id = myPath.indexOf('/', id + 1);
    }
    return distance;
}

/**
 * @function
 *   computeGUIDistance: Compute the distance of the path (the deepest, the farthest)
 *
 * @param {string} myPath.
 *
 */
async function computeGUIDistanceV2(myPath) {
    let distance = 0;
    let myArray = myPath.split("/");

    for (let slice = 0; slice < myArray.length; slice++) {
        if (myArray[slice].includes('::*[1]')) {
            //distance = distance + ((slice + 1) * 10)
            distance = ((slice + 1) * 2)
        } else if (myArray[slice].includes('::*[2]')) {
            //distance = distance + ((slice + 1) * 20)
            distance = ((slice + 1) * 3)
        } else if (myArray[slice].includes('::*[3]')) {
            //distance = distance + ((slice + 1) * 30)
            distance = ((slice + 1) * 4)
        } else {
            //distance = distance + (slice + 1)
            distance = (slice + 1)
        }
        //console.log ('Distance in the loop: ' + slice + ' is ' + distance)
    }
    //console.log ('computeGUIDistanceV2: , distance')
    return distance;
}


/**
* ---------------------------------------------------------------------------- 
* @function <TBR>
*   detectGUI: Detect an element on a webpage (based on a pattern generated by Artificial Intelligence)
* @param {object} driver:      selenium driver
* @param {object} variables:   array of all the variables
* @param {object} data:        all the parameters
* @param {number} selectorID:  id of the selector in the pattern.json
* @param {string} myCriteria:  criteria to identify the element (a label for instance)
* @param {number} myPosition:  [Optional] position of the element (starting by 1)
* @param {number} myWaitFor:   [Optional] number of seconds to wait for the presence of the element
*/


async function detectGUI(driver, variables, data, selectorID, myCriteria, myPosition, myWaitFor) {
    const { Left, Right } = require("./string.library.js");
    const { getDatasetByCode } = require("../../dataset/dataset.service.js");
    const { getPatternsByCode } = require("../../pattern/pattern.service.js");
    const { getParametersByCode } = require("../../parameter/parameter.service.js");

    let dataAPI = {}
    let ret = {}
    let detectID = 0
    let Patterns = []
    let AIRoot = ''
    let delay = 3       // default delay = 3 sec
    let timeout = 1000  //Default timeout between operations is 1000ms = 1 second


    // Search the text in the dataset 
    if (myCriteria[0] == '#') {
        myCriteria = variables.evaluateVariable(myCriteria)
        myCriteria = myCriteria.replace(/'/g, "");
        dataAPI = { subprojectID: data.subprojectID, code: myCriteria, language: '*', active: 1 }
        const result = await getDatasetByCode(dataAPI);
        if (result.length) {
            myCriteria = result[0].label
        } else {
            variables.displayLog(1, 1, 'Data not found in the dataset!')
            return { success: 0, message: "Cannot find the code: " + myCriteria + " in the dataset!", stop: 1 }
        }
    }

    // include the new format of the pattern with <LENGTH> - PGO 01/08/2022
    let j = 0
    let myLength = ''
    myCriteria = myCriteria.trim()
    if (Left(myCriteria, 1) == '=') {
        j = myCriteria.indexOf(' ', 1)
        if (j >= 0) {
            myLength = myCriteria.substring(1, j)
            myLength = 'string-length(text()) = ' + myLength + ' and '
            myCriteria = myCriteria.substring(j + 1)
        }
    } else if (Left(myCriteria, 2) == '<=') {
        j = myCriteria.indexOf(' ', 1)
        if (j >= 0) {
            myLength = myCriteria.substring(2, j)
            myLength = 'string-length(text()) <= ' + myLength + ' and '
            myCriteria = myCriteria.substring(j + 1)
        }
    } else if (Left(myCriteria, 2) == '>=') {
        j = myCriteria.indexOf(' ', 1)
        if (j >= 0) {
            myLength = myCriteria.substring(2, j);
            myLength = 'string-length(text()) >= ' + myLength + ' and '
            myCriteria = myCriteria.substring(j + 1)
        }
    } else if (Left(myCriteria, 1) == '<') {
        j = myCriteria.indexOf(' ', 1);
        if (j >= 0) {
            myLength = myCriteria.substring(1, j)
            myLength = 'string-length(text()) < ' + myLength + ' and '
            myCriteria = myCriteria.substring(j + 1)
        }
    } else if (Left(myCriteria, 1) == '>') {
        j = myCriteria.indexOf(' ', 1)
        if (j >= 0) {
            myLength = myCriteria.substring(1, j)
            myLength = 'string-length(text()) > ' + myLength + ' and '
            myCriteria = myCriteria.substring(j + 1)
        }
    } else {
        myLength = ''
    }

    //Default count is 1 - do not exit all the tests, just the IT section
    if (myWaitFor == undefined || myWaitFor == "" || myWaitFor == 0) {
        myWaitFor = 0
    } else delay = myWaitFor


    variables.displayLog(1, 1, 'detectGUI (' + selectorID + ', ' + myCriteria + ', ' + myPosition + ', ' + myWaitFor + ' / ' + delay + ')')


    // --------------------------------------------------------------------------
    // get the global parameter: AI Root (a generic xpath to detect the criteria)
    // --------------------------------------------------------------------------
    dataAPI = { projectID: 0, code: 'AI Root' }
    const result1 = await getParametersByCode(dataAPI);
    if (result1.length) {
        AIRoot = result1[0].paramValue
    } else {
        variables.displayLog(1, 1, 'detctGUI - global parameter AI Root not found!')
        ret = { success: 0, message: "detctGUI: Cannot find the global parameter AI Root!", stop: 1 }
        return resolve(ret);
    }

    // In AI Root, replace <PARAM> by the criteria
    AIRoot = AIRoot.replace(/<PARAM>/g, myCriteria)
    variables.displayLog(1, 1, 'AIRoot: ', AIRoot)

    try {
        // if (myWaitFor > 0) {
        // wait for the generic criteria
        ret = await waitFor(driver, data, variables, AIRoot, delay, 1)
        if (!ret.success) {
            if (ret.stop == 99) return { success: 0, message: "Browser not responding!", stop: 99 }
            variables.displayMsg("> detectGUI: Warning: No way to detect: " + AIRoot + "!");
            variables.setVariable("$Error", "1");
            variables.setVariable("$GUI", "ERROR");
            if (myWaitFor) return { success: 0, message: "Error: Cannot Detect the GUI pattern!", stop: 1 }
            else return { success: 0, message: "Warning: Cannot Detect the GUI pattern!", stop: 0 }
        }
        // }
    } catch (err) {
        variables.displayLog(1, 1, 'detectGUI: Fatal error: Browser not responding!')
        return { success: 0, message: "Browser not responding!", stop: 99 }
    }



    // Get the Xpath to use to detect an element
    let myId = ''
    let myPath = ''
    let myResult = ''
    let myTag = ''
    let myAttribute = ''
    let myXpath = ''
    let myWeight = 0
    let myDistance = 0
    let disabledField = 0
    let PatternCandidate = [] // Array of all the pattern candidates: Id, Path, Tag, Attributes, Result, Weight 

    // Read all the possible patterns for the element
    dataAPI = { projectID: data.projectID, selectorID: selectorID }
    Patterns = await getPatternsByCode(dataAPI)
    //console.log ('Patterns: ', Patterns)
    if (!Patterns.length) {
        variables.displayLog(1, 1, "Cannot find the selector: " + selectorID + " in the patterns!")
        return { success: 0, message: "Cannot find the selector: " + selectorID + " in the patterns!", stop: 1 }
    }
    let selectorName = Patterns[0].selector
    let found = 0

    for (var item in Patterns) {

        //console.log ('Patterns[item] : ', Patterns[item])
        myId = Patterns[item].patternID
        myPath = Patterns[item].path
        myTag = Patterns[item].tag
        myAttribute = Patterns[item].attribute
        myXpath = Patterns[item].result
        myWeight = Patterns[item].weight
        myXpath = myXpath.replace(/<PARAM>/g, myCriteria)
        myXpath = myXpath.replace(/<LENGTH>/g, myLength)
        variables.displayLog(1, 2, '**** PATTERN ' + myId + ' ******')

        // Add the position if necessary
        let mySearchXpath = myXpath;

        if (Right(myXpath, 3) == '[1]' && myPosition != undefined && myPosition != '') {
            if (myPosition.indexOf('$$') < 0) {
                if (Left(myPosition, 1) == '$') {
                    myPosition = variables.evaluateVariable(myPosition);
                }
            } else {
                myPosition = myPosition.replace('$$', 'last()');
            }
            mySearchXpath = myXpath.substring(0, myXpath.length - 3) + '[' + myPosition + ']';
            //console.log ('process position 1a: myXpath= ' + myXpath);
            variables.displayLog(1, 3, 'process position 1b: mySearchXpath ' + mySearchXpath);
        } else if (myPosition != undefined && myPosition != '') {
            if (myPosition.indexOf('$$') < 0) {
                if (Left(myPosition, 1) == '$') {
                    myPosition = variables.evaluateVariable(myPosition);
                }
            } else {
                myPosition = myPosition.replace('$$', 'last()');
            }
            mySearchXpath = '(' + myXpath + ')[' + myPosition + ']';
            //console.log ('process position 2a: myXpath= ' + myXpath);
            variables.displayLog(1, 3, 'process position 2b: mySearchXpath ' + mySearchXpath);
        }

        let mycustomXpath = mySearchXpath.replace(/&sol;/g, '/');
        //variables.displayLog(1, 3, 'detectGUI: xpath:' + mycustomXpath);

        // Call the getElement
        try {
            ret = await getElement(driver, variables, data, mycustomXpath, 0)
        }
        catch (err) {
            variables.displayLog(1, 1, 'detectGUI: Fatal error: Browser not responding!')
            return { success: 0, message: ret.message, stop: 99 }
        }


        //variables.displayLog(1, 3, 'getElementDummy ret: ', ret)
        if (!ret.success) {
            // Pattern not found, reset the score to 0
            variables.displayLog(1, 3, "No element detected for the pattern: " + myId);
            variables.displayLog(1, 3, 'xpath:' + mycustomXpath);
            PatternCandidate.push({ xPath: mySearchXpath, id: myId, score: 0 });
        } else {
            variables.displayLog(1, 3, "One Element detected for the pattern: " + myId);
            found = 1;
            // Compute the distance, the deepest, the farthest
            myDistance = await computeGUIDistanceV2(myPath);
            variables.displayLog(1, 3, 'myDistance: ' + myDistance + ', myPath: ' + myPath)

            try {

                let myIsEnabled = await ret.element.isEnabled();
                if (myIsEnabled == undefined) myIsEnabled = true;
                let myDisabled = await ret.element.getAttribute('disabled');
                if (myDisabled == undefined) myDisabled = '';
                let myClass = await ret.element.getAttribute('class');
                if (myClass == undefined) myClass = '';
                variables.displayLog(1, 4, " myIsEnabled: " + myIsEnabled + " myDisabled: " + myDisabled.toString() + " Class: " + myClass.toString().toLowerCase());

                if (myIsEnabled == false || myDisabled.toString() == 'true' || myClass.toString().toLowerCase().indexOf('disabled', 0) >= 0) {
                    variables.displayLog(1, 4, " Element is disabled - Pattern " + myId);
                    disabledField = 5
                } else {
                    disabledField = 0
                }

            } catch (err) {
                variables.displayLog(1, 1, '----- detectGUI error:' + err.message)
                return { success: 0, message: err.message, stop: 1 }
            }


            // Check the matching of the value
            myPosition = variables.evaluateVariable(myPosition);
            let exactMatch = await checkExactMatch(variables, ret, myCriteria);
            if (exactMatch) variables.displayLog(1, 2, "Pattern: " + myId + " perfect matching with a score of " + (myWeight - myDistance - !exactMatch - disabledField) + " points");
            else variables.displayLog(1, 2, "Pattern: " + myId + " not perfect matching with a score of " + (myWeight - myDistance - !exactMatch - disabledField) + " points");
            PatternCandidate.push({ xPath: mycustomXpath, id: myId, score: (myWeight - myDistance - !exactMatch - disabledField) });


        } // end element detected for the pattern
    } // end loop Patterns

    if (found == 1) {
        // sort the list of all the possible pattern candidates by score
        PatternCandidate.sort(function (a, b) {
            return b.score - a.score;
        });
        // display the list of all the possible pattern candidates
        for (var itemCandidate in PatternCandidate) {
            variables.displayLog(1, 2, ' Candidate pattern [' + PatternCandidate[itemCandidate].id + '] : Score: ' + PatternCandidate[itemCandidate].score);
        }

        // check that the winner has a score > 0
        if (PatternCandidate.length == 0 || PatternCandidate[0].score == 0) {
            variables.setVariable("$Error", "1");
            if (myWaitFor > 1) {
                variables.displayMsg("> ERROR - No way to detect a valid pattern for <" + selectorName + "> with the criteria <" + myCriteria + "> Position:" + myPosition + ' Waitfor: ' + myWaitFor + ") - Skipping all tests!");
                variables.setVariable("$exitTest", 1);
            } else {
                variables.displayMsg("> WARNING - No way to detect a valid pattern for <" + selectorName + "> with the criteria <" + myCriteria + "> Position:" + myPosition + ' Waitfor: ' + myWaitFor);
            }
            variables.setVariable("$GUI", "ERROR");
            found = 0;
            //throw new Error("No way to detect a valid pattern for <" + selectorName + "> with the criteria <" + myCriteria + ">");
            return { success: 0, message: "No way to detect a valid pattern for <" + selectorName + "> with the criteria <" + myCriteria + ">", stop: 0 }
        }
        // check for ex aequo
        if (PatternCandidate.length > 1) {
            if (PatternCandidate[0].score == PatternCandidate[1].score) {
                variables.setVariable("$Error", "1");
                if (myWaitFor > 1) {
                    variables.displayMsg("> ERROR - Ambiguous patterns detected: " + PatternCandidate[0].id + " and " + PatternCandidate[1].id + " for <" + selectorName + "> with the criteria <" + myCriteria + "> Position:" + myPosition + ' Waitfor: ' + myWaitFor + ") - Skipping all tests!");
                    variables.setVariable("$GUI", "ERROR");
                    return { success: 0, message: "Error! Ambiguous patterns detected for <" + selectorName + "> with the criteria <" + myCriteria + ">", stop: 1 }
                } else {
                    variables.displayMsg("> WARNING - Ambiguous patterns detected: " + PatternCandidate[0].id + " and " + PatternCandidate[1].id + " for <" + selectorName + "> with the criteria <" + myCriteria + "> Position:" + myPosition + ' Waitfor: ' + myWaitFor);
                }
                variables.setVariable("$GUI", "ERROR");
                found = 0;
                return { success: 0, message: "Warning! Ambiguous patterns detected for <" + selectorName + "> with the criteria <" + myCriteria + ">", stop: 0 }
            }
        }
        // Ok, we found a winner, write the xpath in the variable $GUI
        myResult = PatternCandidate[0].xPath.replace(/'/g, '&apos;');
        detectID = PatternCandidate[0].id
        variables.setVariable("$GUI", myResult);
        variables.setVariable("$Error", "0");
        variables.displayLog(1, 2, 'detectGUI (' + selectorName + ', ' + myCriteria + ', ' + myPosition + ', ' + myWaitFor + ') = OK - Pattern = ' + PatternCandidate[0].id + ' Score = ' + PatternCandidate[0].score);
        variables.displayLog(1, 2, ' detectedGUI: $GUI =' + myResult);
    } else {
        // Wait for timeout second(s)
        try {
            await driver.sleep(timeout); // Wait again for timeout seconds
        } catch (err) {
            return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
        }
    }

    //} // end loop myWaitFor

    if (found == 0) {
        // Timeout stop all the tests    
        if (myWaitFor > 1) {
            variables.displayMsg("> Timeout in detectGUI: (" + selectorName + ', ' + myCriteria + ', ' + myPosition + ', ' + myWaitFor + ") - Skipping all tests!");
            variables.setVariable("$exitTest", 1);
            variables.setVariable("$Error", "1");
            variables.setVariable("$GUI", "ERROR");
            // Element not found!
            return { success: 0, message: "Error! Detect GUI not ok", stop: 1 }

        } else {
            variables.displayMsg("> detectGUI: Warning: No way to detect: " + selectorName + ', ' + myCriteria + ', ' + myPosition + ', ' + myWaitFor + ")!");
            variables.setVariable("$Error", "1");
            variables.setVariable("$GUI", "ERROR");
            return { success: 0, message: "Warning! Detect GUI not ok", stop: 0 }
        }
    } else {
        variables.setVariable("$Error", "0");
        let cleanResult = myResult.replace(/&apos;/g, "'")
        return { success: 1, message: "Detect GUI ok", GUI: cleanResult, patternID: detectID, stop: 0 }
    }
}


/**
* ---------------------------------------------------------------------------- 
* @function <TBR>
*  checkExactMatch: Check attribute of the GUI Element
* 
* @param {object} variables:    array of all the variables
* @param {string} ret:          ret structure with the element information
* @param {string} myCriteria:   criteria to detect an element
*/

async function checkExactMatch(variables, ret, myCriteria) {

    // ---------------------------------------------------------------
    // Check on the value
    // ---------------------------------------------------------------
    let exactMatch = 0
    let myValue = await ret.element.getText();
    variables.displayLog(1, 3, "checkExactMatch - getText: " + myValue);
    if (myValue == '' || myValue == undefined) {
        myValue = await ret.element.getAttribute('value');
        variables.displayLog(1, 3, "checkExactMatch - value: " + myValue);
        if (myValue == '' || myValue == undefined) {
            myValue = await ret.element.getAttribute('placeholder');
            variables.displayLog(1, 3, "checkExactMatch - placeholder: " + myValue);
            if (myValue == '' || myValue == undefined) {
                variables.displayLog(1, 3, "checkExactMatch - Warning - no way to read the value, textvalue or placeholder!");
            }
        }
    }
    if (myValue != undefined) {
        myValue = myValue.trim();
        myCriteria = myCriteria.trim();
        if (myValue.length != myCriteria.length) {
            variables.displayLog(1, 3, "checkExactMatch - we don't have an exact match with the criteria! value: **" + myValue + "** versus criteria: **" + myCriteria + "**");
            exactMatch = 0;
        } else {
            variables.displayLog(1, 3, "checkExactMatch - Exact match with the criteria value");
            exactMatch = 1;
        }
    } else {
        variables.displayLog(1, 3, "checkExactMatch - text/value/placeholder is empty");
        exactMatch = 1;
    }
    return exactMatch
}



/**
* ---------------------------------------------------------------------------- 
* @function <TBR>
*  checkAttribute: Check attribute of the GUI Element
* 
* @param {object} driver:       selenium driver
* @param {object} variables:    array of all the variables
* @param {object} data:         all the parameters
* @param {string} myXpath:      Xpath of the pattern
* @param {string} myPosition:   global position of the element
* @param {string} myAttributes: attributes of the pattern
* @param {string} myCriteria:   criteria to detect an element
*/

async function checkAttribute(driver, variables, data, myXpath, myAttributes, myCriteria) {
    let exactCriteria = 1;
    myCriteria = myCriteria.replace('&sol;', '/');

    //console.log ('MyAttributes: ' + myAttributes)

    let PATHATTRIBUTE = myAttributes.split("/");
    myXpath = myXpath.replace('//', '<BEGIN>');
    let beginBracketFlag = 0;
    if (myXpath[0] == '(') {
        beginBracketFlag = 1;
        myXpath = myXpath.substring(1);
    }
    let XPATH = myXpath.split("/");
    //variables.displayLog(1, 1, " checkAttribute: " + myXpath);
    let mySubXpath = '';
    let myReturn = 1;
    for (var level in XPATH) {
        //console.log ('Level: ' + level);
        //variables.displayLog(1, 1, "checkAttribute: " + myXpath);

        if (myReturn == 1) {
            // await startPromises().then(async (result) => {
            if (level == 0) {  // in the case of the root
                mySubXpath = XPATH[level].replace('<BEGIN>', '//');
                mySubXpath = mySubXpath.replace(/&sol;/g, '/');
                if (level == XPATH.length - 1 && beginBracketFlag == 1) {  // 24/02/20222
                    mySubXpath = '(' + mySubXpath;
                }
                //variables.displayLog(1, 1, "Level: " + level + " - checkAttribute: " + mySubXpath);

                try {
                    ret = await getElement(driver, variables, data, mySubXpath, 0)
                }
                catch (err) {
                    variables.displayLog(1, 1, 'checkAttribute: Fatal error: Browser not responding!')
                    return { success: 0, message: ret.message, stop: 1 }
                }
                if (!ret.success) {
                    // Pattern not found, reset the score to 0
                    variables.displayLog(1, 3, " No element detected for the sub pattern of the level: " + level);
                    return 0
                } else {

                    // ---------------------------------------------------------------
                    // Check on the value
                    // ---------------------------------------------------------------
                    myValue = await ret.element.getText();
                    variables.displayLog(1, 3, "checkAttribute - getText: " + myValue);
                    if (myValue == '' || myValue == undefined) {
                        myValue = await ret.element.getAttribute('value');
                        variables.displayLog(1, 3, "checkAttribute - value: " + myValue);
                        if (myValue == '' || myValue == undefined) {
                            myValue = await ret.element.getAttribute('placeholder');
                            variables.displayLog(1, 3, "checkAttribute - placeholder: " + myValue);
                            if (myValue == '' || myValue == undefined) {
                                variables.displayLog(1, 3, "checkAttribute - Warning - no way to read the value, textvalue or placeholder!");
                            }
                        }
                    }
                    if (myValue != undefined) {
                        myValue = myValue.trim();
                        myCriteria = myCriteria.trim();
                        if (myValue.length != myCriteria.length) {
                            variables.displayLog(1, 3, "checkAttribute - we don't have an exact match with the criteria! value: **" + myValue + "** versus criteria: **" + myCriteria + "**");
                            exactCriteria = 0;
                        } else {
                            variables.displayLog(1, 3, "checkAttribute - Exact match with the criteria value");
                            exactCriteria = 1;
                        }
                    } else {
                        variables.displayLog(1, 3, "checkAttribute - text/value/placeholder is empty");
                        exactCriteria = 1;
                    }

                    // ---------------------------------------------------------------
                    // Check on the other attribute
                    // ---------------------------------------------------------------

                    let ATTRIBUTE = PATHATTRIBUTE[level].split("@");
                    for (var attributeId in ATTRIBUTE) {
                        if (attributeId > 0) { // Skip the Tag
                            let ATTRIBUTEVALUE = ATTRIBUTE[attributeId].split("=");
                            let value = '';
                            if (ATTRIBUTEVALUE[0] == 'display') {
                                value = await ret.element.isDisplayed();
                            } else if (ATTRIBUTEVALUE[0] == 'visible') {
                                value = ATTRIBUTEVALUE[1]; // function isVisible does not exist - display is enough
                            } else {
                                value = await ret.element.getAttribute(ATTRIBUTEVALUE[0]);
                            }
                            if (ATTRIBUTEVALUE[1].toString().length >= value.toString().length) {
                                if (ATTRIBUTEVALUE[1].toString().toUpperCase().indexOf(value.toString().toUpperCase(), 0) < 0) {
                                    variables.displayLog(1, 3, " Attribute KO(1): " + ATTRIBUTEVALUE[0] + ' for the subpath: (' + level + ') ' + ' is not matching value: Expected = ' + ATTRIBUTEVALUE[1] + ' Got: ' + value);
                                    return 0;
                                } else {
                                    variables.displayLog(1, 3, " Attribute OK(1): " + ATTRIBUTEVALUE[0] + ' for the subpath: (' + level + ') ' + ' is matching the value: ' + value);
                                }
                            } else { // we can use partial criteria like class='ux-dropdown-button-item mat-menu-item ng-star-inserted' simplify to class='ux-dropdown-button-item' (manual operation during the training)
                                if (value.toString().toUpperCase().indexOf(ATTRIBUTEVALUE[1].toString().toUpperCase(), 0) < 0) {
                                    variables.displayLog(1, 3, " Attribute KO(2): " + ATTRIBUTEVALUE[0] + ' for the subpath: (' + level + ') ' + ' is not matching value: Expected = ' + ATTRIBUTEVALUE[1] + ' Got: ' + value);
                                    return 0;
                                } else {
                                    variables.displayLog(1, 3, " Attribute OK(2): " + ATTRIBUTEVALUE[0] + ' for the subpath: (' + level + ') ' + ' is matching the value: ' + value);
                                }
                            }
                        }
                    }
                    myReturn = 1

                }
            } else { // for all the other subparts of the xpath
                mySubXpath = mySubXpath + '/' + XPATH[level];
                // for the last level, add the global position
                if (level == XPATH.length - 1 && beginBracketFlag == 1) {  // 24/02/20222
                    mySubXpath = '(' + mySubXpath;
                }
                mySubXpath = mySubXpath.replace(/&sol;/g, '/');
                variables.displayLog(1, 3, "Level: " + level + " - checkAttribute: " + mySubXpath);

                try {
                    ret = await getElement(driver, variables, data, mySubXpath, 0)
                }
                catch (err) {
                    variables.displayLog(1, 1, 'checkAttribute: Fatal error: Browser not responding!')
                    return { success: 0, message: ret.message, stop: 1 }
                }
                if (!ret.success) {
                    // Pattern not found, reset the score to 0
                    variables.displayLog(1, 3, " No element detected for the sub pattern: " + mySubXpath);
                    return 0
                } else {

                    let ATTRIBUTE = PATHATTRIBUTE[level].split("@");
                    for (var attributeId in ATTRIBUTE) {
                        if (attributeId > 0) { // Skip the Tag
                            let ATTRIBUTEVALUE = ATTRIBUTE[attributeId].split("=");
                            let value = '';
                            if (ATTRIBUTEVALUE[0] == 'display') {
                                value = await ret.element.isDisplayed();
                            } else if (ATTRIBUTEVALUE[0] == 'visible') {
                                value = ATTRIBUTEVALUE[1]; // function isVisible does not exist - display is enough
                            } else {
                                value = await ret.element.getAttribute(ATTRIBUTEVALUE[0]);
                            }
                            if (value == undefined) value = ''
                            if (ATTRIBUTEVALUE[1].toString().length >= value.toString().length) {
                                if (ATTRIBUTEVALUE[1].toString().toUpperCase().indexOf(value.toString().toUpperCase(), 0) < 0) {
                                    variables.displayLog(1, 3, " Attribute KO 1: " + ATTRIBUTEVALUE[0] + ' for the subpath: (' + level + ') ' + ' is not matching value: Expected = ' + ATTRIBUTEVALUE[1] + ' Got: ' + value);
                                    return 0;
                                } else {
                                    variables.displayLog(1, 3, " Attribute OK 1: " + ATTRIBUTEVALUE[0] + ' for the subpath: (' + level + ') ' + ' is matching the value: ' + value);
                                }
                            } else { // we can use partial criteria like class='ux-dropdown-button-item mat-menu-item ng-star-inserted' simplify to class='ux-dropdown-button-item' (manual operation during the training)
                                if (value.toString().toUpperCase().indexOf(ATTRIBUTEVALUE[1].toString().toUpperCase(), 0) < 0) {
                                    variables.displayLog(1, 3, " Attribute KO 2: " + ATTRIBUTEVALUE[0] + ' for the subpath: (' + level + ') ' + ' is not matching value: Expected = ' + ATTRIBUTEVALUE[1] + ' Got: ' + value);
                                    return 0;
                                } else {
                                    variables.displayLog(1, 3, " Attribute OK 2: " + ATTRIBUTEVALUE[0] + ' for the subpath: (' + level + ') ' + ' is matching the value: ' + value);
                                }
                            }
                        }
                    }
                    myReturn = 1
                }
            }
        } else {
            variables.displayLog(1, 3, " previous attributes not matching, skip the loop!");
            return 0
        }
    } // end of the loop

    if (myReturn == 1 && exactCriteria == 0) {
        myReturn = 100;
    }
    return myReturn;
}



/**
 * ---------------------------------------------------------------------------- 
 * @function <OK>
 *  Private startPromises: function to start a promise
 *
 * @param  resolve: 
 * @param  reject: 
 */
function startPromises() {
    return new Promise((resolve, reject) => {
        return resolve();
    });
}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   url: get a webpage
*
* @param {object} page:         playwright page
* @param {object} variables:    array of all the variables
* @param {number} projectID:    project ID
* @param {string} link:         link to the wepage
*
*/
async function url(page, variables, projectID, link) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");
    let ret

    // evaluate the link
    link = variables.evaluateVariable(link)
    if (link.length > 0) {
        link = link.replace(/'/g, "");
    }

    // Search the text in the dictionary 
    if (link[0] == '@') {
        const dataAPI = { projectID: projectID, code: link, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            link = result[0].label
            //console.log (link)
        } else {
            variables.displayLog(1, 1, 'Data not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + link + " in the dictionary!", stop: 1 }
        }
    }

    try {
        //variables.displayLog(1, 1, 'Driver: ', driver)
        await page.goto(link)
        return { success: 1, message: 'Url OK', stop: 0 }
    } catch (err) {
        variables.displayLog(1, 1, "----- **** URL = Error: ", err.message)
        variables.displayLog(1, 1, err.message)
        return { success: 0, message: err.message, stop: 1 }
    }
}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*  getUrl:  Get the current URL and store it into the variable $currentURL
* 
* @param {object} page:         playwright page
* @param {object} variables:    array of all the variables
* @param {string} myVariable:   name of the variable  
*
*/
async function getUrl(page, variables, myVariable) {
    console.log('getUrl...................')
    const { Left } = require("./string.library.js")

    try {
        console.log('getURL......')
        const url = await page.url();
        //  check if the URL contains http
        if (Left(url, 4) == 'http') {
            variables.setVariable(myVariable, url)
        } else {
            variables.setVariable(myVariable, 'N/A')
        }
        return { success: 1, message: "getUrl Ok!", value: url, stop: 0 }
    } catch (err) {
        return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
    }

}

/**
* ---------------------------------------------------------------------------- 
* @function <TBR>
*  newTab:  Open a new tab and switch to it 
* 
* @param {object} page:       playwright page
*
*/
async function newTab(page) {

    // This function is not yet implemented due to the complexity
    //
    // To create a new tab, we need to code the following lines:
    // const context = await browser.newContext(); // Create a new context to manage the new tab
    // const page = await context.newPage();    // Create a new page (tab) within that context    
    // 
    // the implementation should be done in the browser.library.js
    // However, for the time being the page is declared only in the robot.service.js
    // so we need to find a way to replace the value of the page at this level... not so simple!!!!


    return { success: 0, message: 'newTab Error: Function not yet implemented!', stop: 1 }


}


/**
* ---------------------------------------------------------------------------- 
* @function <TBR>
*  newWindow:  Open a new window and switch to it 
* 
* @param {object} driver:       selenium driver
*
*/
async function newWindow(driver) {


    // This function is not yet implemented due to the complexity
    //
    // To create a new window, we need to code the following lines:
    // const newPage = await context.newPage(); // Use context.newPage() to create a new page
    // await newPage.bringToFront(); // Optional: Bring the new page to the front (similar to switching focus)
    // 
    // the implementation should be done in the browser.library.js
    // However, for the time being the page is declared only in the robot.service.js
    // so we need to find a way to replace the value of the page at this level... not so simple!!!!


    return { success: 0, message: 'newWindow Error: Function not yet implemented!', stop: 1 }

}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   loginUser: Key the dummy user in the login
*
* @param {object} page:         playwright page
* @param {object} variables:    array of all the variables
* @param {object} data:         all the parameters
* @param {string} dummyUser:    user in the dummy user database
* @param {string} tagUser:      tag of the user field
* @param {string} tagSubmit:    tag of the submit
*
*/
async function loginUser(page, variables, data, dummyUser, tagUser, tagSubmit) {
    const { getDummyuserByUser } = require("../../dummyuser/dummyuser.service.js");
    let ret
    let user = ''
    let delay = 0

    variables.displayLog(1, 2, 'Dummy user: ' + dummyUser)


    // Evaluate the dummyUser
    if (dummyUser == undefined) {
        return { success: 0, message: "LoginUser: dummyUser cannot be empty!", stop: 1 }
    } else {
        dummyUser = variables.evaluateVariable(dummyUser)
        if (dummyUser.length > 0) {
            dummyUser = dummyUser.replace(/'/g, "");
        }
    }

    if (dummyUser == '<ME>') {
        dummyUser = data.userName
        variables.displayLog(1, 3, 'ME Dummy user: ' + dummyUser)
    }

    variables.displayLog(1, 1, '***** Dummy user: ' + dummyUser)

    // get the active dummy user data
    const dataAPI = { projectID: data.projectID, dummy: dummyUser, active: 1 }
    const result = await getDummyuserByUser(dataAPI);
    if (result.length) {
        user = result[0].user
    } else {
        variables.displayLog(1, 1, '>>>>> Data not found in the dummy users!')
        return { success: 0, message: "Cannot find the user: " + dummyUser + " in the dummy users!", stop: 1 }
    }

    // Enter the user in the field
    try {
        ret = await setValue(page, data, variables, tagUser, user)

        if (!ret.success) {
            variables.displayLog(1, 1, '>>>>> Error during the setValue!')
            return { success: 0, message: "Cannot key a value in the function loginUser!", stop: 1 }
        }

        // Submit the login ( if necessary )
        if (tagSubmit != undefined && tagSubmit != '<N/A>') {
            ret = await click(page, data, variables, tagSubmit, delay)
        } else {
            return { success: 1, message: "No need to submit the login User", stop: 0 }
        }
    }
    catch (err) {
        variables.displayLog(1, 1, 'loginUser: Fatal error: Browser not responding!')
        return { success: 0, message: 'loginUser: Fatal error: Browser not responding!', stop: 1 }
    }


}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   loginPassword: Key the dummy user password
*
* @param {object} page:         playwright page
* @param {object} variables:    array of all the variables
* @param {object} data:         all the parameters
* @param {string} dummyUser:    user in the dummy user database
* @param {string} tagPassword:  tag of the password field
* @param {string} tagSubmit:    tag of the submit
*
*/
async function loginPassword(page, variables, data, dummyUser, tagPassword, tagSubmit) {
    const { getDummyuserByUser } = require("../../dummyuser/dummyuser.service.js");
    const { decryptPassword } = require("./password.library.js")

    // Enter the password in the field
    try {

        let ret
        let password = ''
        let delay = 0

        // Evaluate the dummyUser
        if (dummyUser == undefined) {
            return { success: 0, message: "LoginUser: dummyUser cannot be empty!", stop: 1 }
        } else {
            dummyUser = variables.evaluateVariable(dummyUser)
            if (dummyUser.length > 0) {
                dummyUser = dummyUser.replace(/'/g, "");
            }
        }

        if (dummyUser == '<ME>') {
            dummyUser = data.userName
            variables.displayLog(1, 3, 'ME Dummy user: ' + dummyUser)
        }
        //console.log ('***** Dummy user: ' +  dummyUser)


        // get the active dummy user data
        const dataAPI = { projectID: data.projectID, dummy: dummyUser, active: 1 }
        const result = await getDummyuserByUser(dataAPI);
        if (result.length) {
            password = result[0].password
        } else {
            variables.displayLog(1, 1, '>>>>> Data not found in the dummy users!')
            return { success: 0, message: "Cannot find the user: " + dummyUser + " in the dummy users!", stop: 1 }
        }

        // Decrypt the password
        if (result[0].crypted) {
            ret = await decryptPassword(password)
            if (ret.success) {
                password = ret.password
            } else {
                return { success: 0, message: "Cannot decrypt the password!", stop: 1 }
            }
        }


        ret = await setValue(page, data, variables, tagPassword, password)
        if (!ret.success) {
            variables.displayLog(1, 1, '>>>>> Error during the setValue!')
            return { success: 0, message: "Cannot key a value in the function loginPassword!", stop: 99 }
        }
        // Submit the password (if necessary)
        if (tagSubmit != undefined && tagSubmit != '<N/A>') {
            ret = await click(page, data, variables, tagSubmit, delay)
        } else {
            return { success: 1, message: "No need to submit the login User", stop: 0 }
        }
        return ret

    }
    catch (err) {
        variables.displayLog(1, 1, 'loginPassword: Fatal error: Browser not responding!')
        return { success: 0, message: 'loginPassword: Fatal error: Browser not responding!', stop: 1 }
    }

}

/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   dummyLogin: Get the login of a dummy user
*
* @param {object} page:         playwright page
* @param {object} variables:    array of all the variables
* @param {object} data:         all the parameters
* @param {string} dummyUser:    user in the dummy user database (or <ME> for the connected user)
* @param {string} variable:     name of the variable to store the extra information
*
*/
async function dummyLogin(page, variables, data, dummyUser, variable) {
    const { getDummyuserByUser } = require("../../dummyuser/dummyuser.service.js");
    let ret
    let dummyLogin = ''

    //console.log('Data: ', data)
    // Evaluate the dummyUser
    if (dummyUser == undefined) {
        return { success: 0, message: "dummyUser: dummyUser cannot be empty!", stop: 1 }
    } else {
        dummyUser = variables.evaluateVariable(dummyUser)
        if (dummyUser.length > 0) {
            dummyUser = dummyUser.replace(/'/g, "");
        }
    }

    if (dummyUser == '<ME>') {
        dummyUser = data.userName
        variables.displayLog(1, 3, 'ME Dummy user: ' + dummyUser)
    }

    variables.displayLog(1, 2, 'Dummy user: ' + dummyUser)

    // get the active dummy user data
    const dataAPI = { projectID: data.projectID, dummy: dummyUser, active: 1 }
    const result = await getDummyuserByUser(dataAPI);
    if (result.length) {
        //console.log('Result: ', result)
        dummyLogin = result[0].user
        if (dummyLogin == undefined || dummyLogin == '') dummyLogin = '<N/A>'
        variables.displayLog(1, 2, 'Login: ' + dummyLogin)
        // store the value into the variable
        variables.setVariable(variable, dummyLogin)
        return { success: 1, message: "dummyLogin OK", value: dummyLogin, stop: 0 }

    } else {
        variables.displayLog(1, 1, '>>>>> Data not found in the dummy users!')
        return { success: 0, message: "Cannot find the user: " + dummyUser + " in the dummy users!", value: 'ERROR', stop: 1 }
    }
}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   dummyExtraInfo: Get the extra information of a dummy user
*
* @param {object} page:         playwright page
* @param {object} variables:    array of all the variables
* @param {object} data:         all the parameters
* @param {string} dummyUser:    user in the dummy user database (or <ME> for the connected user)
* @param {string} variable:     name of the variable to store the extra information
*
*/
async function dummyExtraInfo(page, variables, data, dummyUser, variable) {
    const { getDummyuserByUser } = require("../../dummyuser/dummyuser.service.js");
    let ret
    let extraInfo = ''

    //console.log('Data: ', data)
    // Evaluate the dummyUser
    if (dummyUser == undefined) {
        return { success: 0, message: "dummyExtraInfo: dummyUser cannot be empty!", stop: 1 }
    } else {
        dummyUser = variables.evaluateVariable(dummyUser)
        if (dummyUser.length > 0) {
            dummyUser = dummyUser.replace(/'/g, "");
        }
    }

    if (dummyUser == '<ME>') {
        dummyUser = data.userName
        variables.displayLog(1, 3, 'ME Dummy user: ' + dummyUser)
    }

    variables.displayLog(1, 2, 'Dummy user: ' + dummyUser)

    // get the active dummy user data
    const dataAPI = { projectID: data.projectID, dummy: dummyUser, active: 1 }
    const result = await getDummyuserByUser(dataAPI);
    if (result.length) {
        extraInfo = result[0].extraInfo
        if (extraInfo == undefined || extraInfo == '') extraInfo = '<N/A>'
        variables.displayLog(1, 2, 'Extra information: ' + extraInfo)
        // store the value into the variable
        variables.setVariable(variable, extraInfo)
        return { success: 1, message: "dummyExtraInfo OK", value: extraInfo, stop: 0 }

    } else {
        variables.displayLog(1, 1, '>>>>> Data not found in the dummy users!')
        return { success: 0, message: "Cannot find the user: " + dummyUser + " in the dummy users!", value: 'ERROR', stop: 1 }
    }
}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   pause: wait for a few seconds
*
* @param {object} page:             playwright page
* @param {object} variables:        array of all the variables
* @param {number} subprojectID:     subprojectID
* @param {string} delay:            delay in seconds
*
*/
async function pause(page, variables, subprojectID, delay) {
    const { getDatasetByCode } = require("../../dataset/dataset.service.js");
    let ret

    if (delay == undefined) delay = 1
    else if (isNaN(delay)) {
        // Search the text in the dataset 
        if (delay[0] == '#') {
            delay = variables.evaluateVariable(delay)
            delay = delay.replace(/'/g, "");
            const dataAPI = { subprojectID: subprojectID, code: delay, language: '*', active: 1 }
            const result = await getDatasetByCode(dataAPI);
            if (result.length) {
                delay = result[0].label
            } else {
                variables.displayLog(1, 1, 'Data not found in the dataset!')
                return { success: 0, message: "Cannot find the code: " + delay + " in the dataset!", stop: 1 }
            }
        }
    }

    try {
        await page.waitForTimeout(delay * 1000);
        ret = { success: 1, message: 'Pause OK', stop: 0 }
        return ret
    } catch (err) {
        return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
    }
}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   waitFor: check if an element is available
*
* @param {object} page:         playwright page
* @param {object} variables:    array of all the variables
* @param {object} data:         all the parameters
* @param {number} tagElement:   tag of the element to be checked
* @param {number} delay:        delay in seconds
* @param {number} action:       action in case element is not found: continue (0) or stop all the tests (1) or skip the It (2)
*
*/
async function waitFor(page, data, variables, tagElement, delay, action) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");
    const { getReferenceByCode } = require("../../reference/reference.service.js");
    let timeout = 30 // 30 seconds by default


    // Check if the tag is not on the dictionary
    if (tagElement[0] == '@') {
        const dataAPI = { projectID: data.projectID, code: tagElement, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tagElement = result[0].label
        } else {
            variables.displayLog(1, 1, 'Data: ' + tagElement + ' not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tagElement + " in the dictionary!", stop: 1 }
        }
    }


    try {
        // Get the timeout (if any)
        const dataAPI = { projectID: data.projectID, userID: data.userID, code: 'TimeOut' }
        const reference = await getReferenceByCode(dataAPI);
        if (reference.length) {
            if (reference[0].label != '<N/A>') {
                timeout = reference[0].label * 1
            }
        }
        console.log('Original TimeOut: ' + timeout)


        if (delay == undefined) delay = 10    // delay = number of second(s) to wait for the element

        page.setDefaultTimeout(delay * 1000);
        await page.locator(tagElement).first().waitFor()
        page.setDefaultTimeout(timeout * 1000) // Back to the original timeout

        return { success: 1, message: "waitFor OK", stop: 0 }
    }
    catch (err) {
        page.setDefaultTimeout(timeout * 1000) // Back to the original timeout
        console.log('waitFor error............')
        variables.setVariable('$Error', "1")
        if (action == undefined) action = 0
        // action: 0 = continue, 1 = stop all the tests, 2 = skip the It

        let ret = { success: 0, message: 'WaitFor KO', stop: 0 }
        if (action == 1) {
            ret.stop = 1
            ret.message = 'WaitFor KO after ' + delay + ' sec. --> Stop the tests'
        }
        else if (action == 0) {
            ret.success = 1
            ret.message = 'WaitFor KO after ' + delay + ' sec. --> Continue'
        }
        else {
            ret.success = 0
            ret.message = 'WaitFor KO after ' + delay + ' sec. --> Skip IT'
        }
        return ret
    }

}



/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   waitForNot: check if an element is not available
*
* @param {object} page:         playwright page
* @param {object} data:         all the parameters
* @param {number} tagElement:   tag of the element to be checked
* @param {number} delay:        delay in seconds
* @param {number} action:       action in case element is still available: continue (0) or stop all the tests (1) or skip the It (2)
*
*/
async function waitForNot(page, data, variables, tagElement, delay, action) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");
    const { getReferenceByCode } = require("../../reference/reference.service.js");
    let timeout = 30 // 30 seconds by default


    // Check if the tag is not on the dictionary
    if (tagElement[0] == '@') {
        const dataAPI = { projectID: data.projectID, code: tagElement, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tagElement = result[0].label
        } else {
            variables.displayLog(1, 1, 'Data: ' + tagElement + ' not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tagElement + " in the dictionary!", stop: 1 }
        }
    }


    try {
        // Get the timeout (if any)
        const dataAPI = { projectID: data.projectID, userID: data.userID, code: 'TimeOut' }
        const reference = await getReferenceByCode(dataAPI);
        if (reference.length) {
            if (reference[0].label != '<N/A>') {
                timeout = reference[0].label * 1
            }
        }
        console.log('Original TimeOut: ' + timeout)


        if (delay == undefined) delay = 10   // delay = number of second(s) to wait for the element
        delay = delay * 1000
        page.setDefaultTimeout(delay);

        const locator = page.locator(tagElement).first()
        await locator.waitFor({ state: 'detached', delay }); // or 'hidden'        

        page.setDefaultTimeout(timeout * 1000) // Back to the original timeout
        return { success: 1, message: "waitForNot OK", stop: 0 }
    }
    catch (err) {
        page.setDefaultTimeout(timeout * 1000) // Back to the original timeout
        console.log('waitForNot error', err.message)
        variables.setVariable('$Error', "1")
        if (action == undefined) action = 0
        // action: 0 = continue, 1 = stop all the tests, 2 = skip the It

        let ret = { success: 0, message: 'WaitForNot KO', stop: 0 }
        if (action == 1) {
            ret.stop = 1
            ret.message = 'WaitForNot KO after ' + delay + ' sec. --> Stop the tests'
        }
        else if (action == 0) {
            ret.success = 1
            ret.message = 'WaitForNot KO after ' + delay + ' sec. --> Continue'
        }
        else {
            ret.success = 0
            ret.message = 'WaitForNot KO after ' + delay + ' sec. --> Skip IT'
        }
        return ret
    }

}




/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   skipIt: Skip the It section if the expression is true
*
* @param {object} variables:    array of all the variables
* @param {string} expression:   JavaScript expression must return true or false
* @param {string} message:      Message to be displayed in the log if expression is true
*
*/
async function skipIt(variables, expression, message) {
    let ret = { success: 1, message: 'SkipIt', stop: 0 }
    let originalExpression = expression

    variables.displayLog(1, 1, '----- skipIt ----')

    // Evaluate the message
    if (message == undefined) {
        message = '';
    } else {
        message = variables.evaluateVariable(message)
    }
    variables.displayLog(1, 1, 'Message: ' + message)

    // Evaluate the expression
    expression = variables.evaluateVariable(expression)
    variables.displayLog(1, 1, 'Expression: ' + expression)

    try {
        let result = eval(expression);
        variables.displayLog(1, 1, 'Result: ' + result)
        if (result) {
            ret = { success: 1, message: 'SkipIt: ' + message + ' : ' + originalExpression + ' --> (' + expression + ')', stop: 1 }
        }
    }
    catch (err) {
        return { success: 0, message: 'SkipIt eval error: ' + err.message, stop: 0 }
    }

    //variables.displayLog(1, 1,ret)
    return ret
}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   skipDescribe: Skip the Describe section if the expression is true
*
* @param {object} variables:    array of all the variables
* @param {string} expression:   JavaScript expression must return true or false
* @param {string} message:      Message to be displayed in the log if expression is true
*
*/
async function skipDescribe(variables, expression, message) {
    let ret = { success: 1, message: 'skipDescribe', stop: 0 }
    let originalExpression = expression


    variables.displayLog(1, 1, '----- Describe ----')

    // Evaluate the message
    if (message == undefined) {
        message = ''
    } else {
        message = variables.evaluateVariable(message)
    }
    variables.displayLog(1, 1, 'Message: ' + message)

    // Evaluate the expression
    expression = variables.evaluateVariable(expression)
    variables.displayLog(1, 1, 'Expression: ' + expression)

    try {
        let result = eval(expression)
        variables.displayLog(1, 1, 'Result: ' + result)
        if (result) {
            ret = { success: 1, message: 'skipDescribe: ' + message + ' : ' + originalExpression + ' --> (' + expression + ')', stop: 2 }
        }
    }
    catch (err) {
        return { success: 0, message: 'skipDescribe eval error: ' + err.message, stop: 0 }
    }

    //variables.displayLog(1, 1,ret)
    return ret
}




/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   setValue: key a value in a field
*
* @param {object} page:            playwright page
* @param {object} data:            all the parameters
* @param {object} variables:       array of all the variables
* @param {string} tag:             tag to the element
* @param {string} value:           value to key in the field
* @param {string} delay:           time in second(s) before the <TAB> or the <ENTER> or after keying the value
*
*/
async function setValue(page, data, variables, tag, value, delay) {
    const { getDatasetByCode } = require("../../dataset/dataset.service.js");
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");


    try {

        let ret

        if (delay == undefined) delay = 0
        else delay = delay * 1000


        // Evaluate the value
        if (value == undefined) {
            value = ''
        } else {
            value = variables.evaluateVariable(value)
            value = value.replace(/'/g, "");
        }

        // Evaluate special keywords like <TODAY>, <TODAY+1>.... (if any)
        value = variables.dataValue(value)

        value = variables.evaluateVariable(value)
        value = value.replace(/'/g, "");


        let clearFlag = 0
        let enterFlag = 0
        let tabFlag = 0

        // check if <CLEAR> or <CLEAN> is used
        if (value.indexOf('<CLEAR>', 0) >= 0 || value.indexOf('<CLEAN>', 0) >= 0) {
            clearFlag = 1
            value = value.replace('<CLEAR>', '')
            value = value.replace('<CLEAN>', '')
        }

        if (value.indexOf('<ENTER>', 0) >= 0) {
            enterFlag = 1
            value = value.replace('<ENTER>', '')
        } else if (value.indexOf('<TAB>', 0) >= 0) {
            tabFlag = 1
            value = value.replace('<TAB>', '')
        }

        value = value.trim()

        // Evaluate the dataset (if any)
        if (value[0] == '#') {
            const dataAPI = { subprojectID: data.subprojectID, code: value, language: '*', active: 1 }
            const result = await getDatasetByCode(dataAPI);
            if (result.length) {
                value = result[0].label
                // Evaluate special keywords like <TODAY>, <TODAY+1>.... (if any)
                value = variables.dataValue(value)
                value = variables.evaluateVariable(value)
                value = value.replace(/'/g, "");
            } else {
                variables.displayLog(1, 1, 'Data not found in the dataset! - value: ' + value)
                return { success: 0, message: "Cannot find the code: " + value + " in the dataset!", stop: 1 }
            }
        }

        // Skip the function if the value is <N/A> or <EMPTY>
        if (value.indexOf('<N/A>', 0) >= 0 || value.indexOf('<EMPTY>', 0) >= 0) {
            ret = { success: 1, message: 'setValue OK', value: value + ' (Skipped!)', stop: 0 }
            return ret
        }

        if (clearFlag == 1) value = value + '<CLEAR>'
        if (enterFlag == 1) value = value + '<ENTER>'
        if (tabFlag == 1) value = value + '<TAB>'


        if (tag == undefined) {
            return { success: 0, message: "setValue: tag cannot be empty!", stop: 1 }
        } else if (tag[0] == '@') {
            // Search the tag in the dictionary
            const dataAPI = { projectID: data.projectID, code: tag, language: '*', active: 1 }
            const result = await getDictionaryByCode(dataAPI);
            if (result.length) {
                tag = result[0].label
                //console.log (link)
            } else {
                variables.displayLog(1, 1, 'Data not found in the dictionary!')
                return { success: 0, message: "Cannot find the code: " + tag + " in the dictionary!", stop: 1 }
            }
        }

        tag = variables.evaluateVariable(tag)

        // Special clear when the normal function doesn't work!
        if (value.indexOf('<CLEAR>', 0) >= 0 || value.indexOf('<CLEAN>', 0) >= 0) {
            value = value.replace('<CLEAR>', '')
            value = value.replace('<CLEAN>', '')
            variables.displayLog(1, 1, '---- Clear field')
            await page.keyboard.down('Control'); // Press and hold Control key
            await page.keyboard.press('a');       // Press 'a' key
            await page.keyboard.up('Control');   // Release Control key
            await page.keyboard.press('Backspace'); // Press Backspace key
        }
        if (value.indexOf('<ENTER>', 0) >= 0) {
            value = value.replace('<ENTER>', '')
            await page.locator(tag).fill(value)
            variables.displayLog(1, 1, '----' + value.trim() + '(' + value.trim().length + ')---- Press Enter')
            if (delay != undefined && delay > 0) await page.waitForTimeout(delay * 1000);
            await page.keyboard.sendCharacter('\r'); // ASCI 10
            await page.keyboard.sendCharacter('\n'); // ASCI 13"
        } else if (value.indexOf('<TAB>', 0) >= 0) {
            value = value.replace('<TAB>', '')
            await page.locator(tag).fill(value)
            if (delay != undefined && delay > 0) await page.waitForTimeout(delay * 1000);
            await page.keyboard.sendCharacter('\t'); // ASCI 9
        } else {
            await page.locator(tag).fill(value)
            if (delay != undefined && delay > 0) await page.waitForTimeout(delay * 1000);
        }
        ret = { success: 1, message: 'setValue OK', value: value, stop: 0 }
        return ret

    } catch (err) {
        //console.log('debug: setValue catch')
        variables.displayLog(1, 1, "Tag: " + tag)
        variables.displayLog(1, 1, err.message)
        ret = { success: 0, message: err.message, stop: 1 }
        return ret
    }
}



/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   getValue: key a value in a field
*
* @param {object} page:            playwright page
* @param {object} data:            all the parameters
* @param {object} variables:       array of all the variables
* @param {string} tag:             tag to the element
* @param {string} variableName:    Name of the result to store the value
*
*/
async function getValue(page, data, variables, tag, variableName) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");
    let ret

    if (tag == undefined) {
        return { success: 0, message: "getValue: tag cannot be empty!", stop: 1 }
    } else if (tag[0] == '@') {
        // Search the tag in the dictionary
        const dataAPI = { projectID: data.projectID, code: tag, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tag = result[0].label
            //console.log (link)
        } else {
            variables.displayLog(1, 2, 'Data not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tag + " in the dictionary!", stop: 1 }
        }
    }
    tag = variables.evaluateVariable(tag)

    // Get the element for the tag
    try {
        let text = await page.locator(tag).textContent()
        variables.setVariable(variableName, text)
        variables.displayLog(1, 1, 'getValue: ' + text)
        return { success: 1, message: 'getValue OK', value: text, stop: 0 }
    }
    catch (err) {
        variables.displayLog(1, 1, 'getValue: Fatal error: Browser not responding!')
        return { success: 0, message: err.message, stop: 1 }
    }

}

/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   select: select a value from a list of options
*
* @param {object} page:         playwright page
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {string} tag:          tag element
* @param {string} value:        value to select in the list
* @param {number} delay:        delay after the click (in seconds)
*
*/
async function select(page, data, variables, tag, value, delay) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");

    let ret

    // Evaluate the value
    if (value == undefined) {
        value = ''
    } else {
        value = variables.evaluateVariable(value)
        value = value.replace(/'/g, "");
    }

    // Evaluate special keywords like <TODAY>, <TODAY+1>.... (if any)
    value = variables.dataValue(value)
    value = variables.evaluateVariable(value)
    value = value.replace(/'/g, "");
    value = value.trim()

    // Evaluate the dataset (if any)
    if (value[0] == '#') {
        const dataAPI = { subprojectID: data.subprojectID, code: value, language: '*', active: 1 }
        const result = await getDatasetByCode(dataAPI);
        if (result.length) {
            value = result[0].label
            // Evaluate special keywords like <TODAY>, <TODAY+1>.... (if any)
            value = variables.dataValue(value)
            value = variables.evaluateVariable(value)
            value = value.replace(/'/g, "");
        } else {
            variables.displayLog(1, 1, 'Data not found in the dataset! - value: ' + value)
            return { success: 0, message: "Cannot find the code: " + value + " in the dataset!", stop: 1 }
        }
    }

    // Skip the function if the value is <N/A> or <EMPTY>
    if (value.indexOf('<N/A>', 0) >= 0 || value.indexOf('<EMPTY>', 0) >= 0) {
        ret = { success: 1, message: 'Select OK', value: value + ' (Skipped!)', stop: 0 }
        return ret
    }

    if (tag == undefined) {
        console.log("select: tag cannot be empty!")
        return { success: 0, message: "select: tag cannot be empty!", stop: 1 }
    } else if (tag[0] == '@') {
        //console.log('In the dictionary.........', data.projectID)
        // Search the tag in the dictionary
        const dataAPI = { projectID: data.projectID, code: tag, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tag = result[0].label
            //console.log("Find the code: " + tag)
        } else {
            console.log("Cannot find the code: " + tag)
            variables.displayLog(1, 1, 'Data not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tag + " in the dictionary!", stop: 1 }
        }
    }


    try {
        tag = variables.evaluateVariable(tag)
        await page.locator(tag).selectOption(value)

        if (delay != undefined && delay != 0) await page.waitForTimeout(delay * 1000);

        return { success: 1, message: "select Ok!", value: value, stop: 0 }

    } catch (err) {
        return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
    }


}



/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   selectCount: Count the items (options) from a list
*
* @param {object} page:         playwright page
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {string} tag:          tag element
* @param {string} variable:     name of the variable to store the extra information
*
*/
async function selectCount(page, data, variables, tag, variable) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");

    let ret

    if (tag == undefined) {
        console.log("select: tag cannot be empty!")
        return { success: 0, message: "select: tag cannot be empty!", stop: 1 }
    } else if (tag[0] == '@') {
        //console.log('In the dictionary.........', data.projectID)
        // Search the tag in the dictionary
        const dataAPI = { projectID: data.projectID, code: tag, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tag = result[0].label
            //console.log("Find the code: " + tag)
        } else {
            console.log("Cannot find the code: " + tag)
            variables.displayLog(1, 1, 'Data not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tag + " in the dictionary!", stop: 1 }
        }
    }


    try {
        tag = variables.evaluateVariable(tag)
        await page.locator(tag).first().waitFor()

        let tagElement = tag + '/option'
        const count = await page.locator(tagElement).count()
        // store the size into the variable
        variables.setVariable(variable, count)

        return { success: 1, message: "selectCount Ok!", value: count, stop: 0 }

    } catch (err) {
        return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
    }

}



/**
* ---------------------------------------------------------------------------- 
* @function <TBR>
*   uploadFile: Upload a file from the repository uploads of your project
*
* @param {object} page:            playwright page
* @param {object} data:            all the parameters
* @param {object} variables:       array of all the variables
* @param {string} tag:             tag to the element
* @param {string} fileName:        name of the file to upload
*
*/
async function uploadFile(driver, data, variables, tag, fileName) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");
    const { getProjectById } = require("../../project/project.service.js")
    const { getDatasetByCode } = require("../../dataset/dataset.service.js");
    const { fileExist } = require("./file.library")
    const path = require('path')
    let ret
    let projectName

    variables.displayLog(1, 1, 'uploadFile')

    // Get the name of the project
    const result = await getProjectById(data.projectID);
    if (result.length) {
        projectName = result[0].project
    } else {
        variables.displayLog(1, 2, 'Cannot find the project: ' + data.projectID + '!')
        return { success: 0, message: "Cannot find the project: " + data.projectID + "!", stop: 1 }
    }


    let pathName = '../../../uploads/' + data.projectID + '_' + projectName + '/'
    fileName = variables.evaluateVariable(fileName);
    fileName = fileName.replace(/'/g, "");


    // Evaluate the dataset (if any)
    if (fileName[0] == '#') {
        const dataAPI = { subprojectID: data.subprojectID, code: fileName, language: '*', active: 1 }
        const result = await getDatasetByCode(dataAPI);
        if (result.length) {
            fileName = result[0].label
            fileName = variables.evaluateVariable(fileName)
            fileName = fileName.replace(/'/g, "");
        } else {
            variables.displayLog(1, 1, 'Data not found in the dataset! - value: ' + fileName)
            return { success: 0, message: "Cannot find the code: " + fileName + " in the dataset!", stop: 1 }
        }
    }


    let fullName = path.join(__dirname, pathName + fileName)
    // Check if the file exist
    ret = await fileExist(fullName)
    if (!ret) {
        // file not found!
        variables.displayLog(1, 1, "uploadFile: file not found! :" + fullName);
        variables.setVariable("$Error", "1");
        return { success: 0, message: "uploadFile: file not found! : " + fileName, stop: 1 }
    }

    if (tag == undefined) {
        return { success: 0, message: "uploadFile: tag cannot be empty!", stop: 1 }
    } else if (tag[0] == '@') {
        // Search the tag in the dictionary
        const dataAPI = { projectID: data.projectID, code: tag, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tag = result[0].label
            //console.log (link)
        } else {
            variables.displayLog(1, 2, 'Data not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tag + " in the dictionary!", stop: 1 }
        }
    }
    tag = variables.evaluateVariable(tag)

    // Get the element for the tag
    try {
        ret = await getElement(driver, variables, data, tag)
    }
    catch (err) {
        variables.displayLog(1, 1, 'uploadFile: Fatal error: Browser not responding!')
        return { success: 0, message: ret.message, stop: 1 }
    }
    if (!ret.success) {
        variables.displayLog(1, 2, '>>>>> Warning: Tag not found! - tag: ' + tag)
        variables.displayLog(1, 2, ret)
        return { success: 0, message: "uploadFile: Cannot detect the element ! " + tag, stop: 1 }
    }

    try {
        driver.executeScript('arguments[0].scrollIntoView()', ret.element);
        variables.displayLog(1, 2, ">-->   sendKey: " + fullName);
        return driver.executeScript("arguments[0].style.display = 'inline'; arguments[0].style.height = '1px'; arguments[0].style.width = '1px'; arguments[0].style.opacity = 1;", ret.element).then(() => {
            ret.element.sendKeys(fullName);
            return driver.sleep(2 * 1000);
        })
    } catch (err) {
        variables.displayLog(1, 1, err.message)
        ret = { success: 0, message: err.message, value: '<ERROR>', stop: 1 }
    }

    variables.displayLog(1, 2, 'uploadFile ret', ret)
    return ret
}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   setFocus: set the focus on an element
*
* @param {object} page:         playwright page
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {string} tag:          tag element
* @param {number} delay:        delay after the click (in seconds)
*
*/
async function setFocus(page, data, variables, tag, delay) {

    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");

    let ret

    if (tag == undefined) {
        console.log("setFocus: tag cannot be empty!")
        return { success: 0, message: "setFocus: tag cannot be empty!", stop: 1 }
    } else if (tag[0] == '@') {
        //console.log('In the dictionary.........', data.projectID)
        // Search the tag in the dictionary
        const dataAPI = { projectID: data.projectID, code: tag, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tag = result[0].label
            //console.log("Find the code: " + tag)
        } else {
            console.log("Cannot find the code: " + tag)
            variables.displayLog(1, 1, 'Data not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tag + " in the dictionary!", stop: 1 }
        }
    }

    try {
        const locator = page.locator(tag)
        const elementHandle = await locator.elementHandle()
        await page.evaluate(element => { element.scrollIntoView(); }, elementHandle)

        if (delay != undefined) {
            delay = variables.evaluateVariable(delay)
            console.log('Delay:', delay)
            await page.waitForTimeout(delay * 1000);
        }
        return { success: 1, message: "setFocus OK!", stop: 0 }

    } catch (err) {
        return { success: 0, message: "setFocus KO!", stop: 1 }
    }

}

/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   click: click on an element
*
* @param {object} driver:       selenium driver
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {string} tagElement:   tag element
* @param {number} delay:        delay after the click (in seconds)
*
*/
async function click(page, data, variables, tag, delay) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");

    let ret

    if (tag == undefined) {
        console.log("click: tag cannot be empty!")
        return { success: 0, message: "click: tag cannot be empty!", stop: 1 }
    } else if (tag[0] == '@') {
        //console.log('In the dictionary.........', data.projectID)
        // Search the tag in the dictionary
        const dataAPI = { projectID: data.projectID, code: tag, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tag = result[0].label
            //console.log("Find the code: " + tag)
        } else {
            console.log("Cannot find the code: " + tag)
            variables.displayLog(1, 1, 'Data not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tag + " in the dictionary!", stop: 1 }
        }
    }

    try {
        tag = variables.evaluateVariable(tag)
        await page.locator(tag).click()
        if (delay != undefined) {
            delay = variables.evaluateVariable(delay)
            console.log('Delay:', delay)
            await page.waitForTimeout(delay * 1000);
        }
        return { success: 1, message: "click ok!", stop: 0 }
    } catch (err) {
        return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
    }

}


/**
* ---------------------------------------------------------------------------- 
* @function <TBR>
*   doubleClick: double click on an element
*
* @param {object} driver:       selenium driver
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {string} tagElement:   tag element
* @param {number} delay:        delay after the click (in seconds)
*
*/

async function doubleClick(page, data, variables, tag, delay) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");

    let ret

    if (tag == undefined) {
        console.log("doubleClick: tag cannot be empty!")
        return { success: 0, message: "doubleClick: tag cannot be empty!", stop: 1 }
    } else if (tag[0] == '@') {
        //console.log('In the dictionary.........', data.projectID)
        // Search the tag in the dictionary
        const dataAPI = { projectID: data.projectID, code: tag, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tag = result[0].label
            //console.log("Find the code: " + tag)
        } else {
            console.log("Cannot find the code: " + tag)
            variables.displayLog(1, 1, 'Data not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tag + " in the dictionary!", stop: 1 }
        }
    }

    try {
        tag = variables.evaluateVariable(tag)
        await page.locator(tag).doubleClick()
        if (delay != undefined) {
            delay = variables.evaluateVariable(delay)
            console.log('Delay:', delay)
            await page.waitForTimeout(delay * 1000);
        }
        return { success: 1, message: "doubleClick ok!", stop: 0 }
    } catch (err) {
        return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
    }

}



/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   JSclick: click on an element with JavaScript (not selenium)
*
* @param {object} page:         playwright page
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {string} tag:          tag element
* @param {number} delay:        delay after the click (in seconds)
*
*/
async function JSclick(page, data, variables, tag, delay) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");

    let ret

    if (tag == undefined) {
        console.log("JSclick: tag cannot be empty!")
        return { success: 0, message: "JSclick: tag cannot be empty!", stop: 1 }
    } else if (tag[0] == '@') {
        //console.log('In the dictionary.........', data.projectID)
        // Search the tag in the dictionary
        const dataAPI = { projectID: data.projectID, code: tag, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tag = result[0].label
            //console.log("Find the code: " + tag)
        } else {
            console.log("Cannot find the code: " + tag)
            variables.displayLog(1, 1, 'Data not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tag + " in the dictionary!", stop: 1 }
        }
    }

    try {
        const locator = page.locator(tag)
        const elementHandle = await locator.elementHandle()
        await page.evaluate(element => { element.click(); }, elementHandle)

        if (delay != undefined) {
            delay = variables.evaluateVariable(delay)
            console.log('Delay:', delay)
            await page.waitForTimeout(delay * 1000);
        }
        return { success: 1, message: "JSclick OK!", stop: 0 }

    } catch (err) {
        return { success: 0, message: "JSclick KO!", stop: 1 }
    }


}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   getTableData: Read a table to get a value from a cell identified by a row and a column
*
* @param {object} page:         playwright page
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {string} tagElement:   tag element
* @param {number} row:          row number of the table (can be a variable)  
* @param {number} column:       column number of the table (can be a variable)
* @param {string} variable:     name of the variable
*
*/
async function getTableData(page, data, variables, tagElement, row, column, variable) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");
    let ret
    //variables.displayLog(1, 1,'----- getTableData')

    // Check if the tag is in the dictionary
    if (tagElement == '$GUI') tagElement = await variables.getVariable('$GUI')
    else if (tagElement[0] == '@') {
        const dataAPI = { projectID: data.projectID, code: tagElement, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tagElement = result[0].label
            //console.log (link)
        } else {
            variables.displayLog(1, 1, 'Data: ' + tagElement + ' not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tagElement + " in the dictionary!", stop: 1 }
        }
    }


    row = variables.evaluateVariable(row);
    row = row.replace(/'/g, "");
    row = row * 1; // convert to number
    column = variables.evaluateVariable(column);
    column = column.replace(/'/g, "");
    column = column * 1; // convert to number


    if (tagElement[0] == "'") tagElement = tagElement.slice(1, -1)
    tagElement = tagElement + '/tbody/tr[' + row + ']/td[' + column + ']'


    try {
        let myValue = await page.locator(tagElement).textContent()
        variables.displayLog(1, 2, "getTableHeader - getText: " + myValue);

        if (myValue == '' || myValue == undefined) myValue = '<EMPTY>'

        ret = { success: 1, message: "getTableHeader OK", value: myValue, stop: 0 }
        return ret

    } catch (err) {
        //variables.displayLog(1, 1,err.message)
        ret = { success: 0, message: err.message, value: 'ERROR', stop: 1 }
        variables.displayLog(1, 1, ret)
        return ret
    }

}

/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   getTableHeader: Read a table to get a header identified by a row and a column
*
* @param {object} page:         playwright page
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {string} tagElement:   tag element
* @param {number} row:          row number of the table (can be a variable)  
* @param {number} column:       column number of the table (can be a variable)
* @param {string} variable:     name of the variable
*
*/
async function getTableHeader(page, data, variables, tagElement, row, column, variable) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");
    let ret
    //variables.displayLog(1, 1,'----- getTableData')

    // Check if the tag is in the dictionary
    if (tagElement == '$GUI') tagElement = await variables.getVariable('$GUI')
    else if (tagElement[0] == '@') {
        const dataAPI = { projectID: data.projectID, code: tagElement, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tagElement = result[0].label
            //console.log (link)
        } else {
            variables.displayLog(1, 1, 'Data: ' + tagElement + ' not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tagElement + " in the dictionary!", stop: 1 }
        }
    }


    row = variables.evaluateVariable(row);
    row = row.replace(/'/g, "");
    row = row * 1; // convert to number
    column = variables.evaluateVariable(column);
    column = column.replace(/'/g, "");
    column = column * 1; // convert to number


    if (tagElement[0] == "'") tagElement = tagElement.slice(1, -1)
    tagElement = tagElement + '/tbody/tr[' + row + ']/th[' + column + ']'

    try {
        let myValue = await page.locator(tagElement).textContent()
        variables.displayLog(1, 2, "getTableHeader - getText: " + myValue);

        if (myValue == '' || myValue == undefined) myValue = '<EMPTY>'

        ret = { success: 1, message: "getTableHeader OK", value: myValue, stop: 0 }
        return ret


    } catch (err) {
        //variables.displayLog(1, 1,err.message)
        ret = { success: 0, message: err.message, value: 'ERROR', stop: 1 }
        variables.displayLog(1, 1, ret)
        return ret
    }

}

/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   setTableData: set a value into a cell of a table identified by a row and a column
*
* @param {object} page:         playwright page
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {string} tagElement:   tag element
* @param {number} row:          row number of the table (can be a variable)  
* @param {number} column:       column number of the table (can be a variable)
* @param {string} value:        value to key into the cell
*
*/
async function setTableData(driver, data, variables, tagElement, row, column, value) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");
    const { getDatasetByCode } = require("../../dataset/dataset.service.js");

    let ret
    let tagElement2 = ''
    //variables.displayLog(1, 1,'----- setTableData')

    // Check if the tag is in the dictionary
    if (tagElement[0] == '@') {
        const dataAPI = { projectID: data.projectID, code: tagElement, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tagElement = result[0].label
            //console.log (link)
        } else {
            variables.displayLog(1, 1, 'Data: ' + tagElement + ' not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tagElement + " in the dictionary!", stop: 1 }
        }
    }


    row = variables.evaluateVariable(row);
    row = row.replace(/'/g, "");
    row = row * 1; // convert to number
    column = variables.evaluateVariable(column);
    column = column.replace(/'/g, "");
    column = column * 1; // convert to number

    // Evaluate the value
    if (value == undefined) {
        value = ''
    } else {
        value = variables.evaluateVariable(value)
        value = value.replace(/'/g, "");
    }

    // Evaluate special keywords like <TODAY>, <TODAY+1>.... (if any)
    value = variables.dataValue(value)


    // Evaluate the dataset (if any)
    if (value[0] == '#') {
        value = variables.evaluateVariable(value)
        value = value.replace(/'/g, "");
        const dataAPI = { subprojectID: data.subprojectID, code: value, language: '*', active: 1 }
        const result = await getDatasetByCode(dataAPI);
        if (result.length) {
            value = result[0].label
            // Evaluate special keywords like <TODAY>, <TODAY+1>.... (if any)
            value = variables.dataValue(value)
            value = variables.evaluateVariable(value)
            value = value.replace(/'/g, "");
        } else {
            variables.displayLog(1, 1, 'Data not found in the dataset! - value: ' + value)
            return { success: 0, message: "Cannot find the code: " + value + " in the dataset!", stop: 1 }
        }
    }


    tagElement2 = tagElement + '/tbody/tr[' + row + ']/td[' + column + ']/descendant::input[1]'

    try {
        await page.locator(tagElement2).click()
        if (value.indexOf('<ENTER>', 0) >= 0) {
            value = value.replace('<ENTER>', '')
            await page.locator(tagElement2).fill(value)
            variables.displayLog(1, 1, '     ----- Press Enter')
            await page.keyboard.sendCharacter('\r'); // ASCI 10
            await page.keyboard.sendCharacter('\n'); // ASCI 13"
        } else if (value.indexOf('<TAB>', 0) >= 0) {
            value = value.replace('<TAB>', '')
            await page.locator(tagElement2).fill(value)
            await page.keyboard.sendCharacter('\t'); // ASCI 9"
        } else {
            await page.locator(tagElement2).fill(value)
        }
        variables.displayLog(1, 1, '---- setTableValue: OK!')
        ret = { success: 1, message: 'setTableValue OK', stop: 0 }
        return ret

    } catch (err) {
        //variables.displayLog(1, 1,err.message)
        ret = { success: 0, message: err.message, value: 'ERROR', stop: 1 }
        variables.displayLog(1, 1, ret)
        return ret
    }

}

/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   countTableRow: Count the number of row of a table
*
* @param {object} page:         playwright page
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {string} tagElement:   tag element of the table
* @param {string} variable:     name of the variable to store the number of rows
*
*/
async function countTableRow(page, data, variables, tagElement, variable) {

    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");


    // Check if the tag is not on the dictionary
    if (tagElement[0] == '@') {
        const dataAPI = { projectID: data.projectID, code: tagElement, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tagElement = result[0].label
        } else {
            variables.displayLog(1, 1, 'Data: ' + tagElement + ' not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tagElement + " in the dictionary!", stop: 1 }
        }
    }

    if (tagElement[0] == "'") tagElement = tagElement.slice(1, -1)
    tagElement = tagElement + '/tbody/tr'

    try {
        await page.locator(tagElement).first().waitFor()
        const count = await page.locator(tagElement).count()
        // store the value into the variable
        variables.setVariable(variable, count)
        variables.displayLog(1, 2, 'countTableRow: ' + count)

        return { success: 1, message: "countTableRow", stop: 0 }
    }
    catch (err) {
        console.log('countTableRow error............')
        variables.setVariable('$Error', "1")
        if (action == undefined) action = 0
        // action: 0 = continue, 1 = stop all the tests, 2 = skip the It

        let ret = { success: 0, message: 'countTableRow KO', stop: 0 }
        if (action == 1) { ret.stop = 1 }
        else if (action == 0) { ret.success = 1 }
        else { ret.success = 0 }
        return ret
    }

}

/**
* ---------------------------------------------------------------------------- 
* @function <TBR>
*   searchTableData: Search for a value in a cell of a table
*
* @param {object} page:         playwright page
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {string} tagElement:   tag element of the table
* @param {number} column:       column number of the table (can be a variable)
* @param {number} search:       search value
* @param {string} position:     position (occurence) of the search (default is 1)
*
*/
async function searchTableData(page, data, variables, tagElement, column, search, position) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");
    const { Left, Right } = require("./string.library.js");

    let ret
    //variables.displayLog(1, 1, '----- searchTableData')

    // Check if the tag is in the dictionary
    if (tagElement[0] == '@') {
        const dataAPI = { projectID: data.projectID, code: tagElement, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tagElement = result[0].label
            //console.log (link)
        } else {
            variables.displayLog(1, 2, 'Data: ' + tagElement + ' not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tagElement + " in the dictionary!", stop: 1 }
        }
    }

    let variable = '$Row'
    column = variables.evaluateVariable(column);
    column = column.replace(/'/g, "");
    column = column * 1; // convert to number
    search = variables.evaluateVariable(search);
    search = search.replace(/'/g, "");
    if (position == undefined) position = '1'
    position = variables.evaluateVariable(position);
    position = position.replace(/'/g, "");
    position = position * 1; // convert to number

    let caseSensitive = 1;
    let searchMethod = 1; // classic: search == data

    let i = search.indexOf('<Aa>', 0);
    if (i >= 0) {
        caseSensitive = 0;
        search = search.replace('<Aa>', '');
    }
    search.trim();
    if (Left(search, 3) == '<*>') {
        searchMethod = 2; // right:  search == Right(data)
    }
    if (Right(search, 3) == '<*>') {

        if (searchMethod == 2) {
            searchMethod = 4; // indexOf:  data.indexOf(search)
        } else {
            searchMethod = 3; // left:  search == Left(data)               
        }
    }
    search = search.replace(/<\*>/g, '');


    tagElement = tagElement + '/tbody/tr/td[' + column + ']'

    const locators = page.locator(tagElement)

    await locators.first().waitFor()
    const count = await locators.count()
    console.log('count: ' + count)
    for (let i = 0; i < count; i++) {
        let value = await locators.nth(i).textContent()
        console.log('data: ' + value)

        if (caseSensitive == 0) {  // non case sensitive
            value = value.toUpperCase();
            search = search.toUpperCase();
        }

        let searchResult = 0;
        switch (searchMethod) {
            case 1: // classic
                searchResult = (value == search);
                break;
            case 2: //right
                searchResult = (Right(value, search.length) == search);
                break;
            case 3: // left
                searchResult = (Left(value, search.length) == search);
                break;
            case 4: // index of
                searchResult = (value.indexOf(search) >= 0);
                break;
        }

        if (searchResult) {
            findData = findData + 1;
            if (findData == position) {
                // Yes, we have found the searched value
                variables.displayLog(1, 2, "searchTableData: " + findData + "/" + position + ") found the right value: " + value + " in the row " + (elt + 1));
                variables.setVariable('$Row', elt + 1);
                found = elt + 1
                break
            } else {
                variables.displayLog(1, 2, "searchTableData: " + findData + "/" + position + ") found a value: " + value + " in the row " + (elt + 1));
            }
        }


    }

    if (found) {
        return { success: 1, message: "searchTableData ok", value: found, stop: 0 }
    } else {
        // send a warning
        variables.setVariable('$Row', -1);
        return { success: 1, message: "searchTableData warning", value: -1, stop: 1 }
    }

}



/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   clickCell: Click on a cell identified by a row and a column
*
* @param {object} page:         playwright page
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {string} tagElement:   tag element
* @param {number} row:          row number of the table (can be a variable)  
* @param {number} column:       column number of the table (can be a variable)
* @param {string} delay:        delay in second(s) after the click
*
*/
async function clickCell(page, data, variables, tagElement, row, column, delay) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");
    let ret
    //variables.displayLog(1, 1,'----- clickCell')

    // Check if the tag is in the dictionary
    if (tagElement[0] == '@') {
        const dataAPI = { projectID: data.projectID, code: tagElement, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tagElement = result[0].label
            //console.log (link)
        } else {
            variables.displayLog(1, 2, 'Data: ' + tagElement + ' not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tagElement + " in the dictionary!", stop: 1 }
        }
    }

    row = variables.evaluateVariable(row);
    row = row.replace(/'/g, "");
    row = row * 1; // convert to number
    column = variables.evaluateVariable(column);
    column = column.replace(/'/g, "");
    column = column * 1; // convert to number

    tagElement = tagElement + '/tbody/tr[' + row + ']/td[' + column + ']'

    try {
        await page.locator(tag).click()
        ret = { success: 1, message: 'clickCell OK', stop: 0 }
        variables.displayLog(1, 2, 'clickCell: wait ' + delay + ' second(s) after the click')
        if (delay != undefined) {
            delay = variables.evaluateVariable(delay)
            console.log('Delay:', delay)
            await page.waitForTimeout(delay * 1000);
        }
        return { success: 1, message: 'clickCell OK', stop: 0 }
    } catch (err) {
        //variables.displayLog(1, 1,err.message)
        ret = { success: 0, message: err.message, stop: 1 }
        variables.displayLog(1, 1, ret)
        return ret
    }

}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   enable: remove the attribute disabled from an element
*
* @param {object} page:         playwright page
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {string} tag:          tag element
*
*/
async function enable(page, data, variables, tag) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");

    let ret


    if (tag == undefined) {
        console.log("remove: tag cannot be empty!")
        return { success: 0, message: "remove: tag cannot be empty!", stop: 1 }
    } else if (tag[0] == '@') {
        //console.log('In the dictionary.........', data.projectID)
        // Search the tag in the dictionary
        const dataAPI = { projectID: data.projectID, code: tag, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tag = result[0].label
            //console.log("Find the code: " + tag)
        } else {
            console.log("Cannot find the code: " + tag)
            variables.displayLog(1, 1, 'Data not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tag + " in the dictionary!", stop: 1 }
        }
    }


    try {
        const locator = page.locator(tag)
        const elementHandle = await locator.elementHandle()
        await page.evaluate(element => { element.removeAttribute('disabled'); }, elementHandle)
        return { success: 1, message: "enable OK!", stop: 0 }

    } catch (err) {
        return { success: 0, message: "enable KO!", stop: 1 }
    }


}

/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   removeAttribute: remove an attribute from an element
*
* @param {object} page:         playwright page
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {string} tag:          tag element
* @param {string} attribute:    name of the attribute
*
*/
async function removeAttribute(page, data, variables, tag, attribute) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");

    let ret

    if (tag == undefined) {
        console.log("removeAttribute: tag cannot be empty!")
        return { success: 0, message: "removeAttribute: tag cannot be empty!", stop: 1 }
    } else if (tag[0] == '@') {
        //console.log('In the dictionary.........', data.projectID)
        // Search the tag in the dictionary
        const dataAPI = { projectID: data.projectID, code: tag, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tag = result[0].label
            //console.log("Find the code: " + tag)
        } else {
            console.log("Cannot find the code: " + tag)
            variables.displayLog(1, 1, 'Data not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tag + " in the dictionary!", stop: 1 }
        }
    }


    try {
        const locator = page.locator(tag)
        const elementHandle = await locator.elementHandle()

        await page.evaluate(
            (elementData) => {
                elementData.element.removeAttribute(elementData.attribute)
            },
            { element: elementHandle, attribute: attribute }
        );

        return { success: 1, message: "removeAttribute OK!", stop: 0 }


    } catch (err) {
        return { success: 0, message: "removeAttribute KO!", stop: 1 }
    }

}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   setAttribute: set a value to a specific attribute of an element
*
* @param {object} page:         playwright page
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {string} tag:          tag element
* @param {string} attribute:    name of the attribute
* @param {string} value:        value of the attribute
*
*/
async function setAttribute(page, data, variables, tag, attribute, value) {

    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");

    let ret

    if (tag == undefined) {
        console.log("setAttribute: tag cannot be empty!")
        return { success: 0, message: "setAttribute: tag cannot be empty!", stop: 1 }
    } else if (tag[0] == '@') {
        //console.log('In the dictionary.........', data.projectID)
        // Search the tag in the dictionary
        const dataAPI = { projectID: data.projectID, code: tag, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tag = result[0].label
            //console.log("Find the code: " + tag)
        } else {
            console.log("Cannot find the code: " + tag)
            variables.displayLog(1, 1, 'Data not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tag + " in the dictionary!", stop: 1 }
        }
    }

    try {
        tag = variables.evaluateVariable(tag)

        // Set the attribute
        const locator = await page.locator(tag).first()

        let myValue2 = await locator.getAttribute(attribute);
        if (myValue2 == undefined) myValue = '<EMPTY>'
        console.log('Attribute before the update is: ' + myValue2)

        const elementHandle = await locator.elementHandle();
        await page.evaluate(
            (elementData) => {
                elementData.element.setAttribute(elementData.attribute, elementData.value);
            },
            { element: elementHandle, attribute: attribute, value: value }
        )


        let myValue = await locator.getAttribute(attribute);
        if (myValue == undefined) myValue = '<EMPTY>'
        console.log('Attribute after the update is: ' + myValue)
        return { success: 1, message: 'setAttribute OK!', value: myValue, stop: 0 }
    } catch (err) {
        return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
    }


}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   readAttribute: read a specific attribute of an element
*
* @param {object} page:         playwright page
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {string} tag:          tag element
* @param {string} attribute:    name of the attribute
* @param {string} variableName: name of the variable
*
*/
async function readAttribute(page, data, variables, tag, attribute, variableName) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");

    let ret

    if (tag == undefined) {
        console.log("readAttribute: tag cannot be empty!")
        return { success: 0, message: "readAttribute: tag cannot be empty!", stop: 1 }
    } else if (tag[0] == '@') {
        //console.log('In the dictionary.........', data.projectID)
        // Search the tag in the dictionary
        const dataAPI = { projectID: data.projectID, code: tag, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tag = result[0].label
            //console.log("Find the code: " + tag)
        } else {
            console.log("Cannot find the code: " + tag)
            variables.displayLog(1, 1, 'Data not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tag + " in the dictionary!", stop: 1 }
        }
    }

    try {
        tag = variables.evaluateVariable(tag)

        // Read the attribute
        let myValue = await page.locator(tag).first().getAttribute(attribute);
        if (myValue == undefined) myValue = '<EMPTY>'
        if (variableName != undefined && variableName != '') variables.setVariable(variableName, myValue)
        return { success: 1, message: 'readAttribute OK!', value: myValue, stop: 0 }
    } catch (err) {
        return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
    }

}



/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   isExist: detect if an element exist on the page
*
* @param {object} page:           playwright page
* @param {object} data:           all the parameters
* @param {object} variables:      array of all the variables
* @param {string} tag:            tag element
* @param {string} variableName:   name of the variable to store the result
* @param {number} delay:          waiting for the element in seconds
*
*/
async function isExist(page, data, variables, tag, variableName, delay) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");
    const { getReferenceByCode } = require("../../reference/reference.service.js");

    let timeout = 30 // 30 seconds by default
    let ret


    if (tag == undefined) {
        console.log("isExist: tag cannot be empty!")
        return { success: 0, message: "isExist: tag cannot be empty!", stop: 1 }
    } else if (tag[0] == '@') {
        //console.log('In the dictionary.........', data.projectID)
        // Search the tag in the dictionary
        const dataAPI = { projectID: data.projectID, code: tag, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tag = result[0].label
            //console.log("Find the code: " + tag)
        } else {
            console.log("Cannot find the code: " + tag)
            variables.displayLog(1, 1, 'Data not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tag + " in the dictionary!", stop: 1 }
        }
    }


    try {

        // Get the timeout (if any)
        const dataAPI = { projectID: data.projectID, userID: data.userID, code: 'TimeOut' }
        const reference = await getReferenceByCode(dataAPI);
        if (reference.length) {
            if (reference[0].label != '<N/A>') {
                timeout = reference[0].label * 1
            }
        }
        console.log('Original TimeOut: ' + timeout)
        if (delay == undefined) delay = 10    // delay = number of second(s) to wait for the element
        console.log('Wait for: ' + delay)
        tag = variables.evaluateVariable(tag)
        console.log('Tag', tag)

        page.setDefaultTimeout(delay * 1000);
        await page.locator(tag).first().waitFor()
        page.setDefaultTimeout(timeout * 1000) // Back to the original timeout

        let isExist = await page.locator(tag).first().isVisible()
        console.log('Visible:', isExist)

        if (variableName != undefined && variableName != '') variables.setVariable(variableName, isExist)
        return { success: 1, message: "isExist Ok!", value: isExist, stop: 0 }

    } catch (err) {
        console.log('isExist Error', err.message)
        page.setDefaultTimeout(timeout * 1000) // Back to the original timeout
        if (variableName != undefined && variableName != '') variables.setVariable(variableName, 0)
        return { success: 1, message: "isExist KO!", value: 0, stop: 0 }
    }

}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   isCheck: detect if an element is checked
*
* @param {object} page:           playwright page
* @param {object} data:           all the parameters
* @param {object} variables:      array of all the variables
* @param {string} tagElement:     tag element
* @param {string} variableName:   name of the variable to store the result
* @param {number} delay:          waiting for the element in seconds
*
*/

async function isCheck(page, data, variables, tag, variableName, delay) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");
    const { getReferenceByCode } = require("../../reference/reference.service.js");

    let ret
    let timeout = 30 // 30 seconds by default


    if (tag == undefined) {
        console.log("isCheck: tag cannot be empty!")
        return { success: 0, message: "isCheck: tag cannot be empty!", stop: 1 }
    } else if (tag[0] == '@') {
        //console.log('In the dictionary.........', data.projectID)
        // Search the tag in the dictionary
        const dataAPI = { projectID: data.projectID, code: tag, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tag = result[0].label
            //console.log("Find the code: " + tag)
        } else {
            console.log("Cannot find the code: " + tag)
            variables.displayLog(1, 1, 'Data not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tag + " in the dictionary!", stop: 1 }
        }
    }


    try {

        // Get the timeout (if any)
        const dataAPI = { projectID: data.projectID, userID: data.userID, code: 'TimeOut' }
        const reference = await getReferenceByCode(dataAPI);
        if (reference.length) {
            if (reference[0].label != '<N/A>') {
                timeout = reference[0].label * 1
            }
        }
        console.log('Original TimeOut: ' + timeout)
        if (delay == undefined) delay = 10    // delay = number of second(s) to wait for the element
        console.log('Wait for: ' + delay)
        tag = variables.evaluateVariable(tag)
        console.log('Tag', tag)

        page.setDefaultTimeout(delay * 1000);
        await page.locator(tag).first().waitFor()
        page.setDefaultTimeout(timeout * 1000) // Back to the original timeout

        let isChecked = await page.locator(tag).first().isChecked()

        if (variableName != undefined && variableName != '') variables.setVariable(variableName, isChecked)
        return { success: 1, message: "isCheck Ok!", value: isChecked, stop: 0 }

    } catch (err) {
        page.setDefaultTimeout(timeout * 1000) // Back to the original timeout
        if (variableName != undefined && variableName != '') variables.setVariable(variableName, 0)
        return { success: 1, message: "isCheck KO!", value: 0, stop: 0 }
    }

}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   isEnable: detect if an element is disabled
*
* @param {object} page:           playwright page
* @param {object} data:           all the parameters
* @param {object} variables:      array of all the variables
* @param {string} tag:            tag element
* @param {string} variableName:   name of the variable to store the result
* @param {number} delay:          waiting for the element in seconds
*
*/
async function isEnable(page, data, variables, tag, variableName, delay) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");
    const { getReferenceByCode } = require("../../reference/reference.service.js");

    let ret
    let timeout = 30 // 30 seconds by default

    if (tag == undefined) {
        console.log("isEnable: tag cannot be empty!")
        return { success: 0, message: "isEnable: tag cannot be empty!", stop: 1 }
    } else if (tag[0] == '@') {
        //console.log('In the dictionary.........', data.projectID)
        // Search the tag in the dictionary
        const dataAPI = { projectID: data.projectID, code: tag, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tag = result[0].label
            //console.log("Find the code: " + tag)
        } else {
            console.log("Cannot find the code: " + tag)
            variables.displayLog(1, 1, 'Data not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tag + " in the dictionary!", stop: 1 }
        }
    }


    try {

        // Get the timeout (if any)
        const dataAPI = { projectID: data.projectID, userID: data.userID, code: 'TimeOut' }
        const reference = await getReferenceByCode(dataAPI);
        if (reference.length) {
            if (reference[0].label != '<N/A>') {
                timeout = reference[0].label * 1
            }
        }
        console.log('Original TimeOut: ' + timeout)
        if (delay == undefined) delay = 10    // delay = number of second(s) to wait for the element
        console.log('Wait for: ' + delay)
        tag = variables.evaluateVariable(tag)
        console.log('Tag', tag)

        page.setDefaultTimeout(delay * 1000);
        await page.locator(tag).first().waitFor()
        page.setDefaultTimeout(timeout * 1000) // Back to the original timeout

        let isEnabled = await page.locator(tag).nth(0).isEnabled()

        if (variableName != undefined && variableName != '') variables.setVariable(variableName, isEnabled)
        return { success: 1, message: "isEnabled Ok!", value: isEnabled, stop: 0 }

    } catch (err) {
        page.setDefaultTimeout(timeout * 1000) // Back to the original timeout
        if (variableName != undefined && variableName != '') variables.setVariable(variableName, 0)
        return { success: 1, message: "isEnabled KO!", value: 0, stop: 0 }
    }
}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   isVisible: detect if an element is visible (displayed)
*
* @param {object} page:           playwright page
* @param {object} data:           all the parameters
* @param {object} variables:      array of all the variables
* @param {string} tag:            tag element
* @param {string} variableName:   name of the variable to store the result
* @param {number} delay:          waiting for the element in seconds
*
*/
async function isVisible(page, data, variables, tag, variableName, delay) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");
    const { getReferenceByCode } = require("../../reference/reference.service.js");

    let ret
    let timeout = 30 // 30 seconds by default

    if (tag == undefined) {
        console.log("isVisible: tag cannot be empty!")
        return { success: 0, message: "isVisible: tag cannot be empty!", stop: 1 }
    } else if (tag[0] == '@') {
        //console.log('In the dictionary.........', data.projectID)
        // Search the tag in the dictionary
        const dataAPI = { projectID: data.projectID, code: tag, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tag = result[0].label
            //console.log("Find the code: " + tag)
        } else {
            console.log("Cannot find the code: " + tag)
            variables.displayLog(1, 1, 'Data not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tag + " in the dictionary!", stop: 1 }
        }
    }


    try {

        // Get the timeout (if any)
        const dataAPI = { projectID: data.projectID, userID: data.userID, code: 'TimeOut' }
        const reference = await getReferenceByCode(dataAPI);
        if (reference.length) {
            if (reference[0].label != '<N/A>') {
                timeout = reference[0].label * 1
            }
        }
        console.log('Original TimeOut: ' + timeout)
        if (delay == undefined) delay = 10    // delay = number of second(s) to wait for the element
        console.log('Wait for: ' + delay)
        tag = variables.evaluateVariable(tag)
        console.log('Tag', tag)

        page.setDefaultTimeout(delay * 1000);
        await page.locator(tag).first().waitFor()
        page.setDefaultTimeout(timeout * 1000) // Back to the original timeout

        let isVisible = await page.locator(tag).nth(0).isVisible()

        if (variableName != undefined && variableName != '') variables.setVariable(variableName, isVisible)
        return { success: 1, message: "isVisible Ok!", value: isVisible, stop: 0 }

    } catch (err) {
        page.setDefaultTimeout(timeout * 1000) // Back to the original timeout
        if (variableName != undefined && variableName != '') variables.setVariable(variableName, 0)
        return { success: 1, message: "isVisible KO!", value: 0, stop: 0 }
    }
}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   waitInvisible: Wait for an element to be invisible
*
* @param {object} page:           playwright page
* @param {object} data:           all the parameters
* @param {object} variables:      array of all the variables
* @param {string} tagElement:     tag element
* @param {number} delay:        delay in seconds
* @param {number} action:       action in case element is still available: continue (0) or stop all the tests (1) or skip the It (2)
*
*/
async function waitInvisible(driver, data, variables, tagElement, delay, action) {

    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");
    const { getReferenceByCode } = require("../../reference/reference.service.js");
    let timeout = 30 // 30 seconds by default


    // Check if the tag is not on the dictionary
    if (tagElement[0] == '@') {
        const dataAPI = { projectID: data.projectID, code: tagElement, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tagElement = result[0].label
        } else {
            variables.displayLog(1, 1, 'Data: ' + tagElement + ' not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tagElement + " in the dictionary!", stop: 1 }
        }
    }


    try {
        // Get the timeout (if any)
        const dataAPI = { projectID: data.projectID, userID: data.userID, code: 'TimeOut' }
        const reference = await getReferenceByCode(dataAPI);
        if (reference.length) {
            if (reference[0].label != '<N/A>') {
                timeout = reference[0].label * 1
            }
        }
        console.log('Original TimeOut: ' + timeout)


        if (delay == undefined) delay = 10   // delay = number of second(s) to wait for the element
        delay = delay * 1000
        page.setDefaultTimeout(delay);

        const locator = page.locator(tagElement).first()
        await locator.waitFor({ state: 'hidden', delay });

        page.setDefaultTimeout(timeout * 1000) // Back to the original timeout
        return { success: 1, message: "waitForNot OK", stop: 0 }
    }
    catch (err) {
        page.setDefaultTimeout(timeout * 1000) // Back to the original timeout
        console.log('waitInvisible error', err.message)
        variables.setVariable('$Error', "1")
        if (action == undefined) action = 0
        // action: 0 = continue, 1 = stop all the tests, 2 = skip the It

        let ret = { success: 0, message: 'waitInvisible KO', stop: 0 }
        if (action == 1) {
            ret.stop = 1
            ret.message = 'waitInvisible KO after ' + delay + ' sec. --> Stop the tests'
        }
        else if (action == 0) {
            ret.success = 1
            ret.message = 'waitInvisible KO after ' + delay + ' sec. --> Continue'
        }
        else {
            ret.success = 0
            ret.message = 'waitInvisible KO after ' + delay + ' sec. --> Skip IT'
        }
        return ret
    }

}




/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   check: check an element if it is not already done
*
* @param {object} page:           playwright page
* @param {object} data:           all the parameters
* @param {object} variables:      array of all the variables
* @param {string} tag:            tag element
* @param {number} delay:          delay after the check (in seconds)
*
*/

async function check(driver, data, variables, tag, delay) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");

    let ret

    if (tag == undefined) {
        console.log("check: tag cannot be empty!")
        return { success: 0, message: "check: tag cannot be empty!", stop: 1 }
    } else if (tag[0] == '@') {
        //console.log('In the dictionary.........', data.projectID)
        // Search the tag in the dictionary
        const dataAPI = { projectID: data.projectID, code: tag, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tag = result[0].label
            //console.log("Find the code: " + tag)
        } else {
            console.log("Cannot find the code: " + tag)
            variables.displayLog(1, 1, 'Data not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tag + " in the dictionary!", stop: 1 }
        }
    }

    try {
        tag = variables.evaluateVariable(tag)
        await page.locator(tag).check()
        if (delay != undefined) {
            delay = variables.evaluateVariable(delay)
            console.log('Delay:', delay)
            await page.waitForTimeout(delay * 1000);
        }
        return { success: 1, message: "check ok!", stop: 0 }
    } catch (err) {
        return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
    }

}


/**
* ---------------------------------------------------------------------------- 
* @function <ok>
*   uncheck: Uncheck an element if it is not already the case
*
* @param {object} page:           playwright page
* @param {object} data:           all the parameters
* @param {object} variables:      array of all the variables
* @param {string} tag:            tag element
* @param {number} delay:          delay after the check (in seconds)
*
*/
async function uncheck(page, data, variables, tag, delay) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");

    let ret

    if (tag == undefined) {
        console.log("uncheck: tag cannot be empty!")
        return { success: 0, message: "uncheck: tag cannot be empty!", stop: 1 }
    } else if (tag[0] == '@') {
        //console.log('In the dictionary.........', data.projectID)
        // Search the tag in the dictionary
        const dataAPI = { projectID: data.projectID, code: tag, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tag = result[0].label
            //console.log("Find the code: " + tag)
        } else {
            console.log("Cannot find the code: " + tag)
            variables.displayLog(1, 1, 'Data not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tag + " in the dictionary!", stop: 1 }
        }
    }

    try {
        tag = variables.evaluateVariable(tag)
        await page.locator(tag).uncheck()
        if (delay != undefined) {
            delay = variables.evaluateVariable(delay)
            console.log('Delay:', delay)
            await page.waitForTimeout(delay * 1000);
        }
        return { success: 1, message: "uncheck ok!", stop: 0 }
    } catch (err) {
        return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
    }

}


/**
 * ---------------------------------------------------------------------------- 
 * @function <OK>
 *  acceptPopup: function to accept a javascript popup window
 * 
 * Be carefull, the function must be called before the popup is displayed!
 *
 * @param {object} page:         playwright page
 * @param {object} variables:    array of all the variables
 * 
 */
async function acceptPopup(page, variables) {
    page.on('dialog', dialog => dialog.accept())
}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*  cancelPopup: function to cancel (dismiss) a javascript popup window
* 
 * Be carefull, the function must be called before the popup is displayed!
*
* @param {object} page:         playwright page
* @param {object} variables:    array of all the variables
*
*/
async function cancelPopup(page, variables) {
    page.on('dialog', dialog => dialog.dismiss())
}


/**
 * ---------------------------------------------------------------------------- 
 * @function <OK>
 *  pressTab:  Press the TAB key
 *  
 * @param {object} page:    playwright page
 * @param {number} count:   how many times TAB key should be pressed.
 *
 */
async function pressTab(page, count) {

    if (!isNaN(count * 1)) {
        let temp = 0;
        while (temp < count - 1) {
            try {
                //driver.actions().sendKeys(9).perform();
                await page.keyboard.press('Tab')
                temp++;
            } catch (err) {
                return { success: 0, message: err.message, stop: 1 }
            }
        }

        try {
            //driver.actions().sendKeys(9).perform();
            await page.keyboard.press('Tab')
            return { success: 1, message: 'pressTab Ok!', stop: 0 }
        } catch (err) {
            return { success: 0, message: err.message, stop: 1 }
        }
    }
    else {
        try {
            driver.actions().sendKeys(9).perform();
            return { success: 1, message: 'pressTab Ok!', stop: 0 }
        } catch (err) {
            return { success: 0, message: err.message, stop: 1 }
        }
    }
}


/**
 * ---------------------------------------------------------------------------- 
 * @function <OK>
 *  pressEnter:  Press the ENTER key
 * 
 * @param {object} page:    playwright page
 *  
 */
async function pressEnter(page) {
    try {
        //driver.actions().sendKeys(13).perform();
        await page.keyboard.press('Enter')
        return { success: 1, message: 'pressEnter Ok!', stop: 0 }

    } catch (err) {
        return { success: 0, message: err.message, stop: 1 }
    }
}


/**
 * ---------------------------------------------------------------------------- 
 * @function <OK>
 *  pressEscape:  Press the ESCAPE key
 * 
 * @param {object} page:    playwright page
 *  
 */
async function pressEscape(page) {
    try {
        //driver.actions().sendKeys(27).perform();
        await page.keyboard.press('Escape')
        return { success: 1, message: 'pressEscape Ok!', stop: 0 }

    } catch (err) {
        return { success: 0, message: err.message, stop: 1 }
    }
}

/**
 * ---------------------------------------------------------------------------- 
 * @function <TBR>
 *  keyboard:  send character with the JavaScript sendKeys
 * 
 * @param {object} page:    playwright page
 * @param {object} data:        all the parameters
 * @param {object} variables:   array of all the variables
 * @param {string} text:        text to key
 *  
 */
async function keyboard(page, data, variables, text) {
    const { getDatasetByCode } = require("../../dataset/dataset.service.js");

    if (text == undefined) text = ''
    else if (isNaN(text)) {
        // Search the text in the dataset 
        if (text[0] == '#') {
            text = variables.evaluateVariable(text)
            text = text.replace(/'/g, "");
            const dataAPI = { subprojectID: data.subprojectID, code: text, language: '*', active: 1 }
            const result = await getDatasetByCode(dataAPI);
            if (result.length) {
                text = result[0].label
            } else {
                variables.displayLog(1, 1, 'Data not found in the dataset!')
                return { success: 0, message: "Cannot find the code: " + text + " in the dataset!", stop: 1 }
            }
        }
    }

    try {
        for (let i = 0; i < text.length; i++) {
            //console.log('keyboard sends: ' + text[i])
            //driver.actions().sendKeys(text[i]).perform();
            await page.keyboard.press(text[i])
        }
        return { success: 1, message: 'keyboard Ok!', stop: 0 }

    } catch (err) {
        return { success: 0, message: err.message, stop: 1 }
    }
}



/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   speaking: Speech to text
*
* @param {string} myText: text to say
*
*/
async function speaking(myText) {

    //variables.displayLog(1, 1, '----- say')
    myText = myText.replace(/'/g, "");
    const say = require('say');
    let ret

    return say.speak(myText, '', 1.0, async () => {
        ret = { success: 1, message: 'Speaking OK', stop: 0 }
        return ret
    });
}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   logfile: write into the logfile
*   message (alias): write into the logfile
*
* @param {number} userID:   userID
* @param {string} category: category of the log: Message, Describe, It, Step, Error, Warning 
* @param {string} message:  message of the log
*
*/
async function logfile(userID, category, message) {
    let ret

    const { createLogfile } = require("../../logfile/logfile.service.js");
    if (message == undefined) {
        ret = { success: 0, message: 'logfile: message is undefined!', stop: 0 }
        return ret
    }

    try {
        message = message.toString()
        message = message.replace(/'/g, "");

        const dataAPI = { userID: userID, category: category, message: message }

        const result = await createLogfile(dataAPI);
        if (!result.affectedRows) {
            ret = { success: 0, message: 'Error in the logfile', stop: 0 }
            return ret
        } else {
            ret = { success: 1, message: 'Logfile OK', stop: 0 }
            return ret
        }
    }
    catch (err) {
        variables.displayLog(1, 1, 'logfile: Fatal error: Browser not responding!')
        return { success: 0, message: 'logfile: Fatal error: Browser not responding!', stop: 1 }
    }

}

/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   setVariable: set a value into a variable
*
* @param {object} variables:    array of all the variables
* @param {string} variable:     Name of the variable
* @param {string} value:        Value to set into the variable (it can be an expression if it starts with =)
*
*/
async function setVariable(variables, variable, value) {
    let ret = { success: 1, message: 'setVariable', stop: 0 }

    //variables.displayLog(1, 1,'--- setVariable ---- ' + variable + ' ' + value)

    variable = variable.trim()
    if (typeof (value) == "string") value = value.trim()

    // value can be an expression if it starts with '='
    if (value[0] == '=') {
        // evaluate the expression
        value = value.substring(1)
        try {
            value = variables.evaluateVariable(value)
            variables.displayLog(1, 1, 'evaluate value: ' + value)
            value = eval(value)
            variables.setVariable(variable, value);
            return { success: 1, message: 'setVariable', value: value, stop: 0 }
        }
        catch (err) {
            return { success: 0, message: 'setVariable eval error: ' + err.message, stop: 0 }
        }
    } else if (value == '<EMPTY>') {
        variables.setVariable(variable, '');
        return { success: 1, message: 'setVariable', value: '', stop: 0 }
    } else {
        variables.setVariable(variable, value);
        return { success: 1, message: 'setVariable', value: value, stop: 0 }
    }

}



/**
* ---------------------------------------------------------------------------- 
* @function <TBR>
*   refreshURL: refresh the current page (equivalent to F5)
*
* @param {number} userID:   userID
* @param {object} variables: array of all the variables
*
*/
async function refreshURL(userID, variables) {

    try {
        await browser.driver.navigate().refresh();
        ret = { success: 1, message: 'refreshURL OK', stop: 0 }
        return ret
    } catch (err) {
        return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
    }
}




/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   listVariable: write all the variables into the logfile
*
* @param {number} userID:   userID
* @param {object} variables: array of all the variables
*
*/
async function listVariable(userID, variables) {

    await logfile(userID, 'Message', '-------------------------')
    await logfile(userID, "Message", '- List of the Variables -')
    await logfile(userID, 'Message', '-------------------------')

    for (var item in variables.myVariables) {
        // check if it's a numeric value
        if (isNaN(variables.myVariables[item] * 1)) {
            // Variable is a string
            await logfile(userID, "Info", item + ": " + variables.myVariables[item] + " (" + typeof (variables.myVariables[item]) + ")")
        }
        else { // Variable is a number
            await logfile(userID, "Info", item + ": " + variables.myVariables[item] + " (" + typeof (variables.myVariables[item] * 1) + ")")
        }
    }
    ret = { success: 1, message: 'listVariable OK', stop: 0 }
    return ret
}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   getReference: Get an existing reference by the code
*
* @param {object} variables:        array of all the variables
* @param {number} projectID:        projectID
* @param {number} userID:           userID
* @param {string} code:             code
* @param {string} variableName:     variable name
*
*/
async function getReference(variables, projectID, userID, code, variableName) {

    const { getReferenceByCode } = require("../../reference/reference.service.js");

    try {
        //console.log ('getReference - projectID: ' +  projectID + ', userID: ' + userID + ', code: ' +  code + ', variable: ' +  variable)
        //console.log('debug: getReference')
        code = variables.evaluateVariable(code)
        if (code.length > 0) {
            code = code.replace(/'/g, "");
        }

        // get the reference by code
        const dataAPI = { projectID: projectID, userID: userID, code: code }
        let ret

        //console.log('debug: getReference: before getReferenceByCode')
        const result = await getReferenceByCode(dataAPI);
        //console.log('debug: getReference: after getReferenceByCode')

        if (!result.length) {
            ret = { success: 0, message: 'Record not found for the code: ' + code, value: '', stop: 0 }
            return ret
        } else {
            let label = result[0].label
            let referenceID = result[0].referenceID
            // store the label into the variable
            if (variableName != undefined) {
                // store the label into the variable
                variables.setVariable(variableName, label)
            }
            ret = { success: 1, message: "Reference for '" + code + "' : '" + label + "'", value: label, id: referenceID, stop: 0 }
            return ret
        }
    }
    catch (err) {
        variables.displayLog(1, 1, 'getReference: Fatal error: Browser not responding!')
        return { success: 0, message: ret.message, stop: 1 }
    }

}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   setReference: write data in the reference
*
* @param {number} projectID:    projectID
* @param {number} userID:       userID
* @param {string} code:         code
* @param {string} label:        label of the reference
* @param {string} comment:      <optional> comment
*
*/
async function setReference(variables, projectID, userID, code, label, comment) {

    const { updateReference, createReference, reorderReference } = require("../../reference/reference.service.js");
    let data = {}
    let result
    let ret

    try {

        code = variables.evaluateVariable(code)
        if (code.length > 0) {
            code = code.replace(/'/g, "");
        }
        // if (label.length > 0) {
        //     label = label.replace(/'/g, " ");
        // }
        label = variables.evaluateVariable(label)
        if (label.length > 0) {
            label = label.replace(/'/g, "");
        }
        if (label.length > 512) label = label.substring(0, 511)

        comment = variables.evaluateVariable(comment)
        if (comment.length > 0) {
            comment = comment.replace(/'/g, "");
        }

        //variables.displayLog(1, 1,'setReference')
        console.log('before: getReference')
        ret = await getReference(variables, projectID, userID, code)
        console.log('after: getReference')
        //variables.displayLog(1, 1,ret)

        if (ret.success == 1) {
            // We found a reference, we can update it
            data = { code: code, label: label, comment: comment, active: 1, projectID: projectID, userID: userID, referenceID: ret.id }
            console.log('before: updateReference')
            result = await updateReference(data);
            console.log('after: updateReference')
            if (!result.affectedRows) {
                ret = { success: 0, message: 'Internal Error in the update after a successfull getReference with code: ' + code, stop: 0 }
            } else {
                ret = { success: 1, message: "Reference: '" + code + "': '" + label + "' updated!", stop: 0 }
            }
        } else {
            // Create a new reference
            data = { projectID: projectID, userID: userID, code: code, label: label, comment: comment, position: '99999', active: 1 }
            //console.log('before: createReference')
            result = await createReference(data);
            //console.log('after: createReference')
            if (!result.affectedRows) {
                ret = { success: 0, message: 'Error in the insert of a reference: ' + code, stop: 0 }
            } else {
                // reorder the reference
                data = { projectID: projectID, userID: userID }
                result = await reorderReference(data);
                if (!result.affectedRows) {
                    ret = { success: 1, message: 'Error in the reorder after the insert of a reference: ' + code, stop: 0 }
                } else {
                    ret = { success: 1, message: "Reference: '" + code + "': '" + label + "' inserted!", stop: 0 }
                }
            }
        }

        //variables.displayLog(1, 1,ret)
        variables.displayLog(3, 1, 'setReference: ' + code, ret.message)
        return ret
    }
    catch (err) {
        variables.displayLog(1, 1, 'setReference: Fatal error: ' + ret.message)
        return { success: 0, message: ret.message, stop: 1 }
    }

}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   getData: Get value of a dataset by a code and a language
*
* @param {object} data:             all the parameters
* @param {object} variables:        array of all the variables
* @param {number} projectID:        projectID
* @param {number} userID:           userID
* @param {string} code:             code
* @param {string} variable:         variable name
*
*/
async function getData(data, variables, code, variable) {
    const { getDatasetByCode } = require("../../dataset/dataset.service.js");

    if (code == undefined) {
        variables.displayLog(1, 1, '>>>>> getData: code cannot be empty!')
        return { success: 0, message: "getData: the code cannot be empty!", stop: 1 }
    }

    code = variables.evaluateVariable(code)
    code = code.replace(/'/g, "");

    if (code[0] == '#') {
        const dataAPI = { subprojectID: data.subprojectID, code: code, active: 1 }
        const result = await getDatasetByCode(dataAPI);
        if (result.length) {
            // generate a random number between 0 and length - 1
            let id = Math.floor(Math.random() * Math.floor(result.length));
            // Evaluate special keywords like <TODAY>, <TODAY+1>.... (if any)
            let value = result[id].label
            value = variables.dataValue(value)
            // store the value into the variable
            variables.setVariable(variable, value)
            variables.displayLog(1, 1, '----- getData: OK! ' + variable + ' = ' + result[id].label)
            return { success: 1, message: "getData: value: '" + result[id].label + "' stored into the variable: " + variable, stop: 0 }
        } else {
            variables.displayLog(1, 1, '>>>>> Data not found in the dataset!')
            //console.log('DataAPI', dataAPI)
            // store <Not Found!> in the variable
            variables.setVariable(variable, '<Not Found!>')
            return { success: 0, message: "Cannot find the code: " + code + " in the dataset!", stop: 1 }
        }
    } else {
        variables.displayLog(1, 1, '>>>>> getData: the code must start with the character # **' + code + '**')
        return { success: 0, message: "getData: the code must start with the character # **" + code + '**', stop: 1 }
    }
}

/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   setData: Set a value in a dataset (update or create a new one)
*
* @param {object} data:             all the parameters
* @param {object} variables:        array of all the variables
* @param {number} projectID:        projectID
* @param {number} userID:           userID
* @param {string} code:             code
* @param {string} value:            value in the dataset
* @param {string} comment:          comment in the dataset
*
*/
async function setData(data, variables, code, value, comment) {
    const { getDatasetByCode, updateDataset, createDataset, reorderDataset } = require("../../dataset/dataset.service.js");
    const { getDatasetheaderByCode, createDatasetheader, reorderDatasetheader } = require("../../datasetheader/datasetheader.service.js");

    variables.displayLog(1, 1, 'data: ', data)


    // Check if the dataset already exists
    if (code == undefined) {
        variables.displayLog(1, 1, '>>>>> setData: code cannot be empty!')
        return { success: 0, message: "setData: the code cannot be empty!", stop: 1 }
    }

    if (code[0] == '#') {

        code = variables.evaluateVariable(code)
        code = code.replace(/'/g, "");

        // Split the datasetheaderCode and the datasetCode
        let myArray = code.split("_");
        if (myArray[0] == undefined || myArray[1] == undefined) {
            return { success: 0, message: "setData: Invalid format ('#<dataset>_<data>) for the code: " + code, stop: 1 }
        }
        let datasetheaderID = 0
        let datasetheaderCode = myArray[0]
        let datasetCode = '_' + myArray[1]
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
        const year = currentDate.getFullYear();
        let today = ('0' + day).slice(-2) + '/' + ('0' + month).slice(-2) + '/' + year
        value = variables.evaluateVariable(value)
        value = value.replace(/'/g, "");
        let dataAPI = { subprojectID: data.subprojectID, code: code, active: 1 }
        const result = await getDatasetByCode(dataAPI);
        //variables.displayLog(1, 1,'@@@@ Dataset by code: ', code, result)
        if (result.length) {
            // The dataset already exists, update the value
            let datasetID = result[0].datasetID
            variables.displayLog(1, 1, 'Dataset by code exists with the datasetID: ', datasetID)
            // code=?, label=?, comment=?, active=?, updatedby=?, updated=? WHERE datasetID = ?
            dataAPI = { code: datasetCode, label: value, comment: comment, active: 1, user: data.userName, today: today, datasetID: datasetID }
            const result2 = await updateDataset(dataAPI);
            //variables.displayLog(1, 1,'Dataset updated: ', result2)
            if (!result2.affectedRows) {
                return { success: 0, message: "setData: update of the code: " + code + ' fails!', stop: 1 }
            } else {
                return { success: 1, message: "setData: update of the code: " + code + ' OK!', stop: 0 }
            }
        } else {
            // check if the datasetheader exists
            let dataAPI = { subprojectID: data.subprojectID, code: datasetheaderCode }
            const result3 = await getDatasetheaderByCode(dataAPI);
            //variables.displayLog(1, 1,'@@@@ Datasetheader by code : ', datasetheaderCode, result3)
            if (result3.length) {
                // the datasetheader exists, extract the datasetheaderID
                datasetheaderID = result3[0].datasetheaderID
                //variables.displayLog(1, 1,'@@@@ Datasetheader by code detected : ', datasetheaderID)
            } else {
                // datasetheader not exists, create a new one
                // subprojectID, code, comment, position, active
                dataAPI = { subprojectID: data.subprojectID, code: datasetheaderCode, comment: 'created by: ' + data.userName, position: 999, active: 1 }
                const result4 = await createDatasetheader(dataAPI);
                if (!result4.affectedRows) {
                    return { success: 0, message: "setData: Insert a new datasetheader code: " + datasetheaderCode + ' fails!', stop: 1 }
                }
                datasetheaderID = result4.insertId
                //variables.displayLog(1, 1,'@@@@ Datasetheader created with datasetheaderID: ', datasetheaderID, result4)
                // Reorder the position
                dataAPI = { subprojectID: data.subprojectID }
                const result4b = await reorderDatasetheader(dataAPI);

            }

            // Dataset not exists, create a new one
            // subprojectID, datasetheaderID, code, label, comment, position, active, createdby, created, updatedby, updated
            dataAPI = { subprojectID: data.subprojectID, datasetheaderID: datasetheaderID, code: datasetCode, label: value, comment: comment, position: 999, active: 1, user: data.userName, today: today }
            const result5 = await createDataset(dataAPI);
            //variables.displayLog(1, 1,'@@@@ Dataset create: ', result5)

            if (!result5.affectedRows) {
                return { success: 0, message: "setData: Insert a new code: " + code + ' fails!', stop: 1 }
            } else {
                // Reoder the position
                dataAPI = { datasetheaderID: datasetheaderID }
                const result5b = await reorderDataset(dataAPI);

                return { success: 1, message: "setData: Insert a new code: " + code + ' OK!', stop: 0 }
            }
        }
    } else {
        variables.displayLog(1, 1, '>>>>> setData: the code must start with the character # **' + code + '**')
        return { success: 0, message: "setData: Invalid format ('#<dataset>_<data>) for the code: " + code, stop: 1 }
    }
}


/**
* ---------------------------------------------------------------------------- 
* @function <TBR>
*   JSinput: set a value into an element with JavaScript (not selenium)
*
* @param {object} page:         playwright page
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {string} tag:          tag element
* @param {string} value:        value to set into an element
*
*/
async function JSinput(page, data, variables, tag, value) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");

    let ret

    if (tag == undefined) {
        console.log("JSinput: tag cannot be empty!")
        return { success: 0, message: "JSinput: tag cannot be empty!", stop: 1 }
    } else if (tag[0] == '@') {
        //console.log('In the dictionary.........', data.projectID)
        // Search the tag in the dictionary
        const dataAPI = { projectID: data.projectID, code: tag, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tag = result[0].label
            //console.log("Find the code: " + tag)
        } else {
            console.log("Cannot find the code: " + tag)
            variables.displayLog(1, 1, 'Data not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tag + " in the dictionary!", stop: 1 }
        }
    }

    try {
        tag = variables.evaluateVariable(tag)

        // Set the attribute value
        const locator = await page.locator(tag).first()

        const elementHandle = await locator.elementHandle();
        await page.evaluate(
            (elementData) => {
                elementData.element.setAttribute(elementData.attribute, elementData.value);
            },
            { element: elementHandle, attribute: 'value', value: value }
        )

        return { success: 1, message: 'JSinput OK!', stop: 0 }
    } catch (err) {
        return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
    }

}


/**
 * ---------------------------------------------------------------------------- 
 * @function <OK>
 *  printScreen:  take a print screen
 * 
 * @param {object} page:        playwright page
 * @param {object} data:        all the parameters
 * @param {string} slotID:      slot number = 0: Error, 1 --> 5 User print screen 
 *  
 */
async function printScreen(page, data, slotID) {
    let fs = require("fs")

    try {
        let picture = './printscreen/' + data.userID + '_image' + slotID + '.png'
        await page.screenshot({ path: picture })
        return { success: 1, message: 'Printscreen OK', slot: slotID, stop: 0 }
    } catch (err) {
        return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
    }
}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*  epoch:  return a date converted into epoch (Unix) date and time
* 
* @param {object} variables:    array of all the variables
* @param {string} myDate:       a date in any valid format
* @param {string} myFormat:     any valid format
* @param {string} variable:     variable name
*
*/
async function epoch(variables, myDate, myFormat, variable) {
    const { timeEpoch } = require("./time.library.js")

    myDate = variables.evaluateVariable(myDate)
    myDate = myDate.replace(/'/g, "");

    let myEpoch = await timeEpoch(myDate, myFormat)
    variables.setVariable(variable, myEpoch)

    return { success: 1, message: "epoch Ok!", value: myEpoch, stop: 0 }
}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*  epochDate:  Convert an epoch to a date
* 
* @param {object} variables:    array of all the variables
* @param {number} myEpoch:      epoch date
* @param {string} myFormat:     any valid format
* @param {string} variable:     variable name
*
*/
async function epochDate(variables, myEpoch, myFormat, variable) {
    const { timeEpochDate } = require("./time.library.js")

    myEpoch = variables.evaluateVariable(myEpoch)
    myEpoch = myEpoch.replace(/'/g, "");

    let myDate = await timeEpochDate(myEpoch, myFormat)
    variables.setVariable(variable, myDate)

    return { success: 1, message: "epochDate Ok!", value: myDate, stop: 0 }
}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*  epochAddHour:  return a date + a value converted into epoch (Unix) date and time
* 
* @param {object} variables:    array of all the variables
* @param {string} myDate:       a date in any valid format or empty for the current date time
* @param {string} myFormat:     any valid format
* @param {number} myValue:      a value to add to the date
* @param {string} variable:     variable name
*
*/
async function epochAddHour(variables, myDate, myFormat, myValue, variable) {
    const { timeEpochAdd } = require("./time.library.js")

    myDate = variables.evaluateVariable(myDate)
    myDate = myDate.replace(/'/g, "");

    let myUnit = 'h'
    let myEpoch = await timeEpochAdd(myDate, myFormat, myValue, myUnit)
    variables.setVariable(variable, myEpoch)

    return { success: 1, message: "epochAddHour Ok!", value: myEpoch, stop: 0 }
}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*  epochAddMinute:  return a date + a value converted into epoch (Unix) date and time
* 
* @param {object} variables:    array of all the variables
* @param {string} myDate:       a date in any valid format or empty for the current date time
* @param {string} myFormat:     any valid format
* @param {number} myValue:      a value to add to the date
* @param {string} variable:     variable name
*
*/
async function epochAddMinute(variables, myDate, myFormat, myValue, variable) {
    const { timeEpochAdd } = require("./time.library.js")

    myDate = variables.evaluateVariable(myDate)
    myDate = myDate.replace(/'/g, "");

    let myUnit = 'm'
    let myEpoch = await timeEpochAdd(myDate, myFormat, myValue, myUnit)
    variables.setVariable(variable, myEpoch)

    return { success: 1, message: "epochAddMinute Ok!", value: myEpoch, stop: 0 }
}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*  epochAddSecond:  return a date + a value converted into epoch (Unix) date and time
* 
* @param {object} variables:    array of all the variables
* @param {string} myDate:       a date in any valid format or empty for the current date time
* @param {string} myFormat:     any valid format
* @param {number} myValue:      a value to add to the date
* @param {string} variable:     variable name
*
*/
async function epochAddSecond(variables, myDate, myFormat, myValue, variable) {
    const { timeEpochAdd } = require("./time.library.js")

    myDate = variables.evaluateVariable(myDate)
    myDate = myDate.replace(/'/g, "");

    let myUnit = 's'
    let myEpoch = await timeEpochAdd(myDate, myFormat, myValue, myUnit)
    variables.setVariable(variable, myEpoch)

    return { success: 1, message: "epochAddSecond Ok!", value: myEpoch, stop: 0 }
}


/**
* ---------------------------------------------------------------------------- 
* @function <TBR>
*  isBrowserAlive:  Check if the browser is still alive - return a boolean 
* 
* @param {object} driver:       selenium driver
*
*/
async function isBrowserAlive_OBSOLETE(driver) {

    variables.displayLog(1, 1, 'isBrowserAlive')

    try {
        // Get the current title to check if the browser is still alive
        variables.displayLog(1, 1, 'Before getTitle....')
        driver.getTitle()
        variables.displayLog(1, 1, 'After getTitle....')
        return { success: 1, message: "Browser Ok!", value: 1, stop: 0 }
    } catch (NoSuchSessionError) {
        variables.displayLog(1, 1, 'FATAL ERROR: ', err.message)
        return { success: 0, message: 'Fatal Error: ' + err.message }
    }

    // return await driver.getCurrentUrl().then(function (link) {
    //     //Browser is open
    //     console.log ('Browser is alive')
    //     return { success: 1, message: "Browser Ok!", value: 1, stop: 0 }
    // }).catch(function (err) {
    //     //Browser was closed
    //     variables.displayLog(1, 1, 'FATAL ERROR: ', err.message)
    //     return { success: 0, message: 'Fatal Error: ' + err.message, value: 0, stop: 1 }
    // });

    // if (!driver.session_) {
    //     return { success: 0, message: 'Fatal Error: ' + err.message, value: 0, stop: 1 }
    // } else {
    //     return { success: 1, message: "Browser Ok!", value: 1, stop: 0 }
    // }


}




/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   executeRules: Execute a set of rules
*
* @param {object} page:         playwright page
* @param {object} variables:    array of all the variables
* @param {object} data:         all the parameters
* @param {number} ruleName:     Name of the rule
*
*/
async function executeRules(page, variables, data, ruleName, param1, param2, param3) {
    const { getDatasetByCode } = require("../../dataset/dataset.service.js");
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");
    const rule = require("./rule.library.js");

    // store the Param1 in $P1, Param2 in $P2 and Param3 in $P3
    if (param1 == undefined) param1 = ''
    if (param2 == undefined) param2 = ''
    if (param3 == undefined) param3 = ''


    variables.displayLog(1, 1, '-----------------------------------')
    variables.displayLog(1, 1, 'parameter1: ' + param1)
    variables.displayLog(1, 1, 'parameter2: ' + param2)
    variables.displayLog(1, 1, 'parameter3: ' + param3)
    variables.displayLog(1, 1, '-----------------------------------')

    if (param1[0] == '#') {
        param1 = variables.evaluateVariable(param1)
        param1 = param1.replace(/'/g, "");
        variables.displayLog(1, 1, '-----------------------------------')
        variables.displayLog(1, 1, 'parameter1: ' + param1)
        variables.displayLog(1, 1, '-----------------------------------')

        const dataAPI = { subprojectID: data.subprojectID, code: param1, active: 1 }
        const result = await getDatasetByCode(dataAPI);
        if (result.length) {
            param1 = result[0].label
        } else {
            variables.displayLog(1, 1, 'executeRules: Parameter 1 : ' + param1 + '  not found in the dataset! code: ')
            return { success: 0, message: "executeRules: Cannot find the param1: " + param1 + " in the dataset!", stop: 1 }
        }
    }

    if (param1[0] == '@') {
        const dataAPI = { projectID: data.projectID, code: param1, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            param1 = result[0].label
        } else {
            variables.displayLog(1, 1, 'executeRules: Parameter 2: ' + tag + ' not found in the dictionary!')
            return { success: 0, message: "executeRules: Cannot find the param1: " + param1 + " in the dictionary!", stop: 1 }
        }
    }

    if (param2[0] == '#') {
        param2 = variables.evaluateVariable(param2)
        param2 = param2.replace(/'/g, "");
        variables.displayLog(1, 1, '-----------------------------------')
        variables.displayLog(1, 1, 'parameter2: ' + param2)
        variables.displayLog(1, 1, '-----------------------------------')

        const dataAPI = { subprojectID: data.subprojectID, code: param2, active: 1 }
        const result = await getDatasetByCode(dataAPI);
        if (result.length) {
            param2 = result[0].label
        } else {
            variables.displayLog(1, 1, 'executeRules: Data: ' + param2 + '  not found in the dataset!')
            return { success: 0, message: "executeRules: Cannot find the param2: " + param2 + " in the dataset!", stop: 1 }
        }
    }

    if (param2[0] == '@') {
        const dataAPI = { projectID: data.projectID, code: param2, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            param2 = result[0].label
        } else {
            variables.displayLog(1, 1, 'executeRules: Data: ' + tag + ' not found in the dictionary!')
            return { success: 0, message: "executeRules: Cannot find the param2: " + param2 + " in the dictionary!", stop: 1 }
        }
    }


    if (param3[0] == '#') {
        param3 = variables.evaluateVariable(param3)
        param3 = param3.replace(/'/g, "");
        variables.displayLog(1, 1, '-----------------------------------')
        variables.displayLog(1, 1, 'parameter3: ' + param3)
        variables.displayLog(1, 1, '-----------------------------------')

        const dataAPI = { subprojectID: data.subprojectID, code: param3, active: 1 }
        const result = await getDatasetByCode(dataAPI);
        if (result.length) {
            param3 = result[0].label
        } else {
            variables.displayLog(1, 1, 'executeRules: Data: ' + param3 + '  not found in the dataset!')
            return { success: 0, message: "executeRules: Cannot find the param3: " + param3 + " in the dataset!", stop: 1 }
        }
    }

    if (param3[0] == '@') {
        const dataAPI = { projectID: data.projectID, code: param3, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            param3 = result[0].label
        } else {
            variables.displayLog(1, 1, 'executeRules: Data: ' + tag + ' not found in the dictionary!')
            return { success: 0, message: "executeRules: Cannot find the param3: " + param3 + " in the dictionary!", stop: 1 }
        }
    }

    variables.setVariable('$P1', param1)
    variables.setVariable('$P2', param2)
    variables.setVariable('$P3', param3)

    try {
        return await rule.execRules(page, variables, data, ruleName);
    }
    catch (err) {
        variables.displayLog(1, 1, 'executeRules: Fatal error: Browser not responding!')
        return { success: 0, message: ret.message, stop: 1 }
    }

}

/**
* ---------------------------------------------------------------------------- 
* @function <TBR>
*  startTimer:  Store a user time to measure performance
* 
* @param {object} page:       playwright page
*
*/
async function startTimer(data, page, variables, topic) {
    let userTime = variables.userTime()
    topic = variables.evaluateVariable(topic)
    topic = topic.replace(/'/g, "");
    topic = topic.replace(' ', '')
    topic = topic.toLowerCase()
    variables.setVariable('$' + topic, userTime)
    variables.displayLog(1, 1, '*****>> startTimer for ' + topic + ' = ' + userTime)
    return { success: 1, message: "startTimer: OK", value: userTime, stop: 0 }
}



/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*  stopTimer:  Store the elspased time since the last userStartTime() 
* 
* @param {object} page:       playwright page
*
*/
async function stopTimer(data, dpageiver, variables, space, topic) {
    const { getPerformanceByCode, updatePerformance, updatePerformanceById, createPerformance } = require("../../performance/performance.service.js");


    let endTime = variables.userTime()
    space = variables.evaluateVariable(space)
    space = space.replace(/'/g, "");
    topic = variables.evaluateVariable(topic)
    topic = topic.replace(/'/g, "");
    topic = topic.replace(' ', '')
    topic = topic.toLowerCase()
    let startTime = await variables.getVariable('$' + topic)
    if (startTime == "<N/A>") return { success: 0, message: "stopTimer - Topic: " + topic + " not defined!", value: startTime, stop: 1 }
    let elapsedTime = (endTime - startTime) / 1000;
    variables.displayLog(1, 1, 'stopTimer for ' + topic + ' / ' + space + ' = ' + elapsedTime)

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
    const year = currentDate.getFullYear();
    let today = ('0' + day).slice(-2) + '/' + ('0' + month).slice(-2) + '/' + year

    // get the performances for the scenario
    const dataAPI = { projectID: data.projectID, scenarioID: data.scenarioID, space: space, topic: topic }
    const result = await getPerformanceByCode(dataAPI)
    //console.log ('******* Result', result)
    if (result.length) {
        //console.log('*****>> Result', result)
        if (result.length > 10) {
            // we have previous performances with no free slots, we need to switch data and move the 11th to the 10th
            for (let i = 1; i < result.length; i++) {
                console.log('*****>> loop ' + i + ' measure: ' + result[i].measure + ', sequenceID: ' + i)
                const dataAPI2 = { measure: result[i].measure, created: result[i].created, projectID: data.projectID, scenarioID: data.scenarioID, space: space, topic: topic, sequenceID: i }
                const result2 = await updatePerformance(dataAPI2)
                if (!result2.affectedRows) {
                    return { success: 0, message: "stopTimer: shift error", value: elapsedTime, stop: 1 }
                }
            }
            // Move the 11th record to the 10th
            const dataAPI2b = { measure: result[result.length - 1].measure, created: result[result.length - 1].created, projectID: data.projectID, scenarioID: data.scenarioID, space: space, topic: topic, sequenceID: 10 }
            const result2b = await updatePerformance(dataAPI2b)
            if (!result2b.affectedRows) {
                return { success: 0, message: "stopTimer: shift 11 to 10 error", value: elapsedTime, stop: 1 }
            }

        } else {
            // Get the before last record (the last one has the sequence 11) and add a new record with last record + 1
            console.log('*****>> Fill the sequence')
            let sequenceID = result[result.length - 2].sequenceID + 1
            let previousTime = result[result.length - 1].measure
            if (sequenceID == 1) {
                const dataAPI2 = { measure: result[result.length - 2].measure, created: result[result.length - 2].created, space: space, topic: topic, sequenceID: sequenceID, performanceID: result[result.length - 2].performanceID }
                const result2 = await updatePerformanceById(dataAPI2)
                if (!result2.affectedRows) {
                    return { success: 0, message: "stopTimer: update sequence 0 to 1", value: elapsedTime, stop: 1 }
                }
            } else {
                console.log('*****>> fill the sequence ' + sequenceID + ' with the measure: ' + sequenceID)
                const dataAPI2 = { measure: previousTime, created: today, projectID: data.projectID, scenarioID: data.scenarioID, space: space, topic: topic, sequenceID: sequenceID }
                const result2 = await createPerformance(dataAPI2)
                if (!result2.affectedRows) {
                    return { success: 0, message: "stopTimer: Fill error", value: elapsedTime, stop: 1 }
                }
            }
        }


        // Update the new performance (sequence: 11)
        const dataAPI3 = { measure: elapsedTime, created: today, projectID: data.projectID, scenarioID: data.scenarioID, space: space, topic: topic, sequenceID: 11 }
        const result3 = await updatePerformance(dataAPI3)
        if (!result3.affectedRows) {
            return { success: 0, message: "stopTimer: update new performance error", value: elapsedTime, stop: 1 }
        }


    } else {
        console.log('*****>> New performance')
        // Insert the new performance in the sequence: 1
        const dataAPI2 = { measure: elapsedTime, created: today, projectID: data.projectID, scenarioID: data.scenarioID, space: space, topic: topic, sequenceID: 0 }
        const result2 = await createPerformance(dataAPI2)
        if (!result2.affectedRows) {
            return { success: 0, message: "stopTimer: create new performance 1 error", value: elapsedTime, stop: 1 }
        }
        // Insert the new performance in the sequence: 11
        const dataAPI3 = { measure: elapsedTime, created: today, projectID: data.projectID, scenarioID: data.scenarioID, space: space, topic: topic, sequenceID: 11 }
        const result3 = await createPerformance(dataAPI3)
        if (!result3.affectedRows) {
            return { success: 0, message: "stopTimer: create new performance 11 error", value: elapsedTime, stop: 1 }
        }
    }

    return { success: 1, message: "stopTimer: OK", value: elapsedTime, stop: 0 }
}


/**
* ---------------------------------------------------------------------------- 
 * @function <TBR>
 *   evaluateFunction: convert a function name into a selenium function
 *
 * @param {object} driver:      selenium driver
 * @param {object} variables:   array of all the variables
 * @param {string} name:        name of the function
 * @param {object} data:        all the parameters
 * @param {string} param1:      parameter 1 of the function
 * @param {string} param2:      parameter 2 of the function
 * @param {string} param3:      parameter 3 of the function
 * @param {string} param4:      parameter 4 of the function
 * 
 * 
 *  Return value:   success       stop    skipIt  skipDescribe StopAll
 *                      1           0
 *                      1           1        Yes (no error)
 *                      1           2                Yes
 *                      0           0        Yes (with error)  
 *                      0           1                           Yes
 * 
 *
* ---------------------------------------------------------------------------- 
 */
async function evaluateFunction(page, variables, name, data, param1, param2, param3, param4) {

    let delay = 2
    let ret

    //console.log('----------  Evaluate Function ----------------', name)
    //console.log (name)
    //console.log ('--------------------------')

    //variables.listVariable()
    //variables.setVariable('$Evaluate', 'OK')

    try {

        switch (name) {

            case 'debug':
                ret = await debug(variables, param1)
                return ret

            case 'url':
                ret = await url(page, variables, data.projectID, param1)
                return ret

            case 'getUrl':
                ret = await getUrl(page, variables, param1)
                return ret

            case 'newTab':
                ret = await newTab(page)
                return ret

            case 'newWindow':
                ret = await newWindow(page)
                return ret

            case 'loginUser':
                ret = await loginUser(page, variables, data, param1, param2, param3)
                return ret

            case 'loginPassword':
                ret = await loginPassword(page, variables, data, param1, param2, param3)
                return ret

            case 'dummyExtraInfo':
                ret = await dummyExtraInfo(page, variables, data, param1, param2)
                await logfile(data.userID, 'Info', ret.value)
                return ret

            case 'dummyLogin':
                ret = await dummyLogin(page, variables, data, param1, param2)
                await logfile(data.userID, 'Info', ret.value)
                return ret

            case 'detectGUI':
                ret = await detectGUI(page, variables, data, param1, param2, param3, param4)
                if (ret.success == 1) await logfile(data.userID, 'Info', 'patternID: ' + ret.patternID)
                return ret

            case 'switchToFrame':
                ret = await switchToFrame(page, variables, data, param1)
                return ret

            case 'switchToBrowserTab':
                ret = await switchToBrowserTab(page, param1)
                return ret

            case 'closeBrowserTab':
                ret = await closeBrowserTab(page)
                return ret

            case 'setFocus':
                ret = await setFocus(page, data, variables, param1, param2)
                return ret

            case 'acceptPopup':
                ret = await acceptPopup(page, variables)
                return ret

            case 'cancelPopup':
                ret = await cancelPopup(page, variables)
                return ret

            case 'click':
                ret = await click(page, data, variables, param1, param2)
                return ret

            case 'JSclick':
                ret = await JSclick(page, data, variables, param1, param2)
                return ret

            case 'doubleClick':
                ret = await doubleClick(page, data, variables, param1, param2)
                return ret

            case 'uploadFile':
                ret = await uploadFile(page, data, variables, param1, param2)
                return ret

            case 'getTableData':
                ret = await getTableData(page, data, variables, param1, param2, param3, param4)
                await logfile(data.userID, 'Info', ret.value)
                return ret

            case 'getTableHeader':
                ret = await getTableHeader(page, data, variables, param1, param2, param3, param4)
                await logfile(data.userID, 'Info', ret.value)
                return ret

            case 'setTableData':
                ret = await setTableData(page, data, variables, param1, param2, param3, param4)
                return ret

            case 'countTableRow':
                ret = await countTableRow(page, data, variables, param1, param2)
                await logfile(data.userID, 'Info', ret.value)
                return ret

            case 'searchTableData':
                ret = await searchTableData(page, data, variables, param1, param2, param3, param4)
                await logfile(data.userID, 'Info', '$Row: ' + ret.value)
                return ret

            case 'clickCell':
                ret = await clickCell(page, data, variables, param1, param2, param3, param4)
                return ret

            case 'enable':
                ret = await enable(page, data, variables, param1)
                return ret

            case 'isExist':
                ret = await isExist(page, data, variables, param1, param2, param3)
                await logfile(data.userID, 'Info', ret.message + ' : ' + ret.value)
                return ret

            case 'isCheck':
                ret = await isCheck(page, data, variables, param1, param2, param3)
                await logfile(data.userID, 'Info', ret.message + ' : ' + ret.value)
                return ret

            case 'ask':
                ret = await ask(page, variables, param1, param2, param3, param4)
                return ret

            case 'email':
                ret = await email(variables, data, param1, param2, param3, param4)
                if (ret == undefined) ret = { success: 1, message: 'Email sent OK', stop: 0 }
                await logfile(data.userID, 'Info', ret.message)
                return ret

            case 'check':
                ret = await check(page, data, variables, param1, param2)
                return ret

            case 'uncheck':
                ret = await uncheck(page, data, variables, param1, param2)
                return ret

            case 'isEnable':
                ret = await isEnable(page, data, variables, param1, param2, param3)
                return ret

            case 'setValue':
                ret = await setValue(page, data, variables, param1, param2, param3)
                if (ret.success == 1) await logfile(data.userID, 'Info', ret.value)
                return ret

            case 'select':
                ret = await select(page, data, variables, param1, param2, param3, param4)
                if (ret.success == 1) await logfile(data.userID, 'Info', '$Value=' + ret.value)
                return ret

            case 'selectCount':
                ret = await selectCount(page, data, variables, param1, param2)
                if (ret.success == 1) await logfile(data.userID, 'Info', ret.value)
                return ret


            case 'countElement':
                ret = await countElement(page, data, variables, param1, param2, param3, param4)
                if (ret.success == 1) await logfile(data.userID, 'Info', ret.value)
                return ret

            case 'getValue':
                ret = await getValue(page, data, variables, param1, param2)
                await logfile(data.userID, 'Info', ret.value)
                return ret

            case 'pressTab':
                ret = pressTab(page, param1)
                return ret

            case 'pressEscape':
                ret = await pressEscape(page)
                return ret

            case 'pressEnter':
                ret = await pressEnter(page)
                return ret

            case 'keyboard':
                ret = await keyboard(page, data, variables, param1)
                return ret

            case 'waitFor':
                ret = await waitFor(page, data, variables, param1, param2, param3)
                await logfile(data.userID, 'Info', ret.message)
                return ret

            case 'waitForNot':
                ret = await waitForNot(page, data, variables, param1, param2, param3)
                return ret

            case 'isVisible':
                ret = await isVisible(page, data, variables, param1, param2, param3)
                return ret

            case 'waitInvisible':
                ret = await waitInvisible(page, data, variables, param1, param2, param3)
                return ret

            case 'setVariable':
                ret = await setVariable(variables, param1, param2)
                return ret

            case 'listVariable':
                //variables.displayLog(1, 1,'listVariable')
                ret = await listVariable(data.userID, variables)
                ret = { success: 1, message: 'listVariable OK', stop: 0 }
                return ret

            case 'refreshURL':
                //variables.displayLog(1, 1,'listVariable')
                ret = await refreshURL(data.userID, variables)
                ret = { success: 1, message: 'refreshURL OK', stop: 0 }
                return ret

            case 'speak':
                //variables.displayLog(1, 1,'speaking')
                param1 = variables.evaluateVariable(param1)
                ret = await speaking(param1)
                ret = { success: 1, message: 'speak OK', stop: 0 }
                return ret

            case 'logfile':
                //variables.displayLog(1, 1,'logfile')
                ret = await logfile(data.userID, param1, param2)
                ret = { success: 1, message: 'logfile OK', stop: 0 }
                return ret

            case 'message':
                //variables.displayLog(1, 1,'message')
                param1 = variables.evaluateVariable(param1)
                ret = await logfile(data.userID, param2, param1)
                ret = { success: 1, message: 'message/logfile OK', stop: 0 }
                return ret

            case 'printScreen':
                ret = await printScreen(page, data, param1)
                if (ret.success == 1) await logfile(data.userID, 'Info', 'Print screen is in the slot: ' + ret.slot)
                return ret

            case 'pause':
                ret = await pause(page, variables, data.subprojectID, param1);
                return ret

            case 'stopTest':
                ret = await stopTest(variables, param1, param2)
                return ret

            case 'setReference':
                ret = await setReference(variables, data.projectID, data.userID, param1, param2, param3)
                if (ret.success == 1) await logfile(data.userID, 'Info', ret.message)
                return ret

            case 'getReference':
                ret = await getReference(variables, data.projectID, data.userID, param1, param2)
                if (ret.success == 1) await logfile(data.userID, 'Info', ret.message)
                return ret

            case 'getData':
                ret = await getData(data, variables, param1, param2)
                if (ret.success == 1) await logfile(data.userID, 'Info', ret.message)
                return ret

            case 'setData':
                ret = await setData(data, variables, param1, param2, param3)
                if (ret.success == 1) await logfile(data.userID, 'Info', ret.message)
                return ret

            case 'JSinput':
                ret = await JSinput(page, data, variables, param1, param2, param3)
                if (ret.success == 1) await logfile(data.userID, 'Info', ret.message)
                return ret

            case 'skipIt':
                ret = await skipIt(variables, param1, param2)
                return ret

            case 'skipDescribe':
                ret = await skipDescribe(variables, param1, param2)
                return ret

            case 'epoch':
                ret = await epoch(variables, param1, param2, param3)
                await logfile(data.userID, 'Info', ret.value)
                return ret

            case 'epochDate':
                ret = await epochDate(variables, param1, param2, param3)
                await logfile(data.userID, 'Info', ret.value)
                return ret

            case 'epochAddHour':
                ret = await epochAddHour(variables, param1, param2, param3, param4)
                await logfile(data.userID, 'Info', ret.value)
                return ret

            case 'epochAddMinute':
                ret = await epochAddMinute(variables, param1, param2, param3, param4)
                await logfile(data.userID, 'Info', ret.value)
                return ret

            case 'epochAddSecond':
                ret = await epochAddSecond(variables, param1, param2, param3, param4)
                await logfile(data.userID, 'Info', ret.value)
                return ret

            case 'getAllElements':
                ret = await getAllElements(page, variables, data, param1)
                return ret

            case 'rule':
                ret = await executeRules(page, variables, data, param1, param2, param3, param4)
                variables.displayLog(3, 1, 'Rule - Ret: ', ret)
                return ret

            case 'dictionary':
                ret = await dictionary(variables, data, param1, param2, param3)
                if (ret.success == 1) await logfile(data.userID, 'Info', ret.value)
                return ret

            case 'removeAttribute':
                ret = await removeAttribute(page, data, variables, param1, param2)
                await logfile(data.userID, 'Info', 'Remove attribute - return:' + ret.success)
                return ret

            case 'setAttribute':
                ret = await setAttribute(page, data, variables, param1, param2, param3)
                await logfile(data.userID, 'Info', 'Set attribute - return: ' + ret.success)
                return ret

            case 'readAttribute':
                ret = await readAttribute(page, data, variables, param1, param2, param3)
                if (ret.success == 1) await logfile(data.userID, 'Info', ret.value)
                return ret

            case 'callScenario':
                ret = await callScenario(data, page, variables, param1)
                if (ret.success == 1) await logfile(data.userID, 'Info', ret.value)
                return ret

            case 'callSuite':
                ret = await callSuite(data, page, variables, param1)
                if (ret.success == 1) await logfile(data.userID, 'Info', ret.value)
                return ret

            case 'startTimer':
                ret = await startTimer(data, page, variables, param1, param2)
                return ret

            case 'stopTimer':
                ret = await stopTimer(data, page, variables, param1, param2)
                return ret

            case 'promptAI':
                ret = await promptAI(page, data, variables, param1, param2)
                if (ret.success == 1) {
                    await logfile(data.userID, 'Info', param1)
                    await logfile(data.userID, 'Info', ret.value)
                }
                return ret


            default:
                variables.displayLog(1, 1, 'No function with the name: ' + name)
                ret = { success: 0, message: 'function: ' + name + ' unknown!', stop: 1 }
                return ret
        }
    }
    catch (err) {
        variables.displayLog(1, 1, 'Fatal error in evaluateFunction with: ' + name)
        ret = { success: 0, message: 'Fatal error in evaluateFunction with: ' + name, stop: 1 }
        return ret
    }


}

// -----------------------------------------------------------
// @function <OK>
// Call a scenario from its ID
//
// @param {number} data.projectID     ID of the project
// @param {number} data.subprojectID  ID of the subproject
// @param {number} data.userID        ID of the user
// @param {object} page:              playwright page
// @param {object} variables:         array of all the variables
// -----------------------------------------------------------
async function callScenario(data, page, variables, scenarioID) {
    const { getScenarioById } = require("../../scenario/scenario.service");
    const { getTestByScenario } = require("../../test/test.service");
    const robot = require("./robot.library.js")

    let ret = 0

    if (data.subprojectID == undefined || data.userID == undefined) {
        variables.displayLog(1, 1, 'Invalid data!')
        variables.displayLog(1, 1, data)
        ret = { success: 0, message: "Invalid data!" }
        return ret
    }

    scenarioID = variables.evaluateVariable(scenarioID)
    scenarioID = scenarioID.replace(/'/g, "");


    variables.displayLog(1, 1, '============================================================================')
    variables.displayLog(1, 1, "Call the scenario:" + scenarioID)
    variables.displayLog(1, 1, '============================================================================')

    // ----------------------------------
    // Get the detail of the scenario
    // ----------------------------------
    const scenario = await getScenarioById(scenarioID);
    if (!scenario.length) {
        ret = { success: 0, message: "No scenario found for the Id: " + scenarioID }
        return ret
    }
    data.scenarioName = scenario[0].scenario
    data.scenarioID = scenarioID

    // ----------------------------------
    // Read all the tests of a scenario
    // ----------------------------------
    const tests = await getTestByScenario(scenarioID);
    if (!tests.length) {
        ret = { success: 0, message: "No test found for the scenario Id: " + scenarioID }
        return ret
    }

    // ----------------------------------
    // Execute the tests of the scenario
    // ----------------------------------
    try {
        ret = await executeScenario(data, page, tests)
        if (!ret.success) {
            await robot.evaluateFunction(page, variables, 'setReference', data, 'Execution Status', 0, 'Test KO')
        } else {
            await robot.evaluateFunction(page, variables, 'setReference', data, 'Execution Status', 1, 'Test OK')
        }

        await robot.evaluateFunction(page, variables, 'logfile', data, 'Execute', '======================================')
        ret = { success: 1, message: "Scenario successfully executed!", value: 'scenarioID: ' + data.scenarioName, stop: 0 }
        return ret;

    } catch (err) {
        return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
    }

}



// -----------------------------------------------------------
// @function <OK>
// Call a suite from its ID
//
// @param {number} data.projectID     ID of the project
// @param {number} data.subprojectID  ID of the subproject
// @param {number} data.userID        ID of the user
// @param {object} page:              playwright page
// @param {object} variables:         array of all the variables
// -----------------------------------------------------------
async function callSuite(data, page, variables, suiteheaderID) {
    const { getScenarioById } = require("../../scenario/scenario.service");
    const { getTestByScenario } = require("../../test/test.service");
    const { getSuiteByHeader } = require("../../suite/suite.service");
    const robot = require("./robot.library.js")

    let scenarioID = 0
    let ret = 0
    let stop = 0


    if (data.subprojectID == undefined || data.userID == undefined) {
        variables.displayLog(1, 1, 'Invalid data!')
        variables.displayLog(1, 1, data)
        ret = { success: 0, message: "Invalid data!" }
        return ret
    }

    let suiteID = 0
    let suiteErrorID = 0

    suiteheaderID = variables.evaluateVariable(suiteheaderID)
    suiteheaderID = suiteheaderID.replace(/'/g, "");

    variables.displayLog(1, 1, '============================================================================')
    variables.displayLog(1, 1, "Call the suite:" + suiteheaderID)
    variables.displayLog(1, 1, '============================================================================')

    data.suiteID = suiteheaderID
    let context = ''
    data.context = ''

    // ----------------------------------
    // Read all the scenarios of the suite
    // ----------------------------------
    const dataAPI = { suiteheaderID: data.suiteID }
    const suites = await getSuiteByHeader(dataAPI);
    if (!suites.length) {
        ret = { success: 0, message: "No suite found for the Id: " + data.suiteID }
        return resolve(ret);
    }

    // ---------------------------------------------------
    // Loop through all the suites to extract the scenarios
    // ---------------------------------------------------
    for (const item of suites) {

        if (stop == 1) continue

        suiteID = item.suiteID
        scenarioID = item.scenarioID
        let label = item.headerlabel
        let comment = item.comment
        suiteErrorID = 0


        await robot.evaluateFunction(page, variables, 'logfile', data, 'Execute', '============== SUITE ==============')
        await robot.evaluateFunction(page, variables, 'logfile', data, 'Execute', '=======> ' + label)


        // Get the detail of the scenario
        const scenario = await getScenarioById(scenarioID);
        if (!scenario.length) {
            ret = { success: 0, message: "No scenario found for the Id: " + scenarioID }
            await robot.evaluateFunction(page, variables, 'logfile', data, 'Error', "No scenario found for the Id: " + scenarioID)
            ret = { success: 0, message: "No scenario found for the Id: " + scenarioID }
            return ret
        }
        data.scenarioName = scenario[0].scenario

        variables.displayLog(1, 1, 'Scenario Name: ' + data.scenarioName)

        // Read all the tests of a scenario
        const tests = await getTestByScenario(scenarioID);
        if (!tests.length) {
            ret = { success: 0, message: "No test found in the suite for the Id: " + scenarioID }
            await robot.evaluateFunction(page, variables, 'logfile', data, 'Error', "No test found in the suite for the Id: " + scenarioID)
            ret = { success: 0, message: "No test found in the suite for the Id: " + scenarioID }
            return ret
        }
        // Execute the scenario
        data.scenarioID = scenarioID


        ret = await robot.executeScenario(data, page, tests)
        if (!ret.success) {
            stop = 1
        }

    } // end for loop suites


    if (!ret.success) {
        await robot.evaluateFunction(page, variables, 'setReference', data, 'Execution Status', 0, 'Test KO')
    } else {
        await robot.evaluateFunction(page, variables, 'setReference', data, 'Execution Status', 1, 'Test OK')
    }

    await robot.evaluateFunction(page, variables, 'logfile', data, 'Execute', '==============  END SUITE ==============')
    ret = { success: 1, message: "Suite successfully executed!", value: 'suiteID: ' + suiteheaderID, stop: 0 }
    return ret;

}


// -----------------------------------------------------------
// @function <TBR> not fully working as we don't have the test() in the API
// promptAI: prompt to AI and store the result into a variable
//
// API AI Playwright: 
// API Key: 0step:674b447d-ce7f-4173-ae87-4a9611a652c2
// API login: pgoffin
// -----------------------------------------------------------
// @param {object} page:              playwright page
// @param {object} data:              set of data
// @param {object} variables:         array of all the variables
// @param {string} prompt:            prompt to send to AI
// @param {string} variable:          name of the variable
// -----------------------------------------------------------

async function promptAI(page, data, variables, prompt, variableName) {
    console.log('promptAI', prompt)

    try {
        console.log('promptAI 0')
        const { ai } = require("@zerostep/playwright")

        // Create a mock 'test' object that includes a 'step' function.
        const mockTest = {
            step: async (description, callback) => {
                console.log(`AI Step: ${description}`);
                try {
                    await callback(); // Execute the action within the step
                } catch (error) {
                    console.error(`AI Step Error: ${error}`);
                    throw error; // Re-throw the error to be caught by the outer try/catch
                }
            },
            log: (message) => {
                console.log(`AI Log: ${message}`);
            },
        };


        console.log('promptAI 1')
        const text = await ai(prompt, { page, test: mockTest })
        variables.setVariable(variableName, text)
        console.log('Answer:', text)

        ret = { success: 1, message: "promptAI OK!", value: text, stop: 0 }
        return ret
    } catch (err) {
        variables.displayLog(1, 1, 'promptAI:', err.message)
        ret = { success: 0, message: err.message, stop: 1 }
        return ret
    }

}


// -----------------------------------------------------------
// @function <TBR>
// executeScenario: Execute a scenario to execute the test
//
// @param {string} data.scenarioName  Name of the scenario
// @param {number} data.scenarioID    ID of the scenario
// @param {number} data.projectID     ID of the project
// @param {number} data.subprojectID  ID of the subproject
// @param {number} data.userID        ID of the user
//
// -----------------------------------------------------------
async function executeScenario(data, page, tests) {

    return new Promise(async (resolve, reject) => {

        //const { Builder, By, Key, ChromeOptions } = require("selenium-webdriver")
        const robot = require("./robot.library.js")
        const Variables = require('./variable.library.js');
        let variables = new Variables();

        variables.displayLog(3, 1, 'executeScenario Data: ', data)


        let ret = 0
        let fataError = 0
        let skipIT = 0
        let skipDescribe = 0
        let stopTest = 0
        let errorNb = 0
        let warningNb = 0
        let lastCondition = ''
        let context = ''
        let lastContext = data.context

        variables.displayLog(1, 1, '')
        variables.displayLog(1, 1, '============================================================================')
        variables.displayLog(1, 1, "Execute the scenario:" + data.scenarioName + " with the userID: " + data.userID)
        variables.displayLog(1, 1, '============================================================================')
        ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Execute', '======================================')
        ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Execute', 'Executing: ' + data.scenarioName)
        ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Execute', '======================================')



        if (data.scenarioID == undefined || data.subprojectID == undefined || data.userID == undefined) {
            variables.displayLog(1, 1, 'Invalid data!')
            variables.displayLog(1, 1, data)
            ret = { success: 0, message: "Invalid data!" }
            return resolve(ret);
        }

        variables.startTime()

        // -------------------------------------------
        // Loop through all the tests of the scenario
        // -------------------------------------------
        //for (const item of tests) {
        let loopInfo = []
        let loopID = -1
        let item = null
        variables.setVariable("$Error", "0");
        variables.setVariable("$UserID", data.userID);

        data.frameID = 0


        for (let index = 0; index < tests.length && !stopTest; index++) {


            // get the reference Emergency Stop
            ret = await getReference(variables, data.projectID, data.userID, 'Emergency Stop', '$EmergencyStop')
            if (ret.success == 1 && ret.value == 1) {
                await robot.evaluateFunction(page, variables, 'logfile', data, 'Error', 'Emergency Stop')
                ret = { success: 0, message: "Emergency Stop!", context: context, stop: 1 }
                return resolve(ret);
            }


            //tests[index].testCondition = variables.evaluateVariable(tests[index].testCondition)
            let myCondition = variables.evaluateVariable(tests[index].testCondition)

            // keep the record in the field item for a better visibility of the code 
            item = {
                testID: tests[index].testID, scenarioID: tests[index].scenarioID, scenario: tests[index].scenario,
                action: tests[index].action, comment: tests[index].comment,
                testCondition: myCondition, Condition: tests[index].testCondition, functionID: tests[index].functionID, functionName: tests[index].functionName,
                parameter1: tests[index].parameter1, parameter2: tests[index].parameter2, parameter3: tests[index].parameter3, parameter4: tests[index].parameter4,
                active: tests[index].active, position: tests[index].position,
            }

            variables.displayLog(1, 1, '=====>> Test: ', index + 1, item.action)
            //console.log ('ITEM: ', item)


            scenarioName = item.scenario

            if (!stopTest && item.active) {

                switch (item.action) {

                    case 'Loop':
                        if ((item.testCondition * 1) == 0) skipIT = 1 // avoid to enter in the loop if the condition is max loop is 0
                        if (skipIT || skipDescribe) {
                            variables.displayLog(1, 1, 'Skip the loop: ' + item.comment)
                            ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Skip', 'Skipped: [' + item.position + '] ' + item.comment)
                        } else {
                            if (index + 1 < tests.length) {
                                // Check if the Max Loop is correctly defined!
                                if (item.testCondition.substring(0, 5) == 'ERROR') {
                                    variables.displayLog(1, 1, 'Error in the loop cycle!')
                                    await robot.evaluateFunction(page, variables, 'logfile', data, 'Error', item.testCondition)
                                    ret = { success: 0, message: "Fatal Error in the loop cycle!" }
                                    return resolve(ret);
                                }
                                // store the loop info and the next step
                                loopID++;
                                loopInfo.push({
                                    index: index + 1, loop: 1, maxLoop: item.testCondition * 1,
                                    scenarioID: tests[index + 1].scenarioID, testID: tests[index + 1].testID,
                                    comment: item.comment
                                })
                                // define the identification
                                let identification = ''
                                let sep = ''
                                for (j = 0; j <= loopID; j++) {
                                    identification = identification + sep + loopInfo[j].loop
                                    sep = '.'
                                }
                                ret = await robot.evaluateFunction(page, variables, 'logfile', data, item.action, '[' + item.position + '] Loop: ' + identification + ' - ' + item.comment)

                                // for the first loop, we can use $Loop or $Loop1
                                if (loopID == 0) {
                                    variables.setVariable("$Loop", 1)
                                    variables.setVariable("$MaxLoop", loopInfo[loopID].maxLoop)
                                }
                                variables.setVariable("$Loop" + (loopID + 1), 1)
                                variables.setVariable("$MaxLoop" + (loopID + 1), loopInfo[loopID].maxLoop)
                                //variables.displayLog(1, 1, 'loopInfo: ', loopInfo, 'loopID: ', loopID)
                            }
                        }
                        break

                    case 'End Loop':
                        if (skipIT || skipDescribe) {
                            variables.displayLog(1, 1, 'Skip the step: End Loop: ' + item.comment)
                            ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Skip', 'Skipped: [' + item.position + '] End Loop: ' + item.comment)
                        } else {
                            // Check if a loop is in progress
                            if (loopID >= 0) {
                                // increase the loop
                                // Check if we are at the end of the loop
                                let loopFlag = 1
                                // while (loopID >= 0 && loopFlag) {
                                loopInfo[loopID].loop++
                                // set the $Loop variable; for the first loop, we can use $Loop or $Loop1
                                if (loopID == 0) variables.setVariable("$Loop", loopInfo[loopID].loop)
                                variables.setVariable("$Loop" + (loopID + 1), loopInfo[loopID].loop)

                                if (loopInfo[loopID].loop > loopInfo[loopID].maxLoop) {
                                    // Reset the current loop
                                    ret = await robot.evaluateFunction(page, variables, 'logfile', data, item.action, '[' + item.position + '] ' + item.comment)
                                    loopFlag = 1
                                    loopID--
                                    loopInfo.pop()
                                } else loopFlag = 0
                                // }
                                if (loopID >= 0 && !loopFlag) {
                                    // back to the begining of the loop
                                    index = loopInfo[loopID].index - 1
                                    let identification = ''
                                    let sep = ''
                                    for (j = 0; j <= loopID; j++) {
                                        identification = identification + sep + loopInfo[j].loop
                                        sep = '.'
                                    }
                                    ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Loop', '[' + item.position + '] ' + identification + ') ' + loopInfo[loopID].comment)
                                    break // exit the End loop
                                }
                            }
                        }

                        break

                    case 'Describe':
                        // Check if a loop is in progress
                        if (loopID >= 0) {
                            // increase the loop
                            // Check if we are at the end of the loop
                            let loopFlag = 1
                            while (loopID >= 0 && loopFlag) {
                                loopInfo[loopID].loop++
                                // set the $Loop variable; for the first loop, we can use $Loop or $Loop1
                                if (loopID == 0) variables.setVariable("$Loop", loopInfo[loopID].loop)
                                variables.setVariable("$Loop" + (loopID + 1), loopInfo[loopID].loop)

                                if (loopInfo[loopID].loop > loopInfo[loopID].maxLoop) {
                                    // Reset the current loop
                                    loopFlag = 1
                                    loopID--
                                    loopInfo.pop()
                                } else loopFlag = 0
                            }
                            if (loopID >= 0) {
                                // back to the begining of the loop
                                index = loopInfo[loopID].index - 1
                                let identification = ''
                                let sep = ''
                                for (j = 0; j <= loopID; j++) {
                                    identification = identification + sep + loopInfo[j].loop
                                    sep = '.'
                                }
                                ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Loop', '[' + item.position + '] ' + identification + ') ' + loopInfo[loopID].comment)
                                break // exit the describe
                            }
                        }

                        // In the Describe, the testCondition is used to store the Context
                        variables.displayLog(1, 1, '.... Describe: ' + item.testCondition + ' - ' + item.comment)
                        // Reset the skipIT flag
                        skipDescribe = 0
                        ret = await robot.evaluateFunction(page, variables, 'logfile', data, item.action, '[' + item.position + '] ' + item.comment)
                        variables.displayLog(2, 1, 'lastContext is: ', lastContext)
                        if (lastContext != null && lastContext != undefined && lastContext != '') {
                            variables.displayLog(1, 1, 'We have a previous context: ' + lastContext)
                            // We have a previous context, check if we are at the right place
                            if (item.testCondition != lastContext) {
                                // We are not at the right place, skip the describe
                                variables.displayLog(2, 1, 'We are not at the right place: ' + item.testCondition + ' <> ' + lastContext + ', skipDescribe!')
                                skipDescribe = 1
                                ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'info', 'Skip the context: ' + item.testCondition + ' to go to: ' + lastContext)
                            } else {
                                // Store the current context
                                variables.displayLog(2, 1, 'We are at the right place: ' + item.testCondition + ' == ' + lastContext)
                                context = item.testCondition
                                ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'info', 'Context= ' + context)
                            }
                        } else {
                            // Store the current context
                            variables.displayLog(2, 1, 'No lastContext, we can proceed with: ' + item.testCondition)
                            context = item.testCondition
                            if (context != '' && context != null)
                                ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'info', 'Context= ' + context)
                        }
                        break

                    case 'It':
                        variables.displayLog(1, 1, '.... It: ' + item.comment)
                        if (skipDescribe) {
                            variables.displayLog(1, 1, 'Skip the IT: ' + item.comment)
                            ret = await robot.evaluateFunction(page, variables, 'logfile', data, item.action, 'Skipped: [' + item.position + '] ' + item.comment)
                        } else {
                            ret = await robot.evaluateFunction(page, variables, 'logfile', data, item.action, '[' + item.position + '] ' + item.comment)
                        }
                        // Reset the skipIT flag    
                        skipIT = 0
                        break

                    case 'Step':
                        //variables.displayLog(1, 1, '===>  skipIt: ' + skipIT + ', skipDescribe: ' + skipDescribe)
                        if (skipIT || skipDescribe) {
                            variables.displayLog(1, 1, 'Skip the step: ' + item.comment)
                            ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Skip', 'Skipped: [' + item.position + '] ' + item.comment)
                        } else {

                            /* --------------------------------------------------------------------------- 
                            *  Return value:   success       stop    skipIt  skipDescribe StopAll
                            *                      1           0
                            *                      1           1        Yes (no error)
                            *                      1           2                Yes
                            *                      0           0        Yes (with error)  
                            *                      0           1                           Yes
                            * --------------------------------------------------------------------------- 
                            */

                            variables.displayLog(2, 1, '.... > Condition: ' + item.testCondition + ', ' + item.functionName + ' (' + item.parameter1 + ', ' + item.parameter2 + ', ' + item.parameter3 + ')')
                            ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Step', '[' + item.position + '] ' + item.comment)
                            // process the testCondition
                            let process = 0
                            // if testCondition is empty, ok tp processs the test 
                            if (item.testCondition == '' || item.testCondition == null || item.testCondition == undefined) {
                                lastCondition = ''
                                process = 1
                            } else if (item.testCondition.trim() == 'ELSE') {
                                // if testCondition is ELSE and no success previous condition, ok to process the test
                                if (lastCondition != 1) {
                                    process = 1
                                }
                            } else {
                                // evaluate the condition to see if we can process the test    
                                let expr = variables.evaluateVariable(item.testCondition)
                                if (expr == '<N/A>') {
                                    variables.displayLog(1, 1, '     Error in the evaluation of the variables of the test condition - (' + item.position + ') ' + item.testCondition)
                                    ret = { success: 0, message: 'Error in the evaluation of the variables of the test condition - (' + item.position + ') ' + item.testCondition, stop: 1 }
                                    process = -1
                                }
                                // Evaluate the condition expression
                                try {
                                    let condition = await eval(expr);
                                    if (condition) {
                                        lastCondition = condition
                                        process = 1
                                    } else process = 0
                                }
                                catch (err) {
                                    variables.displayLog(1, 1, '     Error in the evaluation of the test condition - (' + item.position + ') ' + item.testCondition)
                                    ret = { success: 0, message: 'Error in the evaluation of the test condition - (' + item.position + ') ' + item.testCondition, stop: 1 }
                                    await robot.evaluateFunction(page, variables, 'logfile', data, 'Error', err.message)
                                    process = -1
                                }
                            }
                            // Check if we can process the test (depending of the condition)
                            if (process == 1) {
                                ret = await robot.evaluateFunction(page, variables, item.functionName, data, item.parameter1, item.parameter2, item.parameter3, item.parameter4)
                            } else if (process == 0) {
                                variables.displayLog(1, 1, 'Skip the step due to the condition: ' + item.Condition + "' evaluated as  (" + item.testCondition + ')')
                                ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Skip', "Skipped due to Condition: '" + item.Condition + "' evaluated as  (" + item.testCondition + ')')
                            }

                            if (ret == undefined) {
                                variables.displayLog(1, 1, 'ret is undefined after the execution of the function: ' + item.functionName)
                            } else {
                                // In case of error
                                if (!ret.success) {
                                    if (ret.stop) {
                                        errorNb++
                                        if (ret.stop == 99 || ret.message.indexOf('Browser not responding') >= 0 || ret.message.indexOf('chrome not reachable') >= 0) fataError = 1
                                        //if (ret.message == 'Browser not responding!') fataError = 1
                                        console.log('###################   fatal error: ' + fataError)
                                        variables.displayLog(1, 1, '>>>>>>>>>>>>>>>>>   error: ' + errorNb + ' ' + item.functionName)
                                        await robot.evaluateFunction(page, variables, 'logfile', data, 'Error', ret.message)
                                        variables.displayLog(1, 1, "Skip all the tests for: " + item.comment + " Fatal Error: " + ret.message)
                                        // Take a print screen
                                        await robot.evaluateFunction(page, variables, 'printScreen', data, '0')
                                        // Set the skipIT and the stop flag
                                        skipIT = 1
                                        stopTest = 1
                                    } else {
                                        warningNb++
                                        ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Warning', ret.message)
                                        variables.displayLog(1, 1, "Skip all It steps for: " + item.comment + " Warning Error: " + ret.message)
                                        // Set the skipIT flag
                                        //skipIT = 1 24/09/2024
                                    }
                                    // in case of success
                                } else {
                                    if (ret.stop == 1) {
                                        warningNb++
                                        ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Warning', ret.message)
                                        variables.displayLog(1, 1, 'Skip the It: ' + item.functionName + " Warning: " + ret.message)
                                        // Set the skipIT flag
                                        skipIT = 1
                                    } else if (ret.stop == 2) {
                                        warningNb++
                                        ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Warning', ret.message)
                                        variables.displayLog(1, 1, 'Skip the Describe: ' + item.functionName + " Warning: " + ret.message)
                                        // Set the skipDescribe flag
                                        skipDescribe = 1
                                        // } else {
                                        //   variables.displayLog(1, 1, 'Execution of the function: ' + item.functionName + ' is OK')
                                    }
                                }
                            }
                            //variables.displayLog(1, 1, ret)
                        }
                        break

                    default:
                        variables.displayLog(1, 1, "I don't understand the action : " + item.action)
                        ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Error', "I don't understand the action : " + item.action)
                        ret = { success: 1, message: "I don't understand the action : " + item.action }
                        return resolve(ret);
                }
            }

            // if we reach the last test, check if there is a loop in progress
            //variables.displayLog(1, 1, '****** index: ', index, 'length: ', tests.length)
            if (index + 1 == tests.length) {
                //variables.displayLog(1, 1, 'We reach the end of the tests! LoopID', loopID)
                // Check if a loop is in progress
                if (loopID >= 0) {
                    //variables.displayLog(1, 1, 'We reach the end of the tests, but there is a loop in progress')
                    // Check if we are at the end of the loop
                    let loopFlag = 1
                    while (loopID >= 0 && loopFlag) {
                        // increase the loop
                        loopInfo[loopID].loop++
                        // set the $Loop variable; for the first loop, we can use $Loop or $Loop1
                        if (loopID == 0) variables.setVariable("$Loop", loopInfo[loopID].loop)
                        variables.setVariable("$Loop" + (loopID + 1), loopInfo[loopID].loop)

                        //variables.displayLog(1, 1, 'Increase the loop to ', loopInfo[loopID].loop)
                        if (loopInfo[loopID].loop > loopInfo[loopID].maxLoop) {
                            // Reset the current loop
                            loopFlag = 1
                            loopInfo[loopID].loop = 1
                            loopID--
                            //variables.displayLog(1, 1, 'We reach the end of the loop, decrease the loop id: ', loopID)
                        } else loopFlag = 0
                    }

                    //variables.displayLog(1, 1, 'Ready to back to the rule step if loopID >= 0: ', loopID)
                    if (loopID >= 0) {
                        // back to the begining step of the loop
                        index = loopInfo[loopID].index - 1
                        let identification = ''
                        let sep = ''
                        for (j = 0; j <= loopID; j++) {
                            identification = identification + sep + loopInfo[j].loop
                            sep = '.'
                        }
                        ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Loop', 'Loop: ' + identification + ' - ' + loopInfo[loopID].comment)
                        //variables.displayLog(1, 1, '<<<============ Back to the loop index: ', index)
                    }
                }
            }

        } // end for


        variables.endTime('$ElapsedTime')
        let info = '- Executed in $ElapsedTime second(s)'
        info = variables.evaluateVariable(info)
        info = info.replace(/'/g, "");

        variables.displayLog(1, 1, '_._._ End of the test...', ret)

        try {
            if (!fataError) {
                //console.log('try 1')
                ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '--------------------------------------')
                ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '- End of the test...')
                ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', info)
                ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '--------------------------------------')
                //console.log('try 2')

                if (errorNb > 0) {
                    // if (stopTest) {
                    ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Execute', "Fatal error, stop the tests after " + errorNb + " error(s) and " + warningNb + " warning(s)!")
                    ret = { success: 0, message: "Fatal error, stop the tests after " + errorNb + " error(s) and " + warningNb + " warning(s)!", context: context, stop: 1 }
                } else if (!warningNb) {
                    ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Execute', "Test successfully executed!")
                    ret = { success: 1, message: "Test successfully executed!", context: '', stop: 0 }
                } else {
                    ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Execute', "Test successfully executed with " + warningNb + " warning(s)!")
                    ret = { success: 1, message: "Test successfully executed with " + warningNb + " warning(s)!", context: '', stop: 0 }
                }
                await robot.evaluateFunction(page, variables, 'listVariable', data, '', '')
                variables.listVariable()
                return resolve(ret);

            } else {
                console.log('End of the test: Fatal error detected!')
                ret = { success: 0, message: "Browser not responding!", context: '', stop: 99 }
                return resolve(ret);
            }
            // console.log('try 1.1')
            // ret = { success: 1, message: "*** DEBUG ****", context: '', stop: 0 }
            // return resolve(ret);


        } catch (err) {
            console.log('Catch error: End of the test: Fatal error detected!')
            ret = { success: 0, message: "Browser not responding!", context: '', stop: 99 }
            return resolve(ret);
        }

    });

}



module.exports = {
    url: url,
    newTab: newTab,
    newWindow: newWindow,
    executeScenario: executeScenario,
    evaluateFunction: evaluateFunction,
    logfile: logfile,
    speaking: speaking,
    dictionary: dictionary,
    setReference: setReference,
    getReference: getReference,
    setFocus: setFocus,
    setValue: setValue,
    getValue: getValue,
    select: select,
    selectCount: selectCount,
    setVariable: setVariable,
    waitFor: waitFor,
    waitForNot: waitForNot,
    loginUser: loginUser,
    loginPassword: loginPassword,
    dummyExtraInfo: dummyExtraInfo,
    dummyLogin: dummyLogin,
    pause: pause,
    getData: getData,
    setData: setData,
    debug: debug,
    ask: ask,
    email: email,
    pressEscape: pressEscape,
    pressEnter: pressEnter,
    pressTab: pressTab,
    keyboard: keyboard,
    click: click,
    doubleClick: doubleClick,
    detectGUI: detectGUI,
    getUrl: getUrl,
    countElement: countElement,
    isExist: isExist,
    isCheck: isCheck,
    check: check,
    uncheck: uncheck,
    isEnable: isEnable,
    isVisible: isVisible,
    waitInvisible: waitInvisible,
    stopTest: stopTest,
    printScreen: printScreen,
    JSinput: JSinput,
    JSclick: JSclick,
    refreshURL: refreshURL,
    enable: enable,
    removeAttribute: removeAttribute,
    setAttribute: setAttribute,
    readAttribute: readAttribute,
    acceptPopup: acceptPopup,
    cancelPopup: cancelPopup,
    epoch: epoch,
    epochDate: epochDate,
    epochAddHour: epochAddHour,
    epochAddMinute: epochAddMinute,
    epochAddSecond: epochAddSecond,
    switchToFrame: switchToFrame,
    switchToBrowserTab: switchToBrowserTab,
    closeBrowserTab: closeBrowserTab,
    getTableData: getTableData,
    getTableHeader: getTableHeader,
    setTableData: setTableData,
    countTableRow: countTableRow,
    searchTableData: searchTableData,
    clickCell: clickCell,
    uploadFile: uploadFile,
    //isBrowserAlive: isBrowserAlive,
    skipIt: skipIt,
    skipDescribe: skipDescribe,
    executeRules: executeRules,
    callScenario: callScenario,
    callSuite: callSuite,
    startTimer: startTimer,
    stopTimer: stopTimer,
    promptAI: promptAI,

};
