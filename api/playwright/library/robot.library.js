const { By, Key, Keys, until } = require("selenium-webdriver")
let frameID = 0
let frameLocator = null
const BrowserMiddelware = require("../library/browser.library.js")
const { XMLParser } = require('fast-xml-parser');
let browserMiddelware = new BrowserMiddelware
let tabPage = []
let tabPageID = 0
let tabPageCurrent = 0
let imageResult = null


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   setBrowserMiddelware: store the browser middelware (it includes, the browser name, the device, the context...) in the global variable
*
* @param {object} browserMiddelwareOrigin: object
*
*/
async function setBrowserMiddelware(page, browserMiddelwareOrigin) {
    browserMiddelware = browserMiddelwareOrigin
    tabPage[0] = page
    tabPageID = 0
    tabPageCurrent = 0
    //console.log ('The browser name is', browserMiddelware.getBrowserName())
}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
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
 * @function
 *   nameVariable: replace all the $$variable by the evaluate of the $variable
 *
 * @param {string} myName Name of the variable.
 *
 */
async function nameVariable(variables, myName) {
    // Regex is used to capture the name after the $$
    const regex = /\$\$([a-zA-Z0-9]+)/g;

    if (myName == undefined) return myName
    if (!myName.includes("$$")) return myName


    return myName.replace(regex, (match) => {
        // 'match' contains the string (ex: "$$Loop")
        // On passe ce match directement à votre fonction existante
        //console.log(`Variable:  ${match}`);
        const newName = variables.evaluateVariable(match.replace("$$", "$"), true);
        //console.log(`Replace of ${match} par ${newName}`);
        return newName;
    });

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

    // replace $$name by the value of the variable $name
    variable = await nameVariable(variables, variable)

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

    code = variables.evaluateVariable(code, true)

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
 * @function <OK>
 *  askUserWithTimeout: Display the user interface for the ask popup
 * 
 * @param {object} page:            playwright page
 * @param {string} message:         message to prompt to the user
 * @param {string} defaultValue:    default value
 * @param {number} timeout:         timeout to close the popup automatically
 */

async function askUserWithTimeout(page, message, defaultValue, timeout) {

    const fs = require('fs');
    const path = require('path');

    let context = browserMiddelware.getContext()
    const popupPage = await context.newPage();
    // let image = "file:///" + process.cwd() + "/frontend/src/assets/RobotV2.png"
    //let image = "C:/Apache24/htdocs/robotv3/frontend/src/assets/RobotV2.png"
    // console.log('Image:', image)


    // Read and encode the image as base64
    const imagePath = path.join(process.cwd(), 'frontend/src/assets/RobotV2.png');
    let imageBase64 = '';

    try {
        const imageBuffer = fs.readFileSync(imagePath);
        const imageExt = path.extname(imagePath).toLowerCase();
        const mimeType = imageExt === '.png' ? 'image/png' : 'image/jpeg';
        imageBase64 = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
    } catch (error) {
        console.log('Could not load image:', error.message);
        // Fallback to a placeholder or continue without image
    }


    // C:/Apache24/htdocs/robotv3/frontend/src/assets/RobotV2.png

    await popupPage.setContent(`
    <html>
    <body style="background-color: #c6dfdaff;">
      <div id="popup" style="
        position: fixed;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border: 2px solid #333;
        padding: 20px;
        font-family: Arial;
        z-index: 9999;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        text-align: center;
      ">
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;background-color: #1abc9c;border-radius: 3rem;">
          ${imageBase64 ? `<img src="${imageBase64}" alt="Robot" style="width: 40px; height: 40px; margin-right: 10px;">` : ''}
          <h1 style="color: white; margin: 0;">Robot</h1>
        </div>
        <h2>${message}</h2>
        <input type="text" id="userInput" placeholder=${defaultValue} style="font-size: large;width: 300px; padding: 8px;"/>
        <br> <p style="margin-top: 10px; color: grey;">Enter a value and submit...</p>
        <br><br>
        <button onclick="submitValue()"
        style="padding: 0.6rem 1.3rem;background-color: #1abc9c;border: 2px solid black;font-size: large;
        color: white;line-height: 1;border-radius: 25px;outline: none;cursor: pointer;transition: 0.3s;
        margin: 1.3rem 0.5rem 0.5rem 0;">Submit</button>
        <p id="timer" style="margin-top: 10px; color: grey;"></p>
      </div>
      <script>
        let timer = ${timeout};
        const countdown = setInterval(() => {
          document.getElementById('timer').innerText = 
            timer > 0 ? 'Auto-submitting in ' + timer + 's...' : '';
          timer--;
          if (timer < 0) {
            clearInterval(countdown);
            submitValue(true);
          }
        }, 1000);

        function submitValue(isTimeout = false) {
          const input = document.getElementById('userInput').value;
          const userValue = isTimeout || input === '' ? '${defaultValue}' : input;
          window.userValue = userValue;
          //document.body.innerHTML = '<h2>Thank you! the value is: ' + userValue + '</h2>';
        }
      </script>
    </body>
    </html>
  `);

    // Wait for the user to input a value
    let userValue;
    for (let i = 0; i < timeout; i++) { // Check every second
        userValue = await popupPage.evaluate(() => window.userValue);
        if (userValue) break;
        await popupPage.waitForTimeout(1000);
    }

    await popupPage.close()
    return userValue || defaultValue;
}


/**
 * ---------------------------------------------------------------------------- 
 * @function <OK>
 *  ask: Ask the user to key a value
 * 
 * @param {object} page:        playwright page
 * @param {object} variables:   array of all the variables
 * @param {string} myMessage:   message to prompt to the user
 * @param {string} myDefault:   default value
 * @param {string} myVariable:  name of the variable to store the value
 * @param {number} myTimeout:   timeout to close the popup automatically
 */
async function ask(page, variables, message, defaultValue, myVariable, myTimeout) {

    let value = defaultValue
    //console.log ('CWD',  process.cwd())
    await askUserWithTimeout(page, message, defaultValue, myTimeout).then(userValue => {
        console.log('User value is:', userValue);
        value = userValue
        variables.setVariable(myVariable, userValue);
    });

    return { success: 1, message: 'Ask OK', value: value, stop: 0 }
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
    myEmailTo = variables.evaluateVariable(myEmailTo, true);
    mySubject = variables.evaluateVariable(mySubject, true);
    mySubject = mySubject.replace(/<BR>/g, "\n");
    mySubject = mySubject.replace(/&quot/g, '"');
    myBody = variables.evaluateVariable(myBody, true);
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

        myAttachment = variables.evaluateVariable(myAttachment, true);
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

    condition = variables.evaluateVariable(condition, false)
    //condition = condition.replace(/'/g, "");    
    message = variables.evaluateVariable(message, true)

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
 * @function <OK>
 *  CloseBrowserTab:  Close the last tab of the browser
 *  
 * @param {object} page:         playwright page
 * 
 */
// async function closeBrowserTab(page) {

//     const pages = await page.context().pages(); // Get all pages (tabs/windows)
//     const pageCount = pages.length;

//     if (pageCount > 1) {
//         const lastPage = pages[pageCount - 1]; // Get the last page
//         await lastPage.close(); // Close the last page
//         const previousPage = pages[pageCount - 2] || pages[0]; // Switch to the previous page or the first if it was the second tab
//         await previousPage.bringToFront(); // Bring the previous page to the front
//         return { success: 1, message: 'Closed the browser tab and returned to the previous one', stop: 0 };
//     } else {
//         return { success: 0, message: 'No extra tab open in the browser!', stop: 0 };
//     }

// }


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
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

    frameId--
    const allframes = await page.frames()
    if (frameId > allframes.length) {
        return { success: 0, message: "switchToFrame: Invalid frameID (max frame(s) is " + allframes.length + "!", stop: 1 }
    }

    if (frameId < 0) {
        return { success: 0, message: "switchToFrame: Invalid frameID (must be greater than zero)!", stop: 1 }
    }


    let url = allframes[frameId].url()
    if (url != undefined && url != '') {
        frameID = frameId
        frameLocator = await page.frame({ url: url })
        return { success: 1, message: "switchToFrame: " + (frameID + 1) + " OK!", stop: 0 }
    } else {
        return { success: 0, message: "switchToFrame: Invalid URL for the frameID " + (frameID + 1) + "!", stop: 1 }
    }
}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   getElement: get html element by xpath or by css
*
* @param {object} page:         playwright page
* @param {object} variables:    array of all the variables
* @param {object} data:         all the parameters
* @param {string} tag:          tag of the element
* @param {string} functionName: name of the function (for debugging purpose)
*
*/
async function getElement(page, variables, data, tag, functionName) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");
    const { getReferenceByCode } = require("../../reference/reference.service.js");
    const { getDatasetByCode } = require("../../dataset/dataset.service.js");
    const { Left } = require("./string.library.js");

    console.log('getElement', functionName)

    // Get the current timeout (default is 30 seconds)
    let dataAPI
    let timeout = 30
    dataAPI = { projectID: data.projectID, userID: data.userID, code: 'TimeOut' }
    const ref = await getReferenceByCode(dataAPI);
    if (ref.length) {
        if (ref[0].label != '<N/A>') {
            timeout = ref[0].label * 1
        }
    }
    page.setDefaultTimeout(timeout * 1000)


    if (tag == undefined) {
        console.log(functionName + "::getElement: tag cannot be empty!")
        return { success: 0, message: functionName + "::getElement: tag cannot be empty!", stop: 1 }
    }
    else if (tag == '$GUI') tag = await variables.getVariable('$GUI')
    else {

        if (tag[0] == '#') {
            console.log('Data set used')
            tag = variables.evaluateVariable(tag, true)
            dataAPI = { subprojectID: data.subprojectID, code: tag, language: '*', active: 1 }
            const result = await getDatasetByCode(dataAPI);
            if (result.length) {
                tag = result[0].label
            } else {
                variables.displayLog(1, 1, 'Data not found in the dataset!')
                return { success: 0, message: "Cannot find the code: " + tag + " in the dataset!", stop: 1 }
            }
        }

        console.log('*******' + tag + '*********')

        if (tag[0] == '@') {
            console.log('Dictionary set used')
            // Search the tag in the dictionary
            tag = variables.evaluateVariable(tag, true)
            dataAPI = { projectID: data.projectID, code: tag, language: '*', active: 1 }
            const result = await getDictionaryByCode(dataAPI);
            if (result.length) {
                tag = result[0].label
                tag = variables.evaluateVariable(tag)
                console.log("Find the code: " + tag)
            } else {
                console.log(functionName + "::getElement: Cannot find the code: " + tag)
                variables.displayLog(1, 1, 'Data not found in the dictionary!')
                return { success: 0, message: functionName + "::getElement: Cannot find the code: " + tag + " in the dictionary!", stop: 1 }
            }
        }
    }

    // detect the position (if any)
    let myOccurence = 0;
    if (tag[0] == "(" && tag[1] != '/') {
        // tag contains the occurence (in the case of non unique identifier)
        let j = tag.indexOf(')', 0);
        myOccurence = tag.substring(1, j);
        if (Left(myOccurence, 4) != 'LAST') {
            if (Left(myOccurence, 1) == '$') {
                myOccurence = variables.evaluateVariable(myOccurence);
            }
            myOccurence--;
        }
        tag = tag.substring(j + 1);
    }
    console.log('myOccurence', myOccurence)
    // remove the first and the last character if it's a quote
    if (tag[0] == "'") {
        tag = tag.substring(1, tag.length)
    }
    if (tag.substring(tag.length, tag.length - 1) == "'") {
        tag = tag.substring(0, tag.length - 1)
    }

    console.log('*******' + tag + '*********')

    // Check if the element is found in the current page
    let locator = null
    try {
        // If frame was previously detected, reuse it
        if (frameID == 0) {
            console.log('Try without frames')
            if (myOccurence == 'LAST') {
                await page.locator(tag).last().waitFor()
                locator = page.locator(tag).last()
            }
            else {
                await page.locator(tag).nth(myOccurence).waitFor()
                locator = page.locator(tag).nth(myOccurence)
            }
            console.log('Element detected!')
            return { success: 1, message: functionName + "::getElement: element detected on the page", page: page, tag: tag, locator: locator, occurence: myOccurence, frameID: 0, stop: 0 }
        }
        else {
            console.log('try with the previous frame: ' + frameID)
            if (myOccurence == 'LAST') {
                await frameLocator.locator(tag).last().waitFor()
                locator = frameLocator.locator(tag).last()
            }
            else {
                await frameLocator.locator(tag).nth(myOccurence).waitFor()
                locator = frameLocator.locator(tag).nth(myOccurence)
            }
            console.log('Element detected!')
            return { success: 1, message: functionName + "::getElement: element detected on the page", page: frameLocator, tag: tag, locator: locator, occurence: myOccurence, frameID: (frameID + 1), stop: 0 }
        }

    } catch (err) {

        // The page is already refreshed, we don't need to wait so long
        page.setDefaultTimeout(1000) // 1 second

        if (frameID > 0) {
            try {
                // Retry without frame
                if (myOccurence == 'LAST') {
                    await page.locator(tag).last().waitFor()
                    locator = page.locator(tag).last()
                }
                else {
                    await page.locator(tag).nth(myOccurence).waitFor()
                    locator = page.locator(tag).nth(myOccurence)
                }
                frameID = 0
                frameLocator = null
                page.setDefaultTimeout(timeout * 1000)
                return { success: 1, message: functionName + "::getElement: element detected without frame: ", page: page, tag: tag, locator: locator, occurence: myOccurence, frameID: 0, stop: 0 }

            } catch (err) {
                // nothing to do
            }
        }

        // Check all the frames (if any)
        const allframes = await page.frames()
        let frame
        console.log('Try with frame(s) - Number of frames:', allframes.length)
        for (i = 0; i < allframes.length; i++) {
            let url = allframes[i].url()
            if (url != undefined && url != '') {
                //console.log('url: ' + i, url)
                // Try with this frame
                frame = await page.frame({ url: url })
                try {
                    await frame.locator(tag).last().waitFor()

                    if (myOccurence == 'LAST') {
                        await frame.locator(tag).last().waitFor()
                        locator = frame.locator(tag).last()
                    }
                    else {
                        await frame.locator(tag).nth(myOccurence).waitFor()
                        locator = frame.locator(tag).nth(myOccurence)
                    }

                    console.log('find in the frame: ' + i)
                    frameID = i
                    frameLocator = frame
                    // restore the original timeout
                    page.setDefaultTimeout(timeout * 1000)
                    return { success: 1, message: functionName + "::getElement: element detected on the frame: " + i, page: frame, tag: tag, locator: locator, occurence: myOccurence, frameID: (frameID + 1), stop: 0 }

                } catch (err) {
                    //console.log('not found for the frame: ' + i)
                }
            }
        }
        // restore the original timeout
        page.setDefaultTimeout(timeout * 1000)
        console.log(functionName + "::getElement: Cannot find element: " + tag + "!")
        return { success: 0, message: functionName + "::getElement: Cannot find the element: " + (myOccurence + 1) + ", tag: " + tag + "!", stop: 1 }

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
* @param {number} tag:          tag of the element to be checked
* @param {string} variable:     name of the variable to store the number of elements
* @param {number} action:       action in case element is not found: continue (0) or stop all the tests (1) or skip the It (2)
*
*/
async function countElement(page, data, variables, tag, variable, action) {

    let ret

    ret = await getElement(page, variables, data, tag, 'countElement')

    try {
        if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }
        let page1 = ret.page
        let locator = ret.locator
        tag = ret.tag

        //await locator.waitFor()
        const count = await locator.count()
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

        ret = { success: 0, message: 'countElement KO', stop: 0 }
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
* @function <OK>
*   detectGUI: Detect an element on a webpage (based on a pattern generated by Artificial Intelligence)
* @param {object} page:        playwright page
* @param {object} variables:   array of all the variables
* @param {object} data:        all the parameters
* @param {number} selectorID:  id of the selector in the pattern.json
* @param {string} myCriteria:  criteria to identify the element (a label for instance)
* @param {number} myPosition:  [Optional] position of the element (starting by 1)
* @param {number} stopOnError:   [Optional] 1: Error if not found, otherwise just a warning
*/


async function detectGUI(page, variables, data, selectorID, myCriteria, myPosition, stopOnError) {
    const { Left, Right } = require("./string.library.js");
    const { getDatasetByCode } = require("../../dataset/dataset.service.js");
    const { getPatternsByCode } = require("../../pattern/pattern.service.js");
    const { getParametersByCode } = require("../../parameter/parameter.service.js");
    const { getReferenceByCode } = require("../../reference/reference.service.js");

    let dataAPI = {}
    let ret = {}
    let detectID = 0
    let Patterns = []
    let AIRoot = ''
    let delay = 3       // default delay = 3 sec
    let locators
    let count = 0


    // Search the text in the dataset 
    if (myCriteria[0] == '#') {
        myCriteria = variables.evaluateVariable(myCriteria, true)
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

    if (stopOnError == undefined || stopOnError == "" || stopOnError == 0) {
        stopOnError = 0
    } else stopOnError = 1


    variables.displayLog(1, 1, 'detectGUI (' + selectorID + ', ' + myCriteria + ', ' + myPosition)


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


    //let timeout = 0.1
    dataAPI = { projectID: data.projectID, userID: data.userID, code: 'TimeOut' }
    const reference4 = await getReferenceByCode(dataAPI);
    if (reference4.length) {
        if (reference4[0].label != '<N/A>') {
            timeout = reference4[0].label * 1
        }
    }
    console.log('TimeOut: ' + timeout)
    page.setDefaultTimeout(timeout * 1000)

    try {
        locators = page.locator(AIRoot)
        await locators.last().waitFor()
        count = await locators.count()
        console.log('count: ' + count)

        if (count == 0) {
            console.log("Error: Cannot Detect the GUI pattern!, count = 0")
            if (stopOnError) return { success: 0, message: "Error: Cannot Detect the GUI pattern!", stop: 1 }
            else return { success: 0, message: "Warning: Cannot Detect the GUI pattern!", stop: 0 }
        }

    } catch (err) {
        console.log("Error: Cannot Detect the GUI pattern! Catch error!", err.message)
        if (stopOnError) return { success: 0, message: "Error: Cannot Detect the GUI pattern!", stop: 1 }
        else return { success: 0, message: "Warning: Cannot Detect the GUI pattern!", stop: 0 }
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
            console.log('process position 1a: myXpath= ' + myXpath);
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
            console.log('process position 2a: myXpath= ' + myXpath);
            variables.displayLog(1, 3, 'process position 2b: mySearchXpath ' + mySearchXpath);
        }

        let mycustomXpath = mySearchXpath.replace(/&sol;/g, '/');
        //variables.displayLog(1, 3, 'detectGUI: xpath:' + mycustomXpath);
        console.log('detectGUI: xpath:' + mycustomXpath)

        try {
            locators = page.locator(mycustomXpath)
            await locators.last().waitFor()
            count = await locators.count()
        } catch (err) {
            count = 0
        }

        if (!count) {
            // Pattern not found, reset the score to 0
            console.log("No element detected for the pattern: " + myId)
            variables.displayLog(1, 3, "No element detected for the pattern: " + myId);
            variables.displayLog(1, 3, 'xpath:' + mycustomXpath);
            PatternCandidate.push({ xPath: mySearchXpath, id: myId, score: 0 });
        } else {
            console.log("One Element detected for the pattern: " + myId)
            variables.displayLog(1, 3, "One Element detected for the pattern: " + myId);
            found = 1;
            // Compute the distance, the deepest, the farthest


            myDistance = await computeGUIDistanceV2(myPath);
            variables.displayLog(1, 3, 'myDistance: ' + myDistance + ', myPath: ' + myPath)

            try {

                let myIsEnabled = await locators.first().isEnabled()
                if (myIsEnabled) myIsEnabled = 'true'
                else myIsEnabled = 'false'
                let myDisabled = !myIsEnabled
                let myClass = await locators.first().evaluate(el => el.className);
                if (myClass == undefined) myClass = '';
                variables.displayLog(1, 4, " myIsEnabled: " + myIsEnabled + " myDisabled: " + myDisabled.toString() + " Class: " + myClass.toString().toLowerCase());
                if (myIsEnabled == false || myDisabled.toString() == 'true' || myClass.toString().toLowerCase().indexOf('disabled', 0) >= 0) {
                    variables.displayLog(1, 4, " Element is disabled - Pattern " + myId);
                    disabledField = 5
                } else {
                    disabledField = 0
                }

            } catch (err) {
                // Pattern not found, reset the score to 0
                variables.displayLog(1, 3, "No element detected for the pattern: " + myId);
                variables.displayLog(1, 3, 'xpath:' + mycustomXpath);
                PatternCandidate.push({ xPath: mySearchXpath, id: myId, score: 0 });
            }


            // Check the matching of the value
            myPosition = variables.evaluateVariable(myPosition);
            let exactMatch = await checkExactMatch(variables, locators, myCriteria);
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
            if (stopOnError > 1) {
                variables.displayMsg("> ERROR - No way to detect a valid pattern for <" + selectorName + "> with the criteria <" + myCriteria + "> Position:" + myPosition + ") - Skipping all tests!");
                variables.setVariable("$exitTest", 1);
            } else {
                variables.displayMsg("> WARNING - No way to detect a valid pattern for <" + selectorName + "> with the criteria <" + myCriteria + "> Position:" + myPosition);
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
                if (stopOnError > 1) {
                    variables.displayMsg("> ERROR - Ambiguous patterns detected: " + PatternCandidate[0].id + " and " + PatternCandidate[1].id + " for <" + selectorName + "> with the criteria <" + myCriteria + "> Position:" + myPosition + ") - Skipping all tests!");
                    variables.setVariable("$GUI", "ERROR");
                    return { success: 0, message: "Error! Ambiguous patterns detected for <" + selectorName + "> with the criteria <" + myCriteria + ">", stop: 1 }
                } else {
                    variables.displayMsg("> WARNING - Ambiguous patterns detected: " + PatternCandidate[0].id + " and " + PatternCandidate[1].id + " for <" + selectorName + "> with the criteria <" + myCriteria + "> Position:" + myPosition);
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
        variables.displayLog(1, 2, 'detectGUI (' + selectorName + ', ' + myCriteria + ', ' + myPosition + ') = OK - Pattern = ' + PatternCandidate[0].id + ' Score = ' + PatternCandidate[0].score);
        variables.displayLog(1, 2, ' detectedGUI: $GUI =' + myResult);
    } else {
        // Wait for timeout second(s)
        try {
            await page.waitForTimeout(delay * 1000);
        } catch (err) {
            return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
        }
    }

    if (found == 0) {
        // Timeout stop all the tests    
        if (stopOnError > 1) {
            variables.displayMsg("> Timeout in detectGUI: (" + selectorName + ', ' + myCriteria + ', ' + myPosition + ") - Skipping all tests!");
            variables.setVariable("$exitTest", 1);
            variables.setVariable("$Error", "1");
            variables.setVariable("$GUI", "ERROR");
            // Element not found!
            return { success: 0, message: "Error! Detect GUI not ok", stop: 1 }

        } else {
            variables.displayMsg("> detectGUI: Warning: No way to detect: " + selectorName + ', ' + myCriteria + ', ' + myPosition);
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
* @function <OK>
*  checkExactMatch: Check attribute of the GUI Element
* 
* @param {object} variables:    array of all the variables
* @param {string} locators:     object with the element information
* @param {string} myCriteria:   criteria to detect an element
*/

async function checkExactMatch(variables, locators, myCriteria) {

    // ---------------------------------------------------------------
    // Check on the value
    // ---------------------------------------------------------------
    let exactMatch = 0
    let myValue = await locators.first().textContent();
    variables.displayLog(1, 3, "checkExactMatch - getText: " + myValue);
    if (myValue == '' || myValue == undefined) {
        myValue = await locators.first().evaluate(el => el.value);
        variables.displayLog(1, 3, "checkExactMatch - value: " + myValue);
        if (myValue == '' || myValue == undefined) {
            myValue = await locators.first().evaluate(el => el.placeholder);
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
* @param {object} page:         playwright page (overwritten by the array of tab page)
* @param {object} variables:    array of all the variables
* @param {object} data:         all the parameters
* @param {string} link:         link to the wepage
*
*/
async function url(page, variables, data, link) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");
    const { getDatasetByCode } = require("../../dataset/dataset.service.js");
    let ret

    // evaluate the link
    link = variables.evaluateVariable(link)
    if (link.length > 0) {
        link = link.replace(/'/g, "");
    }
    if (link[0] == '#') {
        console.log('Data set used')
        dataAPI = { subprojectID: data.subprojectID, code: link, language: '*', active: 1 }
        const result = await getDatasetByCode(dataAPI);
        if (result.length) {
            link = result[0].label
        } else {
            variables.displayLog(1, 1, 'Data not found in the dataset!')
            return { success: 0, message: "Cannot find the code: " + link + " in the dataset!", stop: 1 }
        }
    }
    // Search the text in the dictionary 
    if (link[0] == '@') {
        console.log('Dictionary set used')
        const dataAPI = { projectID: data.projectID, code: link, language: '*', active: 1 }
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
        //page = tabPage[tabPageCurrent]
        //variables.displayLog(1, 1, 'Driver: ', driver)
        console.log('*******' + link + '*********')

        await page.goto(link)
        variables.setVariable("$URLError", "0");
        return { success: 1, message: 'Url OK', value: link, stop: 0 }
    } catch (err) {
        //console.log (err)
        if (err.message.includes('ERR_CERT_AUTHORITY_INVALID')) {
            console.error("Invalid certificate: ERR_CERT_AUTHORITY_INVALID");
            await page.waitForTimeout(2000);
            variables.displayLog(1, 1, "----- **** URL = Error: ERR_CERT_AUTHORITY_INVALID")
            variables.displayLog(1, 1, err.message)
            variables.setVariable("$URLError", "1");
            return { success: 1, message: "ERR_CERT_AUTHORITY_INVALID", value: link, stop: 0 }
        } else {
            variables.displayLog(1, 1, "----- **** URL = Error: ", err.message)
            variables.displayLog(1, 1, err.message)
            variables.setVariable("$URLError", "1");
            return { success: 0, message: err.message, stop: 1 }
        }
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

    // replace $$name by the value of the variable $name
    myVariable = await nameVariable(variables, myVariable)


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
* @function <OK>
*  getUrlTitle:  Get the title of current URL and store it into the variable
* 
* @param {object} page:         playwright page
* @param {object} variables:    array of all the variables
* @param {string} myVariable:   name of the variable  
*
*/
async function getUrlTitle(page, variables, myVariable) {
    console.log('getUrlTitle...................')

    // replace $$name by the value of the variable $name
    myVariable = await nameVariable(variables, myVariable)

    try {
        const title = await page.title();
        variables.setVariable(myVariable, title)
        return { success: 1, message: "getUrlTitle Ok!", value: title, stop: 0 }
    } catch (err) {
        return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
    }

}


/**
* ---------------------------------------------------------------------------- 
* @function <TBR>
*  openNewTab:  Open a new tab and switch to it 
* 
* @param {object} variables:   array of all the variables
* @param {object} data:        all the parameters
* @param {string} url:         link to the wepage
*
*/
async function openNewTab(variables, data, url) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");

    // evaluate the url
    url = variables.evaluateVariable(url)
    if (url.length > 0) {
        url = url.replace(/'/g, "");
    }


    // Search the text in the dictionary 
    if (url[0] == '@') {
        const dataAPI = { projectID: data.projectID, code: url, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            url = result[0].label
            //console.log (url)
        } else {
            variables.displayLog(1, 1, 'Data not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + url + " in the dictionary!", stop: 1 }
        }
    }

    try {
        const context = browserMiddelware.getContext()
        const newTab = await context.newPage(); // opens a new tab
        await newTab.goto(url);
        tabPage[++tabPageID] = newTab // tabPage and tabPageID are global
        tabPageCurrent = tabPageID
        return { success: 1, message: "openNewTab Ok!", stop: 0 }
    } catch (err) {
        return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
    }
}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*  clickNewTab:  Open a new tab and switch to it 
* 
* @param {object} page:         playwright page
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {string} tag:          tag element
*
*/
async function clickNewTab(page, data, variables, tag) {

    let ret = 0

    // get the context
    let context = browserMiddelware.getContext()

    // Listen for the new page (tab) to open
    const [newPage] = await Promise.all([
        context.waitForEvent('page'), // Waits for a new tab/page to open
        // Click on the button
        click(page, data, variables, tag, 1, 0)
    ]);

    // Wait for the new page to load
    await newPage.waitForLoadState();
    //console.log('New tab opened with URL:', newPage.url());

    // store the new page
    tabPage[++tabPageID] = newPage
    tabPageCurrent = tabPageID

}

/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*  switchTab:  switch to a specific tab 
* 
*/
async function switchTab(tabID) {
    if (tabID == 0) {
        // Switch to the last tab
        tabID = tabPage.length
    }
    tabID--
    if (tabID > tabPageID || tabPage[tabID] == null) {
        console.log('switchTab: closing original or already closed tab!')
        return { success: 1, message: "switchTab Ok!", stop: 0 } // closing original or already closed tab
    }
    tabPageCurrent = tabID
    let tab = tabPage[tabPageCurrent]
    await tab.bringToFront(); // Bring the specific tab   
    console.log('switchTab', tabID)
    await tab.waitForTimeout(2 * 1000);
    return { success: 1, message: "switchTab Ok!", stop: 0 }
}

/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*  closeTab:  Close the current tab and back to the first one 
* 
*/
async function closeTab() {
    if (tabPageCurrent == 0 || tabPage[tabPageCurrent] == null) {
        console.log('closeTab: closing original or already closed tab!')
        return { success: 1, message: "closeTab Ok!", stop: 0 } // closing original or already closed tab
    }
    let tab = tabPage[tabPageCurrent]
    tab.close()
    tabPage[tabPageCurrent] = null
    tabPageCurrent = 0
    tab = tabPage[tabPageCurrent]
    await tab.bringToFront(); // Bring the first tab

    return { success: 1, message: "closeTab Ok!", stop: 0 }
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
    const { getDatasetByCode } = require("../../dataset/dataset.service.js");
    let ret
    let user = ''
    let delay = 0


    variables.displayLog(1, 2, 'Dummy user: ' + dummyUser)


    // Evaluate the dummyUser
    if (dummyUser == undefined) {
        return { success: 0, message: "LoginUser: dummyUser cannot be empty!", stop: 1 }
    } else {
        dummyUser = variables.evaluateVariable(dummyUser, true)
    }

    if (dummyUser == '<ME>') {
        dummyUser = data.userName
        variables.displayLog(1, 3, 'ME Dummy user: ' + dummyUser)

    } else if (dummyUser[0] == '#') {
        // Evaluate the dataset (if any)
        const dataAPI = { subprojectID: data.subprojectID, code: dummyUser, language: '*', active: 1 }
        const result = await getDatasetByCode(dataAPI);
        if (result.length) {
            dummyUser = result[0].label
        } else {
            variables.displayLog(1, 1, 'Data not found in the dataset! - dummyUser: ' + dummyUser)
            return { success: 0, message: "Cannot find the code: " + dummyUser + " in the dataset!", stop: 1 }
        }
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
    const { getDatasetByCode } = require("../../dataset/dataset.service.js");
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
        } else if (dummyUser[0] == '#') {
            // Evaluate the dataset (if any)
            const dataAPI = { subprojectID: data.subprojectID, code: dummyUser, language: '*', active: 1 }
            const result = await getDatasetByCode(dataAPI);
            if (result.length) {
                dummyUser = result[0].label
            } else {
                variables.displayLog(1, 1, 'Data not found in the dataset! - dummyUser: ' + dummyUser)
                return { success: 0, message: "Cannot find the code: " + dummyUser + " in the dataset!", stop: 1 }
            }
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

    // replace $$name by the value of the variable $name
    variable = await nameVariable(variables, variable)


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

    // replace $$name by the value of the variable $name
    variable = await nameVariable(variables, variable)


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
            delay = variables.evaluateVariable(delay, true)
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
    const { getReferenceByCode } = require("../../reference/reference.service.js");
    let timeout = 30 // 30 seconds by default
    let ret


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
        ret = await getElement(page, variables, data, tagElement, 'waitFor')
        page.setDefaultTimeout(timeout * 1000) // Back to the original timeout

        if (ret.success) {
            ret.message = "waitFor OK"
            return ret
        }
        else {
            variables.setVariable('$Error', "1")
            if (action == undefined) action = 0
            // action: 0 = continue, 1 = stop all the tests, 2 = skip the It
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
    catch (err) {
        page.setDefaultTimeout(timeout * 1000) // Back to the original timeout
        console.log('waitFor error............')
        variables.setVariable('$Error', "1")
        if (action == undefined) action = 0
        // action: 0 = continue, 1 = stop all the tests, 2 = skip the It
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
*   waitForNot: check if an element is not available (not working with frame/iFrame)
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

    try {

        let ret

        if (delay == undefined) delay = 0
        else delay = delay * 1000


        // Evaluate the value
        if (value == undefined) {
            value = ''
        } else {
            value = variables.evaluateVariable(value, true)
        }

        // Evaluate special keywords like <TODAY>, <TODAY+1>.... (if any)
        value = variables.dataValue(value)

        value = variables.evaluateVariable(value, true)

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
                value = variables.evaluateVariable(value, true)
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


        ret = await getElement(page, variables, data, tag, 'click')
        if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }
        let page1 = ret.page
        let locator = ret.locator
        tag = ret.tag


        // Special clear when the normal function doesn't work!
        if (value.indexOf('<CLEAR>', 0) >= 0 || value.indexOf('<CLEAN>', 0) >= 0) {
            value = value.replace('<CLEAR>', '')
            value = value.replace('<CLEAN>', '')
            variables.displayLog(1, 1, '---- Clear field')
            await page1.keyboard.down('Control'); // Press and hold Control key
            await page1.keyboard.press('a');       // Press 'a' key
            await page1.keyboard.up('Control');   // Release Control key
            await page1.keyboard.press('Backspace'); // Press Backspace key
        }
        if (value.indexOf('<ENTER>', 0) >= 0) {
            value = value.replace('<ENTER>', '')
            await locator.fill(value)
            variables.displayLog(1, 1, '----' + value.trim() + '(' + value.trim().length + ')---- Press Enter')
            if (delay != undefined && delay > 0) await page1.waitForTimeout(delay * 1000);
            await page1.keyboard.sendCharacter('\r'); // ASCI 10
            await page1.keyboard.sendCharacter('\n'); // ASCI 13"
        } else if (value.indexOf('<TAB>', 0) >= 0) {
            value = value.replace('<TAB>', '')
            await locator.fill(value)
            if (delay != undefined && delay > 0) await page1.waitForTimeout(delay * 1000);
            await page1.keyboard.sendCharacter('\t'); // ASCI 9
        } else {
            await locator.fill(value)
            if (delay != undefined && delay > 0) await page1.waitForTimeout(delay * 1000);
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
    let ret

    ret = await getElement(page, variables, data, tag, 'getValue')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }

    // replace $$name by the value of the variable $name
    variableName = await nameVariable(variables, variableName)

    // Get the element for the tag
    try {
        let page1 = ret.page
        let locator = ret.locator
        tag = ret.tag
        let text = await locator.textContent()
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
*   select: select a value from a list of options (becareful it's case sensitive)
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
    let ret
    const { getDatasetByCode } = require("../../dataset/dataset.service.js");

    // Evaluate the value
    if (value == undefined) {
        value = ''
    } else {
        value = variables.evaluateVariable(value, true)
    }

    // Evaluate special keywords like <TODAY>, <TODAY+1>.... (if any)
    value = variables.dataValue(value)
    value = variables.evaluateVariable(value, true)
    value = value.trim()

    // Evaluate the dataset (if any)
    if (value[0] == '#') {
        const dataAPI = { subprojectID: data.subprojectID, code: value, language: '*', active: 1 }
        const result = await getDatasetByCode(dataAPI);
        if (result.length) {
            value = result[0].label
            // Evaluate special keywords like <TODAY>, <TODAY+1>.... (if any)
            value = variables.dataValue(value)
            value = variables.evaluateVariable(value, true)
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

    ret = await getElement(page, variables, data, tag, 'select')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }


    try {
        // tag = variables.evaluateVariable(tag)
        let page1 = ret.page
        let locator = ret.locator
        tag = ret.tag
        await locator.selectOption(value)

        if (delay != undefined && delay != 0) await page1.waitForTimeout(delay * 1000);

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

    let ret

    ret = await getElement(page, variables, data, tag, 'selectCount')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }

    // replace $$name by the value of the variable $name
    variable = await nameVariable(variables, variable)


    try {
        //tag = variables.evaluateVariable(tag)
        let page1 = ret.page
        let locator = ret.locator
        tag = ret.tag
        //await page1.locator(tag).last().waitFor()

        let tagElement = tag + '/option'
        const count = await page1.locator(tagElement).count()
        // store the size into the variable
        variables.setVariable(variable, count)

        return { success: 1, message: "selectCount Ok!", value: count, stop: 0 }

    } catch (err) {
        return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
    }

}



/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   uploadFile: Upload a file from the repository uploads of your project
*
* @param {object} page:            playwright page
* @param {object} data:            all the parameters
* @param {object} variables:       array of all the variables
* @param {string} tag:             tag to the element
* @param {string} fileName:        name of the file to upload
*
*/
async function uploadFile(page, data, variables, tag, fileName) {
    const { getProjectById } = require("../../project/project.service.js")
    const { getDatasetByCode } = require("../../dataset/dataset.service.js");
    const { fileExist } = require("./file.library")
    const path = require('path')
    let ret
    let projectName
    let locators

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
    fileName = variables.evaluateVariable(fileName, true);

    // Evaluate the dataset (if any)
    if (fileName[0] == '#') {
        const dataAPI = { subprojectID: data.subprojectID, code: fileName, language: '*', active: 1 }
        const result = await getDatasetByCode(dataAPI);
        if (result.length) {
            fileName = result[0].label
            fileName = variables.evaluateVariable(fileName, true)
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

    ret = await getElement(page, variables, data, tag, 'uploadFile')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }
    let page1 = ret.page
    tag = ret.tag

    // Get the element for the tag
    try {
        locators = page1.locator(tag)
        await locators.last().waitFor()
        count = await locators.count()
        if (count == 0) {
            variables.displayLog(1, 2, '>>>>> Warning: Tag not found! - tag: ' + tag)
            variables.displayLog(1, 2, ret)
            return { success: 0, message: "uploadFile: Cannot detect the element ! " + tag, stop: 1 }
        }

    } catch (err) {
        variables.displayLog(1, 2, '>>>>> Warning: Tag not found! - tag: ' + tag)
        variables.displayLog(1, 2, ret)
        return { success: 0, message: "uploadFile: Cannot detect the element ! " + tag, stop: 1 }
    }


    try {
        let locator = locators.first()
        const elementHandle = await locator.elementHandle()
        await page1.evaluate(element => { element.scrollIntoView() }, elementHandle)
        await page1.evaluate(element => { element.style.display = 'inline'; element.style.height = '1px'; element.style.width = '1px'; element.style.opacity = 1; }, elementHandle)
        await locator.fill(fullName)
        ret = { success: 1, message: "uploadFile OK", value: fullName, stop: 0 }
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
    let ret

    ret = await getElement(page, variables, data, tag, 'setFocus')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }

    try {
        let page1 = ret.page
        tag = ret
        const locator = ret.locator
        const elementHandle = await locator.elementHandle()
        await page1.evaluate(element => { element.scrollIntoView(); }, elementHandle)

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
* @param {object} page:         playwright page
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {string} tagElement:   tag element
* @param {number} delay:        delay after the click (in seconds)
* @param {number} focus:        1: set the focus on the element, otherwise no focus (default value)
*
*/
async function click(page, data, variables, tag, delay, focus) {
    let ret

    // Override the page with the current tab
    ret = await getElement(page, variables, data, tag, 'click')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }
    //console.log('after call getElement ', ret.success)

    try {
        let page1 = ret.page
        let locator = ret.locator
        tag = ret.tag

        if (focus == undefined) focus = 0
        if (focus == 1) {
            // Set the focus on the element
            console.log('Set the focus on the element')
            const elementHandle = await locator.elementHandle()
            await page1.evaluate(element => { element.scrollIntoView() }, elementHandle)
        } else console.log('No focus on the element')

        // Click on the element
        await locator.click()
        if (delay != undefined) {
            delay = variables.evaluateVariable(delay)
            console.log('Delay:', delay)
            await page.waitForTimeout(delay * 1000);
        }
        return { success: 1, message: "click ok!", frameID: ret.frameID, stop: 0 }
    } catch (err) {
        return { success: 1, message: 'Fatal Error: ' + err.message, stop: 0 }
    }

}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   doubleClick: double click on an element
*
* @param {object} page:         playwright page
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {string} tag:          tag element
* @param {number} delay:        delay after the click (in seconds)
*
*/

async function doubleClick(page, data, variables, tag, delay) {
    let ret

    ret = await getElement(page, variables, data, tag, 'doubleClick')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }

    try {
        let page1 = ret.page
        let locator = ret.locator
        tag = ret.tag
        await locator.doubleClick()
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
    let ret

    ret = await getElement(page, variables, data, tag, 'JSclick')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }


    try {
        let page1 = ret.page
        let locator = ret.locator
        tag = ret.tag
        const elementHandle = await locator.elementHandle()
        await page1.evaluate(element => { element.scrollIntoView(); }, elementHandle)
        await page1.evaluate(element => { element.click(); }, elementHandle)

        if (delay != undefined) {
            delay = variables.evaluateVariable(delay)
            // console.log('Delay:', delay)
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

    // replace $$name by the value of the variable $name
    variable = await nameVariable(variables, variable)


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
    tagElement = variables.evaluateVariable(tagElement)

    row = variables.evaluateVariable(row, true);
    row = row * 1; // convert to number
    column = variables.evaluateVariable(column, true);
    column = column * 1; // convert to number


    if (tagElement[0] == "'") tagElement = tagElement.slice(1, -1)
    tagElement = tagElement + '/tbody/tr[' + row + ']/td[' + column + ']'

    ret = await getElement(page, variables, data, tagElement, 'getTableData')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }

    let page1 = ret.page
    let locator = ret.locator
    tagElement = ret.tag

    try {
        let myValue = await locator.textContent()
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

    // replace $$name by the value of the variable $name
    variable = await nameVariable(variables, variable)


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
    tagElement = variables.evaluateVariable(tagElement)


    row = variables.evaluateVariable(row, true);
    row = row * 1; // convert to number
    column = variables.evaluateVariable(column, true);
    column = column * 1; // convert to number


    if (tagElement[0] == "'") tagElement = tagElement.slice(1, -1)
    tagElement = tagElement + '/tbody/tr[' + row + ']/th[' + column + ']'

    ret = await getElement(page, variables, data, tagElement, 'getTableHeader')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }

    let page1 = ret.page
    let locator = ret.locator
    tagElement = ret.tag

    try {
        let myValue = await locator.textContent()
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
async function setTableData(page, data, variables, tagElement, row, column, value) {
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
    tagElement = variables.evaluateVariable(tagElement)

    row = variables.evaluateVariable(row, true);
    row = row * 1; // convert to number
    column = variables.evaluateVariable(column, true);
    column = column * 1; // convert to number

    // Evaluate the value
    if (value == undefined) {
        value = ''
    } else {
        value = variables.evaluateVariable(value, true)
    }

    // Evaluate special keywords like <TODAY>, <TODAY+1>.... (if any)
    value = variables.dataValue(value)


    // Evaluate the dataset (if any)
    if (value[0] == '#') {
        value = variables.evaluateVariable(value, true)
        const dataAPI = { subprojectID: data.subprojectID, code: value, language: '*', active: 1 }
        const result = await getDatasetByCode(dataAPI);
        if (result.length) {
            value = result[0].label
            // Evaluate special keywords like <TODAY>, <TODAY+1>.... (if any)
            value = variables.dataValue(value)
            value = variables.evaluateVariable(value, true)
        } else {
            variables.displayLog(1, 1, 'Data not found in the dataset! - value: ' + value)
            return { success: 0, message: "Cannot find the code: " + value + " in the dataset!", stop: 1 }
        }
    }


    tagElement2 = tagElement + '/tbody/tr[' + row + ']/td[' + column + ']/descendant::input[1]'

    ret = await getElement(page, variables, data, tagElement2, 'setTableData')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }
    let page1 = ret.page
    let locator = ret.locator
    tagElement2 = ret.tag

    try {
        await locator.click()
        if (value.indexOf('<ENTER>', 0) >= 0) {
            value = value.replace('<ENTER>', '')
            await locator.fill(value)
            variables.displayLog(1, 1, '     ----- Press Enter')
            await page1.keyboard.sendCharacter('\r'); // ASCI 10
            await page1.keyboard.sendCharacter('\n'); // ASCI 13"
        } else if (value.indexOf('<TAB>', 0) >= 0) {
            value = value.replace('<TAB>', '')
            await locator.fill(value)
            await page1.keyboard.sendCharacter('\t'); // ASCI 9"
        } else {
            await locator.fill(value)
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
    let ret

    // replace $$name by the value of the variable $name
    variable = await nameVariable(variables, variable)


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
    tagElement = variables.evaluateVariable(tagElement)

    if (tagElement[0] == "'") tagElement = tagElement.slice(1, -1)
    tagElement = tagElement + '/tbody/tr'

    ret = await getElement(page, variables, data, tagElement, 'countTableRow')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }

    let page1 = ret.page
    let locator = ret.locator
    tagElement = ret.tag

    try {
        const count = await locator.count()
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
* @function <elementOK>
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
    tagElement = variables.evaluateVariable(tagElement)

    let variable = '$Row'
    column = variables.evaluateVariable(column, true);
    column = column * 1; // convert to number
    search = variables.evaluateVariable(search, true);
    if (position == undefined) position = '1'
    position = variables.evaluateVariable(position, true);
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

    //const locators = page.locator(tagElement)
    ret = await getElement(page, variables, data, tagElement, 'searchTableData')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }

    let page1 = ret.page
    tagElement = ret.tag

    const locators = page1.locator(tagElement)

    //await locators.last().waitFor()
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
    tagElement = variables.evaluateVariable(tagElement)


    row = variables.evaluateVariable(row, true);
    row = row * 1; // convert to number
    column = variables.evaluateVariable(column, true);
    column = column * 1; // convert to number

    tagElement = tagElement + '/tbody/tr[' + row + ']/td[' + column + ']'


    ret = await getElement(page, variables, data, tagElement, 'clickCell')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }

    let page1 = ret.page
    let locator = ret.locator
    tagElement = tagElement.tag


    try {
        await locator.click()
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
    let ret

    ret = await getElement(page, variables, data, tag, 'enable')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }

    let page1 = ret.page
    let locator = ret.locator
    tag = ret.tag

    try {
        const elementHandle = await locator.elementHandle()
        await page1.evaluate(element => { element.removeAttribute('disabled'); }, elementHandle)
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
    let ret

    ret = await getElement(page, variables, data, tag, 'removeAttribute')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }
    let page1 = ret.page
    let locator = ret.locator
    tag = ret.tag

    try {
        const elementHandle = await locator.elementHandle()

        await page1.evaluate(
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
    let ret

    ret = await getElement(page, variables, data, tag, 'setAttribute')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }

    let page1 = ret.page
    let locator = ret.locator
    tag = ret.tag

    try {
        // Set the attribute
        //const locator = await page1.locator(tag).first()

        let myValue2 = await locator.getAttribute(attribute);
        if (myValue2 == undefined) myValue = '<EMPTY>'
        console.log('Attribute before the update is: ' + myValue2)

        const elementHandle = await locator.elementHandle();
        await page1.evaluate(
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
    let ret

    ret = await getElement(page, variables, data, tag, 'readAttribute')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }

    let page1 = ret.page
    let locator = ret.locator
    tag = ret.tag

    // replace $$name by the value of the variable $name
    variableName = await nameVariable(variables, variableName)

    try {
        // Read the attribute
        let myValue = await locator.getAttribute(attribute);
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
*   popupKeys: Execute a powershell process to sent keys to a windows popup
*
* @param {object} page:           playwright page
* @param {object} data:           all the parameters
* @param {object} variables:      array of all the variables
* @param {string} windowTitle:    title of the windows popup
* @param {string} sendkeys:       keys to send to the popup (E.g: "{TAB}{TAB}{TAB}{TAB}{TAB}{ENTER}")
*
*/
async function popupKeys(page, data, variables, windowTitle, sendkeys) {

    console.log('**** popupKeys *****')

    try {
        const { execSync } = require("child_process");

        console.log('popupKeys on the popup ' + windowTitle)


        const psScript = `
    $wshell = New-Object -ComObject WScript.Shell;
    if ($wshell.AppActivate("${windowTitle}")) {
        Sleep 1;
        $wshell.SendKeys('${sendkeys}');
    }
  `;

        console.log(psScript)
        execSync(`powershell -Command "${psScript}"`);
        console.log('popupKeys OK!')

        return { success: 1, message: 'popupKeys OK!', stop: 0 }
    } catch (err) {
        console.log('popupKeys Error', err)
        return { success: 0, message: 'popupKeys Error: ' + err.message, stop: 1 }
    }

}




/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   showAllPopups: Execute a powershell process to display all the popup titles
*
* @param {object} page:           playwright page
* @param {object} data:           all the parameters
* @param {object} variables:      array of all the variables
*
*/
async function showAllPopups(page, data, variables) {

    const { execSync } = require("child_process");
    const command = `powershell "Get-Process | Where-Object { $_.MainWindowTitle } | Select-Object MainWindowTitle | Format-Table -HideTableHeaders"`;
    //const command = `powershell "Get-Process | Where-Object {$_.MainWindowHandle -ne 0} | Select-Object MainWindowTitle"`;

    try {
        //const output = execSync(command).toString();
        const output = execSync(command, { encoding: 'utf-8' })
        console.log("--- Popup Windows ---");
        console.log(output.trim());
        console.log("---------------------------------");
        console.log('showAllPopups OK!')

        if (!output.trim()) {
            console.log('No popup windows detected')
            return { success: 1, message: 'showAllPopups is empty!', stop: 0 }
        }

        const titles = output
            .split(/\r?\n/)          // Split by line (Windows or Unix)
            .map(t => t.trim())      // remove spaces
            .filter(t => t.length > 0); // Remove empty lines

        // Use Set to remove duplicates 
        // const allWindows = [...new Set(titles)];

        const allWindows = titles

        allWindows.forEach((title, index) => {
            logfile(data.userID, 'Info', `${index + 1}: ${title}`);
        });

        return { success: 1, message: 'showAllPopups OK!', stop: 0 }

    } catch (error) {
        console.error("showAllPopups Error:", error);
        return { success: 0, message: 'showAllPopups Error: ' + error.message, stop: 1 }
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
    const { getReferenceByCode } = require("../../reference/reference.service.js");

    let timeout = 30 // 30 seconds by default
    let ret

    // replace $$name by the value of the variable $name
    variableName = await nameVariable(variables, variableName)

    ret = await getElement(page, variables, data, tag, 'isExist')
    if (!ret.success) {
        if (variableName != undefined && variableName != '') variables.setVariable(variableName, isExist)
        return { success: 1, message: "isExist KO!", value: 0, stop: 0 }
    }
    let page1 = ret.page
    let locator = ret.locator
    tag = ret.tag

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
        await locator.waitFor()
        page.setDefaultTimeout(timeout * 1000) // Back to the original timeout

        let isExist = await locator.isVisible()
        console.log('Visible:', isExist)
        console.log('isExist Variable name: ' + variableName)

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
    const { getReferenceByCode } = require("../../reference/reference.service.js");

    let ret
    let timeout = 30 // 30 seconds by default

    // replace $$name by the value of the variable $name
    variableName = await nameVariable(variables, variableName)

    ret = await getElement(page, variables, data, tag, 'isCheck')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }

    let page1 = ret.page
    let locator = ret.locator
    tag = ret.tag

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
        await locator.waitFor()
        page.setDefaultTimeout(timeout * 1000) // Back to the original timeout

        let isChecked = await locator.isChecked()

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
    const { getReferenceByCode } = require("../../reference/reference.service.js");

    let ret
    let timeout = 30 // 30 seconds by default

    // replace $$name by the value of the variable $name
    variableName = await nameVariable(variables, variableName)

    ret = await getElement(page, variables, data, tag, 'isEnable')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }

    let page1 = ret.page
    let locator = ret.locator
    tag = ret.tag

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
        await locator.waitFor()
        page.setDefaultTimeout(timeout * 1000) // Back to the original timeout

        let isEnabled = await locator.isEnabled()

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
    const { getReferenceByCode } = require("../../reference/reference.service.js");

    let ret
    let timeout = 30 // 30 seconds by default

    ret = await getElement(page, variables, data, tag, 'click')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }

    // replace $$name by the value of the variable $name
    variableName = await nameVariable(variables, variableName)

    let page1 = ret.page
    let locator = ret.locator
    tag = ret.tag

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
        await locator.waitFor()
        page.setDefaultTimeout(timeout * 1000) // Back to the original timeout

        let isVisible = await locator.isVisible()

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
async function waitInvisible(page, data, variables, tagElement, delay, action) {
    const { getReferenceByCode } = require("../../reference/reference.service.js");

    let timeout = 30 // 30 seconds by default
    let ret

    ret = await getElement(page, variables, data, tagElement, 'waitInvisible')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }

    let page1 = ret.page
    let locator = ret.locator
    tagElement = ret.tag

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

async function check(page, data, variables, tag, delay) {
    let ret

    ret = await getElement(page, variables, data, tag, 'check')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }

    let page1 = ret.page
    let locator = ret.locator
    tag = ret.tag

    try {
        //tag = variables.evaluateVariable(tag)
        await locator.check()
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
    let ret

    ret = await getElement(page, variables, data, tag, 'uncheck')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }

    let page1 = ret.page
    let locator = ret.locator
    tag = ret.tag

    try {
        //tag = variables.evaluateVariable(tag)
        await locator.uncheck()
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
            text = variables.evaluateVariable(text, true)
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

    myText = myText.replace(/'/g, "");
    const say = require('say');
    let ret

    //console.log ('Speaking: ', myText)

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
        //console.log ('getReference - projectID: ' +  projectID + ', userID: ' + userID + ', code: ' +  code + ', variable: ' +  variableName)
        //console.log('debug: getReference')
        code = variables.evaluateVariable(code)
        if (code.length > 0) {
            code = code.replace(/'/g, "");
        }

        // replace $$name by the value of the variable $name
        variableName = await nameVariable(variables, variableName)

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
            //console.log ('variableName', variableName)
            if (variableName != undefined) {
                // store the label into the variable
                variables.setVariable(variableName, label)
            }
            ret = { success: 1, message: "Reference for '" + code + "' : '" + label + "'", value: label, id: referenceID, stop: 0 }
            return ret
        }
    }
    catch (err) {
        variables.displayLog(1, 1, 'getReference: Fatal error: ' + err.message)
        return { success: 0, message: err.message, stop: 1 }
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

        ret = await getReference(variables, projectID, userID, code)

        if (ret.success == 1) {
            // We found a reference, we can update it
            data = { code: code, label: label, comment: comment, active: 1, projectID: projectID, userID: userID, referenceID: ret.id }
            result = await updateReference(data);
            if (!result.affectedRows) {
                ret = { success: 0, message: 'Internal Error in the update after a successfull getReference with code: ' + code, stop: 0 }
            } else {
                ret = { success: 1, message: "Reference: '" + code + "': '" + label + "' updated!", stop: 0 }
            }
        } else {
            // Create a new reference
            data = { projectID: projectID, userID: userID, code: code, label: label, comment: comment, position: '99999', active: 1 }
            result = await createReference(data);
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

    // replace $$name by the value of the variable $name
    variable = await nameVariable(variables, variable)


    code = variables.evaluateVariable(code, true)

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
    let ret

    ret = await getElement(page, variables, data, tag, 'JSinput')
    if (!ret.success) return { success: 0, message: 'Fatal Error: ' + ret.message, stop: 1 }

    let page1 = ret.page
    let locator = ret.locator
    tag = ret.tag

    try {
        //tag = variables.evaluateVariable(tag)

        // Set the attribute value
        //const locator = await page1.locator(tag).first()

        const elementHandle = await locator.elementHandle();
        await page1.evaluate(element => { element.scrollIntoView(); }, elementHandle)
        await page1.evaluate(
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
 * @param {boolean} fullPage:   1 = true or 0 = false
 *  
 */
async function printScreen(page, data, slotID, fullPage) {

    try {
        let picture = './printscreen/' + data.userID + '_image' + slotID + '.png'
        //console.log('printScreen', picture)
        if (fullPage == undefined || fullPage == 0) fullPage = false
        else fullPage = true
        //console.log ('path: ', picture)
        //console.log ('full page:', fullPage)
        await page.screenshot({ path: picture, fullPage: fullPage })
        return { success: 1, message: 'Printscreen OK', slot: slotID, stop: 0 }
    } catch (err) {
        console.log('printScreen Error', err.message)
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

    // replace $$name by the value of the variable $name
    variable = await nameVariable(variables, variable)

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

    // replace $$name by the value of the variable $name
    variable = await nameVariable(variables, variable)

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

    // replace $$name by the value of the variable $name
    variable = await nameVariable(variables, variable)


    myDate = variables.evaluateVariable(myDate, true)

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

    // replace $$name by the value of the variable $name
    variable = await nameVariable(variables, variable)

    myDate = variables.evaluateVariable(myDate, true)

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

    // replace $$name by the value of the variable $name
    variable = await nameVariable(variables, variable)

    myDate = variables.evaluateVariable(myDate, true)

    let myUnit = 's'
    let myEpoch = await timeEpochAdd(myDate, myFormat, myValue, myUnit)
    variables.setVariable(variable, myEpoch)

    return { success: 1, message: "epochAddSecond Ok!", value: myEpoch, stop: 0 }
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
        console.log('Error in the rule', err)
        variables.displayLog(1, 1, 'executeRules: Fatal error: Browser not responding!')
        return { success: 0, message: ret.message, stop: 1 }
    }

}

/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*  startTimer:  Store a user time to measure performance
* 
* @param {object} data:       all the parameters
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
async function stopTimer(data, page, variables, space, topic) {
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
    variables.setVariable('$Timer' + topic.charAt(0).toUpperCase() + topic.slice(1), Math.round(elapsedTime))

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
* @function
*  postData:  Fetches data from a REST API using the POST method. 
* 
* @param {object} variables:    array of all the variables
* @param {string} url           The URL of the REST API endpoint.
* @param {string} parameters    A string containing the parameters to be sent in the request body.
*                               The string should contain a valid JSON object as it will be parsed.
* @param {string} key:          (only for certificate) private key.* 
*
* @returns {Promise<any>}       A Promise that resolves with the response data (parsed as JSON) if successful,
*                               or rejects with an error if the request fails.
* @throws {Error}               If the parameters string is not a valid JSON object.
* 
*/
async function postData(data, variables, url, parameters, token, key) {

    const { getProjectById } = require("../../project/project.service.js");
    const { fileExist } = require("./file.library");
    const path = require('path');
    const fs = require('fs');
    const https = require('https');
    const axios = require("axios");

    console.log('postData', url)
    console.log('postData', parameters)
    console.log('token', token)

    try {

        // Get the file extension
        let fileExtension = '<N/A>'
        if (token != null) fileExtension = token.split('.').pop().toLowerCase();

        if (fileExtension == 'p12') {
            // Use .p12 certificate (it must be uploaded on the server)
            // ---------------------------------------------------------
            console.log('Working with a certificate .p12')

            //Resolve Project Path
            const projectResult = await getProjectById(data.projectID);
            if (!projectResult.length) throw new Error(`postData: Cannot find project: ${data.projectID}`);

            const projectName = projectResult[0].project;
            const pathName = `../../../uploads/${data.projectID}_${projectName}/`;
            const certificatePath = path.join(__dirname, pathName + token);

            if (!(await fileExist(certificatePath))) {
                throw new Error(`postData: Certificate file not found: ${certificatePath}`);
            }


            const agent = new https.Agent({
                pfx: fs.readFileSync(certificatePath),
                passphrase: key,
                rejectUnauthorized: false,
                // Server only supports TLS 1.2
                minVersion: "TLSv1.2",
                maxVersion: "TLSv1.2",
                // ECDSA cipher used by the server
                ciphers: "ECDHE-ECDSA-AES256-GCM-SHA384",
                honorCipherOrder: true,
            });

            const response = await axios.post(url,
                JSON.stringify(parsedParameters), // Body of the POST
                {
                    httpsAgent: agent,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("STATUS:", response.status);
            console.log("BODY:", response.data);
            return response.data;

        } else {
            // No certificate used
            // -------------------            
            // Attempt to parse the parameters string into a JSON object.
            let parsedParameters;
            try {
                parsedParameters = JSON.parse(parameters);
            } catch (parseError) {
                throw new Error("Invalid parameters format.  Must be a valid JSON string."); // Throw error if parsing fails
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Specify that we're sending JSON
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify(parsedParameters) // Convert the parameters to a JSON string
            });

            if (!response.ok) {
                // Handle HTTP errors (e.g., 404, 500)
                throw new Error(`HTTP httpPost error! Status: ${response.status}`);
            }

            console.log('status', response.status)
            await logfile(data.userID, 'Info', 'status: ' + response.status)
            variables.setVariable('$HttpStatus', response.status)


            const httpData = await response.json(); // Parse the response body as JSON
            return httpData;
        }


    } catch (error) {
        // Handle any errors that occurred during the fetch or parsing process
        console.error("Error during POST request:", error);
        throw error; // Re-throw the error to allow the caller to handle it
    }
}



/**
* ---------------------------------------------------------------------------- 
* @function
*  httpPost:  Fetches data from a REST API using the POST method
* 
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {string} apiUrl        The URL of the REST API endpoint.
* @param {string} paramsString  A string containing the parameters to be sent in the request body.
*                               The string should contain a valid JSON object as it will be parsed or the name of a dataset header.
* @param {string} key:          (only for certificate) private key.
* @param {string} code:         (optional) code to store httpdata.
*
* @returns {object} httpResult  A global variable to store the http result
*
*/
async function httpPost(data, variables, apiUrl, paramsString, token, key, code) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");
    const { getDatasetByCode } = require("../../dataset/dataset.service.js");

    // Reset httpResult
    httpResult = null


    // Check if the code is expressed in a valid dictionary format
    if (apiUrl[0] == '@') {
        const dataAPI = { projectID: data.projectID, code: apiUrl, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            apiUrl = result[0].label
        } else {
            return { success: 0, message: "Cannot find the url: " + url + " in the dictiona ry", stop: 1 }
        }
    }

    apiUrl = variables.evaluateVariable(apiUrl)
    apiUrl = apiUrl.replace(/'/g, "");



    console.log('Token: ' + token)
    if (token != undefined && token != 'N/A') {
        token = variables.evaluateVariable(token)
        token = token.replace(/'/g, "");
    } else token = null
    console.log('Token: ' + token)


    if (key != undefined && key != 'N/A' && key != '<N/A>') {
        key = variables.evaluateVariable(key, true)

        if (key[0] == '#') {
            // Get the private key of the certificate ---        
            const dataAPI = { subprojectID: data.subprojectID, code: key, language: '*', active: 1 }
            const result = await getDatasetByCode(dataAPI);
            if (result.length) {
                key = result[0].label
            } else {
                variables.displayLog(1, 1, 'Data not found in the dataset for: ' + key + "!")
                return { success: 0, message: "Cannot find the code: " + key + " in the dataset!", stop: 1 }
            }
        }
    } else key = null



    // Search the text in the dataset 
    if (paramsString[0] == '#') {
        paramsString = variables.evaluateVariable(paramsString, true)
        dataAPI = { subprojectID: data.subprojectID, code: paramsString, language: '*', active: 1 }
        const result = await getDatasetByCode(dataAPI);
        if (result.length) {
            paramsString = result[0].label
        } else {
            variables.displayLog(1, 1, 'Data not found in the dataset! - ' + paramsString)
            return { success: 0, message: "Cannot find the code: " + paramsString + " in the dataset!", stop: 1 }
        }
    }


    paramsString = variables.evaluateVariable(paramsString)
    // remove the first and the last character if it's a quote
    if (paramsString[0] == "'") {
        paramsString = paramsString.substring(1, paramsString.length)
    }
    if (paramsString.substring(paramsString.length, paramsString.length - 1) == "'") {
        paramsString = paramsString.substring(0, paramsString.length - 1)
    }
    paramsString = paramsString.replace(/'/g, '"')
    paramsString = paramsString.replace(/<br>/g, '')
    console.log('paramsString', paramsString)



    try {
        httpResult = await postData(data, variables, apiUrl, paramsString, token, key);
        console.log("Success:", httpResult);
        // --- STEP 4: STORE OR UPDATE the txResult ---
        code = variables.evaluateVariable(code, true)
        if (code == undefined || code == '<N/A>') code = 'httpPost'

        let ret = await Store_HttpData(data, code, httpResult)
        if (ret.success == 1) {
            return { success: 1, message: "httpPost: OK!", stop: 0 };
        } else {
            return { success: 0, message: "httpPost: Store_HttpData Error!", stop: 1 };
        }

    } catch (error) {
        console.error("Error in httpPost:", error);
        return { success: 0, message: "Error in httpPost", stop: 1 }
    }

}



/**
* ---------------------------------------------------------------------------- 
* @function
*  puttData:  Fetches data from a REST API using the PUT method. 
* 
* @param {object} variables:    array of all the variables
* @param {string} url           The URL of the REST API endpoint.
* @param {string} parameters    A string containing the parameters to be sent in the request body.
*                               The string should contain a valid JSON object as it will be parsed.
* @returns {Promise<any>}       A Promise that resolves with the response data (parsed as JSON) if successful,
*                               or rejects with an error if the request fails.
* @throws {Error}               If the parameters string is not a valid JSON object.
* 
*/
async function putData(data, variables, url, parameters, token) {

    console.log('puttData', url)
    console.log('putData', parameters)
    console.log('token', token)

    try {
        // Attempt to parse the parameters string into a JSON object.
        let parsedParameters;
        try {
            parsedParameters = JSON.parse(parameters);
        } catch (parseError) {
            throw new Error("Invalid parameters format.  Must be a valid JSON string."); // Throw error if parsing fails
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Specify that we're sending JSON
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify(parsedParameters) // Convert the parameters to a JSON string
        });

        if (!response.ok) {
            // Handle HTTP errors (e.g., 404, 500)
            throw new Error(`HTTP httpPut error! Status: ${response.status}`);
        }

        console.log('status', response.status)
        await logfile(data.userID, 'Info', 'status: ' + response.status)
        variables.setVariable('$HttpStatus', response.status)


        const httpData = await response.json(); // Parse the response body as JSON
        return httpData;

    } catch (error) {
        // Handle any errors that occurred during the fetch or parsing process
        console.error("Error during PUT request:", error);
        throw error; // Re-throw the error to allow the caller to handle it
    }
}



/**
* ---------------------------------------------------------------------------- 
* @function
*  httpPut:  Fetches data from a REST API using the PUT method
* 
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {string} apiUrl        The URL of the REST API endpoint.
* @param {string} paramsString  A string containing the parameters to be sent in the request body.
*                               The string should contain a valid JSON object as it will be parsed.
* @param {string} code:         (optional) code to store httpdata.
*
* @returns {object} httpResult  A global variable to store the http result
*
*/
async function httpPut(data, variables, apiUrl, paramsString, token, code) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");

    // Reset httpResult
    httpResult = null


    // Check if the code is expressed in a valid dictionary format
    if (apiUrl[0] == '@') {
        const dataAPI = { projectID: data.projectID, code: apiUrl, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            apiUrl = result[0].label
        } else {
            return { success: 0, message: "Cannot find the url: " + url + " in the dictionary!", stop: 1 }
        }
    }

    apiUrl = variables.evaluateVariable(apiUrl)
    apiUrl = apiUrl.replace(/'/g, "");



    console.log('Token: ' + token)
    if (token != undefined && token != 'N/A') {
        token = variables.evaluateVariable(token)
        token = token.replace(/'/g, "");
    } else token = null
    console.log('Token: ' + token)


    paramsString = variables.evaluateVariable(paramsString)
    // remove the first and the last character if it's a quote
    if (paramsString[0] == "'") {
        paramsString = paramsString.substring(1, paramsString.length)
    }
    if (paramsString.substring(paramsString.length, paramsString.length - 1) == "'") {
        paramsString = paramsString.substring(0, paramsString.length - 1)
    }

    code = variables.evaluateVariable(code, true)
    if (code == undefined || code == '<N/A>') code = 'httpPut'

    try {
        httpResult = await putData(data, variables, apiUrl, paramsString, token);
        console.log("Success:", httpResult);
        // --- STEP 4: STORE OR UPDATE the txResult ---
        let ret = await Store_HttpData(data, code, httpResult)
        if (ret.success == 1) {
            return { success: 1, message: "httpPut: OK!", stop: 0 };
        } else {
            return { success: 0, message: "httpPut: Store_HttpData Error!", stop: 1 };
        }

    } catch (error) {
        console.error("Error in httpPut:", error);
        return { success: 0, message: "Error in httpPut", stop: 1 }
    }

    //return { success: 1, message: "httpPut: OK", stop: 0 }
}




/**
 * fetchData: Fetches data from a REST API using the GET method.
 *
 * @param {object} data:         all the parameters
 * @param {object} variables:    array of all the variables
 * @param {string} url:          The URL of the REST API endpoint.
 * @param {string} token:        The token to use for the security.
 * @param {string} key:          (only for certificate) private key.* 
 * 
 * @returns {Promise<any>} A promise that resolves with the fetched data (parsed as JSON) or rejects with an error.
 *
 */
async function fetchData(data, variables, url, token, key) {
    const { getProjectById } = require("../../project/project.service.js");
    const { fileExist } = require("./file.library");
    const path = require('path');
    const fs = require('fs');
    const https = require('https');
    const axios = require("axios");


    try {

        // Get the file extension
        let fileExtension = '<N/A>'
        if (token != null) fileExtension = token.split('.').pop().toLowerCase();


        if (fileExtension == 'pem') {
            console.log('Working with a certificate .pem')
            // Use .pem certificate (it must be uploaded on the server)
            // ---------------------------------------------------------
            //Resolve Project Path
            const projectResult = await getProjectById(data.projectID);
            if (!projectResult.length) throw new Error(`SAML: Cannot find project: ${data.projectID}`);

            const projectName = projectResult[0].project;
            const pathName = `../../../uploads/${data.projectID}_${projectName}/`;
            const certificatePath = path.join(__dirname, pathName + token);

            if (!(await fileExist(certificatePath))) {
                throw new Error(`fetchData: Certificate file not found: ${certificatePath}`);
            }

            const certificateKeyPath = certificatePath.replace('-cert', '-key');
            if (!(await fileExist(certificateKeyPath))) {
                throw new Error(`fetchData: Key file not found: ${certificateKeyPath}`);
            }


            const tls = require("tls");

            const agent = new https.Agent({
                cert: fs.readFileSync(certificatePath),
                key: fs.readFileSync(certificateKeyPath),
                rejectUnauthorized: false,
                // Force exact TLS version the server supports
                minVersion: "TLSv1.2",
                maxVersion: "TLSv1.2",
                // Force ECDSA signature algorithms (server requires this)
                sigalgs: "ecdsa_secp256r1_sha256",
                // Force cipher suite used by the server
                ciphers: "ECDHE-ECDSA-AES256-GCM-SHA384",
                // Required for compatibility with older servers
                honorCipherOrder: true
            })

            const response = await axios.get(url,
                { httpsAgent: agent }
            );

            console.log("STATUS:", response.status);
            console.log("BODY:", response.data);

            await logfile(data.userID, 'Info', 'status: ' + response.status)
            variables.setVariable('$HttpStatus', response.status)

            // Check if the response was successful (status code in the 200-299 range)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.data;

        } else if (fileExtension == 'p12') {
            // Use .p12 certificate (it must be uploaded on the server)
            // ---------------------------------------------------------
            console.log('Working with a certificate .p12')

            //Resolve Project Path
            const projectResult = await getProjectById(data.projectID);
            if (!projectResult.length) throw new Error(`fetchData: Cannot find project: ${data.projectID}`);

            const projectName = projectResult[0].project;
            const pathName = `../../../uploads/${data.projectID}_${projectName}/`;
            const certificatePath = path.join(__dirname, pathName + token);

            if (!(await fileExist(certificatePath))) {
                throw new Error(`fetchData: Certificate file not found: ${certificatePath}`);
            }


            const agent = new https.Agent({
                pfx: fs.readFileSync(certificatePath),
                passphrase: key,
                //insecureHTTPParser: true,
                rejectUnauthorized: false,

                // Server only supports TLS 1.2
                minVersion: "TLSv1.2",
                maxVersion: "TLSv1.2",

                // ECDSA cipher used by the server
                ciphers: "ECDHE-ECDSA-AES256-GCM-SHA384",
                honorCipherOrder: true,
            });

            const response = await axios.get(url,
                { httpsAgent: agent }
            );

            console.log("STATUS:", response.status);
            console.log("BODY:", response.data);
            return response.data;


        } else {
            // No certificate used
            // -------------------
            console.log('No certificate')
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json', // Specify that we're sending JSON
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            console.log('status', response.status)
            await logfile(data.userID, 'Info', 'status: ' + response.status)
            variables.setVariable('$HttpStatus', response.status)

            // Check if the response was successful (status code in the 200-299 range)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json(); // Parse the response body as JSON
            return responseData;

        }

    } catch (error) {
        // Handle any errors that occurred during the fetch operation or JSON parsing
        console.error("An error occurred during the fetch operation:", error);
        throw error; // Re-throw the error to allow the caller to handle it.
    }
}


/**
* ---------------------------------------------------------------------------- 
* @function
*  httpGet:  Fetches data from a REST API using the GET method.
* 
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {string} url           The URL of the REST API endpoint.
* @param {string} token:        The token to use for the security.
* @param {string} key:          (only for certificate) private key.
* @param {string} code:         (optional) code to store httpdata.
* 
*/
async function httpGet(data, variables, url, token, key, code) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");
    const { getDatasetByCode } = require("../../dataset/dataset.service.js");

    // Reset httpResult
    httpResult = null

    // Check if the code is expressed in a valid dictionary format
    if (url[0] == '@') {
        const dataAPI = { projectID: data.projectID, code: url, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            url = result[0].label
        } else {
            return { success: 0, message: "Cannot find the url: " + url + " in the dictionary", stop: 1 }
        }
    }

    url = variables.evaluateVariable(url, true)


    if (token != undefined && token != 'N/A' && token != '<N/A>') {
        token = variables.evaluateVariable(token, true)

        if (token[0] == '#') {
            // Get the public key of the certificate ---        
            const dataAPI = { subprojectID: data.subprojectID, code: token, language: '*', active: 1 }
            const result = await getDatasetByCode(dataAPI);
            if (result.length) {
                token = result[0].label
            } else {
                variables.displayLog(1, 1, 'Data not found in the dataset for: ' + token + "!")
                return { success: 0, message: "Cannot find the code: " + token + " in the dataset!", stop: 1 }
            }
        }
    } else token = null


    if (key != undefined && key != 'N/A' && key != '<N/A>') {
        key = variables.evaluateVariable(key, true)

        if (key[0] == '#') {
            // Get the private key of the certificate ---        
            const dataAPI = { subprojectID: data.subprojectID, code: key, language: '*', active: 1 }
            const result = await getDatasetByCode(dataAPI);
            if (result.length) {
                key = result[0].label
            } else {
                variables.displayLog(1, 1, 'Data not found in the dataset for: ' + key + "!")
                return { success: 0, message: "Cannot find the code: " + key + " in the dataset!", stop: 1 }
            }
        }
    } else key = null


    code = variables.evaluateVariable(code, true)
    if (code == undefined || code == '<N/A>') code = 'httpGet'

    console.log('httpGet', url)
    console.log('token', token)
    console.log('key', key)
    console.log('code', code)

    try {
        httpResult = await fetchData(data, variables, url, token, key);

        // --- STEP 4: STORE OR UPDATE the txResult ---
        let ret = await Store_HttpData(data, code, httpResult)
        if (ret.success == 1) {
            return { success: 1, message: "httpGet: OK!", stop: 0 };
        } else {
            return { success: 0, message: "httpGet: Store_HttpData Error!", stop: 1 };
        }


    } catch (error) {
        console.error("Error Status:", error.status);
        if (error.status == "404") return { success: 0, message: "Error in httpGet: url not found! - 404 - " + url, stop: 1 }
        else return { success: 0, message: "Error in httpGet", stop: 1 }
    }
}



/**
 * deleteData: Fetches data from a REST API using the DELETE method.
 *
 * @param {object} data:         all the parameters
 * @param {object} variables:    array of all the variables
 * @param {string} url:          The URL of the REST API endpoint.
 * @returns {Promise<any>} A promise that resolves with the fetched data (parsed as JSON) or rejects with an error.
 *
 */
async function deleteData(data, variables, url, token) {
    try {
        //const response = await fetch(url);
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json', // Specify that we're sending JSON
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        });

        console.log('status', response.status)
        await logfile(data.userID, 'Info', 'status: ' + response.status)
        variables.setVariable('$HttpStatus', response.status)

        // Check if the response was successful (status code in the 200-299 range)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json(); // Parse the response body as JSON
        return responseData;

    } catch (error) {
        // Handle any errors that occurred during the fetch operation or JSON parsing
        console.error("An error occurred during the fetch delete operation:", error);
        throw error; // Re-throw the error to allow the caller to handle it.
    }
}


/**
* ---------------------------------------------------------------------------- 
* @function
*  httpDelete:  Fetches data from a REST API using the DELETE method. 
* 
* @param {object} data:         all the parameters
* @param {object} variables:    array of all the variables
* @param {string} url           The URL of the REST API endpoint.
* @param {string} code:         (optional) code to store httpdata.
* 
*/
async function httpDelete(data, variables, url, token, code) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");

    // Reset httpResult
    httpResult = null

    // Check if the code is expressed in a valid dictionary format
    if (url[0] == '@') {
        const dataAPI = { projectID: data.projectID, code: url, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            url = result[0].label
        } else {
            return { success: 0, message: "Cannot find the url: " + url + " in the dictionary", stop: 1 }
        }
    }

    url = variables.evaluateVariable(url)
    url = url.replace(/'/g, "");

    if (token != undefined && token != 'N/A') {
        token = variables.evaluateVariable(token)
        token = token.replace(/'/g, "");
    } else token = null

    console.log('httpDelete', url)
    try {
        httpResult = await deleteData(data, variables, url, token);

        // --- STEP 4: STORE OR UPDATE the txResult ---
        code = variables.evaluateVariable(code, true)
        if (code == undefined || code == '<N/A>') code = 'httpDelete'
        let ret = await Store_HttpData(data, code, httpResult)
        if (ret.success == 1) {
            return { success: 1, message: "httpDelete: OK!", stop: 0 };
        } else {
            return { success: 0, message: "httpDelete: Store_HttpData Error!", stop: 1 };
        }

    } catch (error) {
        console.error("Error:", error);
        return { success: 0, message: "Error in httpDelete", stop: 1 }
    }
}



// /**
// * ---------------------------------------------------------------------------- 
// * @function
// *  httpData:  Get data from a http request (get or post)
// * 
// * @param {object} data:         all the parameters
// * @param {object} variables:    array of all the variables
// * @param {string} expression    Expression to access the structure of the data stored in httpResult 
// * @param {string} variable      Name of the variable to store the result of the expression
// *
// */
// async function httpData(data, variables, expression, variable) {

//     console.log('Expression', expression)
//     expression = variables.evaluateVariable(expression)

//     // replace $$name by the value of the variable $name
//     variable = await nameVariable(variables, variable)

//     try {
//         // retrieve the record of the user id
//         const record = httpResultUser.findLast(item => item.id === data.userID)
//         //console.log(record)
//         expression = 'record.result' + expression
//         // process the expression
//         //console.log('Expression', expression)
//         let result = await eval(expression)
//         console.log("result", result)
//         variables.setVariable(variable, result)
//         return { success: 1, message: "httpData: OK", value: result, stop: 0 }

//     } catch (error) {
//         console.error("Error:", error);
//         return { success: 0, message: "Error in httpData", stop: 1 }
//     }
// }


/**
* ---------------------------------------------------------------------------- 
* @function
*  PublicKey:  Extract the public key from a certificate
* 
* @param {string} certificatePath:      Path of the certificate 
* @param {string} password:             Password of the certificate 
*
*/
async function PublicKey(certificatePath, password) {
    const forge = require('node-forge');
    const fs = require('fs');

    try {
        console.log('Step 1: Reading file');
        const p12Buffer = fs.readFileSync(certificatePath);

        // Use forge.util.createBuffer for better binary handling
        const p12Asn1 = forge.asn1.fromDer(p12Buffer.toString('binary'));

        console.log('Step 2: Parsing PKCS#12');
        const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

        console.log('Step 3: Extracting bags');
        const certBags = p12.getBags({ bagType: forge.pki.oids.certBag })[forge.pki.oids.certBag];

        if (!certBags || certBags.length === 0) {
            throw new Error("No certBags found in the p12 file.");
        }

        // Crucial step: Find the first bag that contains a valid certificate
        let cert = null;
        for (let i = 0; i < certBags.length; i++) {
            if (certBags[i].cert) {
                cert = certBags[i].cert;
                console.log(`Step 4: Valid certificate found in bag [${i}]`);
                break;
            }
        }

        if (!cert) {
            throw new Error("Certificate object is null or empty in all bags.");
        }

        console.log('Step 5: Converting to PEM');
        // Si cert est valide, cette ligne ne plantera plus
        const pem = forge.pki.certificateToPem(cert);

        console.log('Step 6: Cleaning Base64');
        const base64Cert = pem
            .replace(/-----BEGIN CERTIFICATE-----/g, '')
            .replace(/-----END CERTIFICATE-----/g, '')
            .replace(/\s+/g, ''); // Remove carriage returns and spaces

        console.log('Last Step: Success');
        return base64Cert;

    } catch (error) {
        const errorMsg = error.message || "";
        const isInvalidPassword = /PKCS#12 MAC could not be verified\. Invalid password\?$/i.test(errorMsg);

        if (isInvalidPassword) {
            console.error("PublicKey Error: Invalid password");
        } else {
            console.error("PublicKey Internal Error:", errorMsg);
        }
        return "<ERROR>";
    }


    /*
        // --------------
        // Another method
        // --------------
        const { execSync } = require('child_process');        
 
        try {
            // Commande pour extraire le certificat en PEM sans la clé privée
            const cmd = `openssl pkcs12 -in "${certificatePath}" -nokeys -nodes -passin pass:${password}`;
            const output = execSync(cmd).toString();
 
            console.log('PublicKey: ', output)
 
            return output
                .replace(/-----BEGIN CERTIFICATE-----/g, '')
                .replace(/-----END CERTIFICATE-----/g, '')
                .replace(/\s+/g, '');
        } catch (e) {
            console.log('PublicKey Error', e)
            return "<ERROR>";
        }
*/

}

/**
* ---------------------------------------------------------------------------- 
* @function
*  generateRequestId:  Generate a random request ID based on the date time
* 
* @param {string} template:         template of the RequestId: a text with some keywords like <KEYnn> where nn is the lenght of the key
* Example: 12345678-AUTO-<KEY4>-PHIL-<KEY4>-<KEY12>
*/
function generateRequestId(template) {
    const now = new Date();

    // Create a long numeric base using date + milliseconds
    const base = (
        now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0") +
        String(now.getHours()).padStart(2, "0") +
        String(now.getMinutes()).padStart(2, "0") +
        String(now.getSeconds()).padStart(2, "0") +
        String(now.getMilliseconds()).padStart(3, "0")
    );

    let offset = 0;

    return template.replace(/<KEY(\d+)>/g, (_, length) => {
        const len = Number(length);

        // Ensure enough digits are available
        if (offset + len > base.length) {
            offset = 0;
        }

        const chunk = base.substr(offset, len);
        offset += len;

        return chunk;
    });
}




/**
* ---------------------------------------------------------------------------- 
* @function
*  buildAssertionPayload:  process the dataset to build the playload
* 
* @param {string} dataset:          array of the dataset (from a datasetheader)
* @param {string} certificateKey:   public key decoded from the certificate
* @param {string} requestID:        (Optional) requestID, if not provided the requestID will be generated
*
*/
async function buildAssertionPayload(dataset, certificateKey, requestID) {
    const payload = {};
    //const crypto = require('crypto');
    if (requestID == '<N/A>' || requestID == undefined) requestID = ''

    for (const item of dataset) {
        // 1. Clean the key name (e.g., remove the leading underscore '_policy' -> 'policy')
        const cleanKey = item.code.replace('_', '');

        let finalValue = item.label;

        // 2. Handle Placeholders
        if (finalValue.toLowerCase() === '<getpublickey>') {
            // ---------------------------------------------------------------------------------------------
            // The public key is not working with the RRN certificate, it must be hardcoded in the dataset
            // ---------------------------------------------------------------------------------------------
            // Decode the public key of the certificate
            certificateKey = await PublicKey(certificatePath, certificateData.privatekey)

            if (certificateKey == '<ERROR>') {
                return ("Public Key Error")
            }

            finalValue = certificateKey;
        }
        else if (finalValue.toLowerCase() === '<publickey>') {
            // Use the public key passed in parameter
            finalValue = certificateKey
        }
        else if (finalValue.toLowerCase().includes('<key')) {
            // Generate a fresh UUID
            //finalValue = crypto.randomUUID();
            //finalValue = requestID || `REQ-${Date.now()}` // Auto-generate ID if not provided
            finalValue = generateRequestId(finalValue)
        }

        // Otherwise, it uses the literal value from 'label' (e.g., 'CN_POLICY')
        payload[cleanKey] = finalValue;
    }

    return payload;
}

/**
* ---------------------------------------------------------------------------- 
* @function
*  getSAMLContext:  Create the SAML Context for the Assertion or the Transaction
* 
* @param {object} data:                 all the parameters
* @param {string} certificateDataName:  name of the dataset for the certificate 
*
*/
async function getSAMLContext(data, certificateDataName) {
    const { getDatasetByHeaderCode } = require("../../dataset/dataset.service.js");
    const { getProjectById } = require("../../project/project.service.js");
    const { fileExist } = require("./file.library");
    const { request } = require('playwright');
    const path = require('path');

    // 1. Get and build Certificate Data
    const dataAPI1 = { subprojectID: data.subprojectID, datasetheaderCode: certificateDataName };
    const result1 = await getDatasetByHeaderCode(dataAPI1);

    if (!result1.length) throw new Error(`SAML: Cannot find the dataset: ${certificateDataName}!`);

    // Assuming buildAssertionPayload is available in scope
    const certificateData = await buildAssertionPayload(result1, '<N/A>', '<N/A>');

    if (!certificateData.url || certificateData.url === '<N/A>' ||
        !certificateData.name || certificateData.name === '<N/A>' ||
        !certificateData.privatekey || certificateData.privatekey === '<N/A>') {
        throw new Error("SAML Assertion: Certificate data not ok!");
    }

    // 2. Resolve Certificate Path
    const projectResult = await getProjectById(data.projectID);
    if (!projectResult.length) throw new Error(`SAML: Cannot find project: ${data.projectID}`);

    const projectName = projectResult[0].project;
    const pathName = `../../../uploads/${data.projectID}_${projectName}/`;
    const certificatePath = path.join(__dirname, pathName + certificateData.name);

    if (!(await fileExist(certificatePath))) {
        throw new Error(`SAML: Certificate file not found: ${certificatePath}`);
    }

    // 3. Configure Client Certificate
    const isPfx = /\.(p12|pfx)$/i.test(certificateData.name);
    const isCrt = /\.crt$/i.test(certificateData.name);
    let clientCert;

    if (isPfx) {
        clientCert = {
            origin: certificateData.url,
            pfxPath: certificatePath,
            passphrase: certificateData.privatekey
        };
    } else if (isCrt) {
        const certificateKeyPath = certificatePath.replace('.crt', '.key');
        if (!(await fileExist(certificateKeyPath))) {
            throw new Error(`SAML: Key file not found: ${certificateKeyPath}`);
        }
        clientCert = {
            origin: certificateData.url,
            certPath: certificatePath,
            keyPath: certificateKeyPath,
            ...(certificateData.privatekey !== '<N/A>' && { passphrase: certificateData.privatekey })
        };
    } else {
        throw new Error("SAML: Invalid certificate extension. Use .p12, .pfx or .crt");
    }

    // 4. Create the Playwright Context
    const apiContext = await request.newContext({
        baseURL: certificateData.url,
        extraHTTPHeaders: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        clientCertificates: [clientCert]
    });

    console.log('clientCert', clientCert)

    return { apiContext, certificateData };
}


/**
* ---------------------------------------------------------------------------- 
* @function
*  SAML_Assertion:  Perform a SAML Assertionrequest
* 
* @param {object} page:                 playwright page
* @param {object} data:                 all the parameters
* @param {object} variables:            array of all the variables
* @param {string} certificateDataName:  name of the dataset for the certificate 
* @param {string} assertionUrl:         Url for the assertion 
* @param {string} assertionDataName:    name of the dataset for the assertion 
*
*/
async function SAML_Assertion(page, data, variables, certificateDataName, assertionUrl, assertionDataName) {
    const { getCertificateByCode, createCertificate, updateCertificate } = require("../../certificate/certificate.service.js");
    const { getDatasetByHeaderCode } = require("../../dataset/dataset.service.js");
    const { getDatasetByCode } = require("../../dataset/dataset.service.js");
    const robot = require("./robot.library.js")

    let apiContext;
    let certificateKey = '<N/A>';
    let requestID = null;

    certificateDataName = variables.evaluateVariable(certificateDataName, true)
    assertionUrl = variables.evaluateVariable(assertionUrl, true)
    assertionDataName = variables.evaluateVariable(assertionDataName, true)

    console.log('certificateDataName', certificateDataName)
    console.log('assertionUrl', assertionUrl)
    console.log('assertionDataName', assertionDataName)

    try {

        // --- STEP 1: Get the public key of the certificate ---        
        const dataAPI = { subprojectID: data.subprojectID, code: certificateDataName + "_publickey", language: '*', active: 1 }
        const result = await getDatasetByCode(dataAPI);
        if (result.length) {
            certificateKey = result[0].label
        } else {
            variables.displayLog(1, 1, 'Data not found in the dataset for: ' + certificateDataName + "_publickey" + "!")
            return { success: 0, message: "Cannot find the code: " + certificateDataName + "_publickey" + " in the dataset!", stop: 1 }
        }

        // --- STEP 2: SETUP CONTEXT ---
        const contextData = await getSAMLContext(data, certificateDataName);
        apiContext = contextData.apiContext;
        // Note: we can access contextData.certificateData if needed

        // --- STEP 3: GET ASSERTION DATASET ---
        console.log("SAML: Get Assertion Dataset");
        let dynamicData;
        const dataAPI2 = { subprojectID: data.subprojectID, datasetheaderCode: assertionDataName };
        const result2 = await getDatasetByHeaderCode(dataAPI2);

        if (result2.length) {
            dynamicData = await buildAssertionPayload(result2, certificateKey, requestID);
            console.log('Final Payload generated:', dynamicData);
            if (dynamicData == "Public Key Error") return { success: 0, message: "SAML Assertion: Cannot find the Public key of the certificate!", stop: 1 };
        } else {
            return { success: 0, message: `SAML: Cannot find the dataset: ${assertionDataName}!`, stop: 1 };
        }

        // Store the requestID in the reference
        await robot.evaluateFunction(page, variables, 'setReference', data, 'RequestID', dynamicData.requestId, 'RequestID')


        // --- STEP 4: REQUEST ASSERTION ---
        console.log("SAML: Requesting Assertion...");
        const assertionResponse = await apiContext.post(assertionUrl, {
            data: dynamicData
        });

        if (!assertionResponse.ok()) {
            const errorText = await assertionResponse.text();
            throw new Error(`Assertion failed: ${assertionResponse.status()} - ${errorText}`);
        }

        const assertionResult = await assertionResponse.json();
        const samlToken = assertionResult.assertion;
        console.log("Assertion Received.");

        // --- STEP 5: STORE OR UPDATE TOKEN ---
        const dataAPI3 = { subprojectID: data.subprojectID, code: assertionDataName };
        const result3 = await getCertificateByCode(dataAPI3);

        if (result3.length) {
            // Update existing
            console.log('Existing token found, updating ID:', result3[0].certificateID);
            const updateResult = await updateCertificate({
                token: samlToken,
                certificateID: result3[0].certificateID
            });

            if (updateResult.affectedRows === 0) {
                return { success: 0, message: "SAML Assertion: Update token fails!", stop: 1 };
            }
            console.log('Certificate token updated!');
        } else {
            // Create new
            console.log('No token found, creating new record');
            const createResult = await createCertificate({
                subprojectID: data.subprojectID,
                code: assertionDataName,
                token: samlToken
            });

            if (createResult.affectedRows === 0) {
                return { success: 0, message: "SAML Assertion: Store token fails!", stop: 1 };
            }
            console.log('Certificate token created!');
        }


        return { success: 1, message: "SAML Assertion: OK!", stop: 0 };

    } catch (error) {

        console.error("Error during SAML Assertion execution:", error.message);
        if (error.message.includes("<title>401 Unauthorized</title>")) {
            return { success: 0, message: "SAML Error:  This server could not verify that you are authorized to access the document requested! ", stop: 1 };

        } else if (error.message.includes("getaddrinfo ENOTFOUND")) {
            console.error("SAML Error: Network issue - Are you connected to a VPN?", error.message);
            return { success: 0, message: "SAML Error: Network issue - Are you connected to a VPN?", stop: 1 };
        }
        else {
            return { success: 0, message: "SAML: Error during API execution! " + error.message, stop: 1 };
        }
    } finally {
        // Ensure the Playwright context is always closed
        if (apiContext) {
            await apiContext.dispose();
        }
    }
}


/**
* ---------------------------------------------------------------------------- 
* @function
*  SAML_Transaction:  Perform a SAML transaction request
* 
* @param {object} page:                 playwright page
* @param {object} data:                 all the parameters
* @param {object} variables:            array of all the variables
* @param {string} certificateDataName:  name of the dataset for the certificate 
* @param {string} assertionDataName:    name of the dataset for the assertion 
* @param {string} transactionUrl:       Url for the assertion 
* @param {string} transactionDataName:  name of the dataset for the assertion 
*
*/
async function SAML_Transaction(page, data, variables, certificateDataName, assertionDataName, transactionUrl, transactionDataName) {
    const { getCertificateByCode } = require("../../certificate/certificate.service.js");
    const { getDatasetByHeaderCode } = require("../../dataset/dataset.service.js");

    certificateDataName = variables.evaluateVariable(certificateDataName, true)
    assertionDataName = variables.evaluateVariable(assertionDataName, true)
    transactionUrl = variables.evaluateVariable(transactionUrl, true)
    transactionDataName = variables.evaluateVariable(transactionDataName, true)

    console.log('certificateDataName', certificateDataName)
    console.log('assertionDataName', assertionDataName)
    console.log('transactionUrl', transactionUrl)
    console.log('transactionDataName', transactionDataName)

    let apiContext;

    try {
        //console.log('getSAMLContext')
        const contextData = await getSAMLContext(data, certificateDataName);
        apiContext = contextData.apiContext;

        // Get the samlToken
        //console.log('getCertificateByCode')
        const tokenResult = await getCertificateByCode({ subprojectID: data.subprojectID, code: assertionDataName });
        if (!tokenResult.length) {
            console.log("SAML: Token not found: " + assertionDataName)
            return { success: 0, message: `SAML: Token not found for ${assertionDataName}`, stop: 1 };
        }

        const token = tokenResult[0].token;
        //console.log ('token', token)

        // Get the transaction dataset
        //console.log('getDatasetByHeaderCode')
        const result2 = await getDatasetByHeaderCode({ subprojectID: data.subprojectID, datasetheaderCode: transactionDataName });
        if (!result2.length) {
            console.log("SAML: Dataset not found: *" + transactionDataName + "*")
            return { success: 0, message: `SAML: Dataset not found: ${transactionDataName}`, stop: 1 };
        }

        //console.log('buildAssertionPayload')
        const dynamicData = await buildAssertionPayload(result2, '<N/A>', null);
        console.log('dynamicData', dynamicData)

        // Execute Transaction
        console.log("Executing Transaction...");
        const txResponse = await apiContext.post(transactionUrl, {
            headers: { 'Authorization': token },
            data: dynamicData
        });

        const txResult = await txResponse.json();
        console.log("Transaction Result:", txResult);
        console.log("Transaction Response:", txResult.transactionResponse);

        if (txResult.transactionResponse == undefined) {
            if (txResult.reason != undefined) {
                return { success: 0, message: "SAML: Error -  No result! - " + txResult.reason + " : " + txResult.message, stop: 1 };
            } else {
                return { success: 0, message: "SAML: Error -  No result!", stop: 1 };
            }
        }

        let ret = await Store_HttpData(data, transactionDataName, txResult.transactionResponse)

        // --- STEP 4: STORE OR UPDATE the txResult ---
        if (ret.success == 1) {
            return { success: 1, message: "SAML: OK!", stop: 0 };
        } else {
            return { success: 0, message: "SAML: Error!", stop: 1 };
        }

    } catch (error) {
        if (error.message.includes("getaddrinfo ENOTFOUND")) {
            console.error("SAML Error: Network issue - Are you connected to a VPN?", error.message);
            return { success: 0, message: "SAML Error: Network issue - Are you connected to a VPN?", stop: 1 };
        } else {
            console.error("SAML Error:", error.message);
            return { success: 0, message: error.message, stop: 1 };
        }
    } finally {
        if (apiContext) await apiContext.dispose();
    }
}




/**
* ---------------------------------------------------------------------------- 
* @function
*  SOAP_postData:  Fetches data from a SOAP using the POST method. 
* 
* @param {object} data:                 all the parameters
* @param {object} variables:            array of all the variables
* @param {string} certificateDataName:  name of the dataset for the certificate 
* @param {string} assertionDataName:    name of the dataset for the assertion (to get the token created by SAML assertion)
* @param {string} url                   The URL of the SOAP endpoint.
* @param {string} soapDataset           Dataset with the definition of the SOAP.
* @param {string} endpointDataset       name of the dataset for the endpoint
* 
*/
async function SOAP_postData(data, variables, certificateDataName, assertionDataName, url, soapDataset, endpointDataset) {
    const { getDatasetByHeaderCode } = require("../../dataset/dataset.service.js");
    const { getCertificateByCode } = require("../../certificate/certificate.service.js");

    let certificateKey = '<N/A>';

    certificateDataName = variables.evaluateVariable(certificateDataName, true)
    assertionDataName = variables.evaluateVariable(assertionDataName, true)
    url = variables.evaluateVariable(url, true)
    soapDataset = variables.evaluateVariable(soapDataset, true)
    endpointDataset = variables.evaluateVariable(endpointDataset, true)

    console.log('certificateDataName', certificateDataName)
    console.log('assertionDataName', assertionDataName)
    console.log('Url', url)
    console.log('soapDataset', soapDataset)
    console.log('endpointDataset', endpointDataset)


    try {

        // Get the Soap dataset (generic information concerning the Soap environment)
        console.log('get Soap info')
        const resultSoap = await getDatasetByHeaderCode({ subprojectID: data.subprojectID, datasetheaderCode: soapDataset });
        if (!resultSoap.length) {
            console.log("SOAP: Dataset not found: *" + soapDataset + "*")
            return { success: 0, message: `SOAP: Dataset not found: ${soapDataset}`, stop: 1 };
        }
        const soapData = await buildAssertionPayload(resultSoap, '<N/A>', null);


        // Get the endpointDataset dataset (replace variables by values)
        console.log('get Endpoint info')
        const resultEndpoint = await getDatasetByHeaderCode({ subprojectID: data.subprojectID, datasetheaderCode: endpointDataset });
        if (!resultEndpoint.length) {
            console.log("SOAP: Dataset not found: *" + endpointDataset + "*")
            return { success: 0, message: `SOAP: Dataset not found: ${endpointDataset}`, stop: 1 };
        }
        const endpointData = await buildAssertionPayload(resultEndpoint, '<N/A>', null);
        endpointData.header = variables.evaluateVariable(endpointData.header, true)
        endpointData.body = variables.evaluateVariable(endpointData.body, true)
        endpointData.header = endpointData.header.replace(/<br>/g, "\n")
        endpointData.body = endpointData.body.replace(/<br>/g, "\n")
        //console.log('SOAP dataset', endpointData)


        // Get the samlToken
        console.log('getCertificateByCode Token')
        const tokenResult = await getCertificateByCode({ subprojectID: data.subprojectID, code: assertionDataName });
        if (!tokenResult.length) {
            console.log("SOAP: Token not found: " + assertionDataName)
            return { success: 0, message: `SOAP: Token not found for ${assertionDataName}`, stop: 1 };
        }
        const token = tokenResult[0].token;


        const soapEnvelope = `
            <soapenv:Envelope xmlns:soapenv="${soapData.soapenv}"
                            xmlns:head="${soapData.head}"
                            xmlns:core="${soapData.core}">
            <soapenv:Header>
                <head:dabsHeader>
                    ${endpointData.header}
                    <samlToken>${token}</samlToken>
                </head:dabsHeader>
            </soapenv:Header>
            <soapenv:Body>
                    ${endpointData.body}
            </soapenv:Body>
            </soapenv:Envelope>`;

        console.log('soapEnvelope', soapEnvelope)


        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "text/xml;charset=UTF-8",
                "SOAPAction": endpointData.action
            },
            body: soapEnvelope
        });


        if (!response.ok) {
            // Handle HTTP errors (e.g., 404, 500)
            return { success: 0, message: "SOAP_postData: error! Status: " + response.status, stop: 1 };
        }

        console.log('status', response.status)
        await logfile(data.userID, 'Info', 'status: ' + response.status)
        variables.setVariable('$HttpStatus', response.status)

        // Store the result in httpdata table
        console.log('Store the result in httpdata')
        const httpData = await response.text(); // Parse the response body as text

        let ret = await Store_HttpData(data, 'SoapPost', httpData)

        return { success: 1, message: "SOAP_postData: OK!", stop: 0 };


    } catch (error) {
        // Handle any errors that occurred during the fetch or parsing process
        console.error("Error during SOAP POST request:", error);
        if (error instanceof TypeError) {
            console.error("This indicates a network issue (DNS, CORS, refused connection, timeout, offline...).");
            return { success: 0, message: "SOAP_postData: error: a network issue occurs (DNS, CORS, refused connection, timeout, offline...).", stop: 1 };
        }

        return { success: 0, message: "SOAP_postData: error: " + error.message, stop: 1 };
    }
}




/**
* ---------------------------------------------------------------------------- 
* @function
*  Store_HttpData:  Store a result into a httpData table
* 
* @param {object} data:                 all the parameters
* @param {string} code:                 code of the httpdata 
* @param {object} txResult:             json file to store
*
*/
async function Store_HttpData(data, code, txResult) {

    const { getHttpdataByCode, createHttpdata, updateHttpdata } = require("../../httpdata/httpdata.service.js");

    const dataAPI1 = { subprojectID: data.subprojectID, code: code };
    const result1 = await getHttpdataByCode(dataAPI1);

    if (result1.length) {
        // Update existing
        console.log('Existing httpdata found, updating ID:', result1[0].httpdataID);
        const updateResult = await updateHttpdata({
            jsondata: JSON.stringify(txResult),
            httpdataID: result1[0].httpdataID
        });

        if (updateResult.affectedRows === 0) {
            return { success: 0, message: "Store_HttpData: Update http data fails!", stop: 1 };
        }
        console.log('Httpdata updated!');
    } else {
        // Create new
        console.log('No httpdata found, creating new record');
        const createResult = await createHttpdata({
            subprojectID: data.subprojectID,
            code: code,
            jsondata: JSON.stringify(txResult)
        });

        if (createResult.affectedRows === 0) {
            return { success: 0, message: "Store_HttpData: Store http data fails!", stop: 1 };
        }
        console.log('Httpdata created!');
    }
    await logfile(data.userID, 'Info', '.... hhtp data stored with the code: ' + code)
    return { success: 1, message: "Store_HttpDatan: Store http data OK!", stop: 0 };


}

/**
* ---------------------------------------------------------------------------- 
* @function 
* findValueByKey: Generic function to search for a key in a nested object/tree
*
* @param {Object|Array} schema - The object to search
* @param {string} targetKey - The key to find (e.g., "Year")
* @param {number} position - Which occurrence to return
* @param {number} tracker - internal tracker position (recursive function)
* @returns {any|null} - The value found or null
*
*/
function findValueByKey(obj, targetKey, position, tracker = { count: 0 }) {
    if (obj && typeof obj === 'object') {

        // If the current object has the key
        if (Object.prototype.hasOwnProperty.call(obj, targetKey)) {
            const value = obj[targetKey];
            //console.log('Object targetKey: ' + targetKey, value)

            // If it's an array (multiple sibling tags), we need to check if our 
            // desired position falls within this array
            if (Array.isArray(value)) {
                for (let i = 0; i < value.length; i++) {
                    tracker.count++;
                    // console.log('Array: Tracker (position) = ', tracker.count + " (" + position + ") = " + (tracker.count == position))
                    if (tracker.count == position) {
                        console.log("found in array")
                        return value[i];
                    }
                }
            } else {
                // If it's a single occurrence
                tracker.count++;
                // console.log('Single: Tracker (position) = ', tracker.count + " (" + position + ") = " + (tracker.count == position) )
                if (tracker.count == position) {
                    console.log("found in single")
                    return value;
                }
            }
        }

        // console.log ('Dive deeper into children')
        // Dive deeper into children
        for (const key of Object.keys(obj)) {
            // Skip the targetKey itself to avoid re-scanning its value
            if (key !== targetKey) {
                const found = findValueByKey(obj[key], targetKey, position, tracker);
                if (found !== undefined) return found;
            }
        }
    }
    return undefined;
}


/**
* ---------------------------------------------------------------------------- 
* @function
*  httpSearchKeyValue:  Search for a key value into the http result
* 
* @param {object} page:                 playwright page
* @param {object} data:                 all the parameters
* @param {object} variables:            array of all the variables
* @param {string} code:                 code of the httpdata 
* @param {string} searchKey:            the key in the json structure or <ALL> to display
* @param {string} searchPosition:       occurrence of the key (1 by default) 
* @param {string} scopeKey:             (optional) "Grandparent" (e.g., "FamilyMember")
* @param {string} scopePosition:        occurrence of the "Grandparent": 1 by default (e.g., 3 for the 3rd family member)
* @param {string} variableName:         name of the variable to store the result (not used when searchKey = <ALL>)
* @param {string} operator:             Contains or Equal 
* @param {string} searchValue:          (optional) search a value in the result - the variablename will contain true or false 
*
*/
async function httpSearchKeyValue(page, data, variables, code, searchKey, searchPosition = 1, scopeKey = null, scopePosition = 1, variableName, operator, searchValue) {
    const { getHttpdataByCode } = require("../../httpdata/httpdata.service.js");

    if (scopeKey == '<N/A>') scopeKey = null
    searchPosition = variables.evaluateVariable(searchPosition, true)
    scopePosition = variables.evaluateVariable(scopePosition, true)
    code = variables.evaluateVariable(code, true)
    searchValue = variables.evaluateVariable(searchValue, true)

    // replace $$name by the value of the variable $name
    variableName = await nameVariable(variables, variableName)

    // console.log('code', code)
    // console.log('searchKey', searchKey)
    // console.log('searchPosition', searchPosition)
    // console.log('scopeKey', scopeKey)
    // console.log('scopePosition', scopePosition)
    // console.log('variableName', variableName)


    // Get the http data
    const dataAPI1 = { subprojectID: data.subprojectID, code: code };
    const result1 = await getHttpdataByCode(dataAPI1);
    variables.setVariable("$Error", "0");
    if (result1.length == 0) {
        console.log("httpdata not found! : " + code)
        variables.setVariable("$Error", "1");
        variables.setVariable(variableName, "-1")
        return { success: 0, message: "httpdata not found! : " + code, value: -1, stop: 1 };
    }

    const dataResult = result1[0]

    try {
        let xmlData = dataResult.jsondata;
        if (!xmlData) {
            console.log("httpSearchKeyValue: jsondata is empty!",);
            variables.setVariable("$Error", "1");
            variables.setVariable(variableName, "-1")
            return { success: 0, message: "httpSearchKeyValue: transactionResponse is empty!", value: -1, stop: 1 };
        }

        if (searchKey == '<ALL>') {

            xmlData = xmlData.replace(/\\n/g, "");
            xmlData = xmlData.replace(/\\t/g, "");
            xmlData = xmlData.replace(/\\r/g, "");
            // the logfile is limited to 500 chars, split the message
            // into small parts of text

            if (searchValue == '<N/A>') {
                const size = 250;
                for (let i = 0; i < xmlData.length; i += size) {
                    const part = xmlData.substring(i, i + size);
                    await logfile(data.userID, 'Info', part)
                }
                return { success: 1, message: "httpSearchKeyValue: dump", value: 99, stop: 0 };

            } else {
                if (operator == 'Equal') {
                    let op = (xmlData == searchValue)
                    variables.setVariable(variableName, op)
                    return { success: 1, message: "httpSearchKeyValue: dump Search", value: op, stop: 0 };
                } else {
                    let op = xmlData.includes(searchValue)
                    variables.setVariable(variableName, op)
                    return { success: 1, message: "httpSearchKeyValue: dump Search", value: op, stop: 0 };

                }
            }



        }

        const parser = new XMLParser({
            ignoreAttributes: true,
            removeNSPrefix: true
        });

        let keyValue = null
        //const jsonObj = parser.parse(xmlData);
        let jsonObj;

        // Check if xmlData is a string and looks like JSON
        if (typeof xmlData === 'string' && (xmlData.trim().startsWith('{') || xmlData.trim().startsWith('['))) {
            try {
                jsonObj = JSON.parse(xmlData);
            } catch (e) {
                console.error("Failed to parse as JSON, trying XML...");
            }
        }

        // If it wasn't JSON or parsing failed, use the XML Parser
        if (!jsonObj) {
            const parser = new XMLParser({
                ignoreAttributes: true,
                removeNSPrefix: true
            });
            jsonObj = parser.parse(xmlData);
        }


        let searchRoot = jsonObj;

        // --- STEP 1: NARROW THE SCOPE ---
        // If a scope is provided, find that specific "Grandparent" first
        if (scopeKey) {
            console.log('Search for the Grandparent: ' + scopeKey + " (" + scopePosition + ")")
            searchRoot = findValueByKey(jsonObj, scopeKey, scopePosition);
            //console.log('Grandparent search result', searchRoot)
            if (!searchRoot) {
                // No scope found!
                console.log("httpSearchKeyValue: No scope found! : " + scopeKey);
                variables.setVariable("$Error", "1");
                variables.setVariable(variableName, "-1")
                return { success: 1, message: "httpSearchKeyValue: No scope found! : " + scopeKey, value: -1, stop: 0 };
            }

            // Check if the searchKey is a direct property of the scope we just found.
            // If it is, return it directly instead of searching deeper.
            //console.log('typeof searchRoot', typeof searchRoot)
            //console.log('SearchRoot[searchKey]', searchRoot[searchKey])
            if (searchRoot && typeof searchRoot !== 'object' && searchRoot[searchKey] === undefined) {
                // Data found!
                console.log("httpSearchKeyValue: Data found! : " + (scopeKey == null ? '' : scopeKey + ' / ') + searchKey + " = " + searchRoot);
                console.log('type ', typeof searchRoot)

                if (searchValue == '<N/A>') {
                    variables.setVariable(variableName, searchRoot)
                    return { success: 1, message: "httpSearchKeyValue: Data found!" + (scopeKey == null ? '' : scopeKey + ' / ') + searchKey + " = " + searchRoot, value: searchRoot, stop: 0 };
                } else {
                    if (operator == 'Equal') {
                        let op = (searchRoot == searchValue)
                        variables.setVariable(variableName, op)
                        return { success: 1, message: "httpSearchKeyValue: Data Search", value: op, stop: 0 };
                    } else {
                        let op = searchRoot.includes(searchValue)
                        variables.setVariable(variableName, op)
                        return { success: 1, message: "httpSearchKeyValue: Data Search", value: op, stop: 0 };
                    }
                }
            }
        }


        // --- STEP 2: FIND THE VALUE ---
        // Search inside the resolved scope
        console.log('Search for the key: ' + searchKey + " (" + searchPosition + ")")
        keyValue = findValueByKey(searchRoot, searchKey, searchPosition);
        console.log('Key search result', keyValue)

        if (keyValue == null || keyValue == undefined) {
            // No data found!
            console.log("httpSearchKeyValue: No data found! : " + (scopeKey == null ? '' : scopeKey + ' / ') + searchKey);
            variables.setVariable("$Error", "1");
            variables.setVariable(variableName, "-1")
            return { success: 1, message: "httpSearchKeyValue: No data found! : " + (scopeKey == null ? '' : scopeKey + ' / ') + searchKey, value: -1, stop: 0 };
        } else {
            // Data found!
            console.log("httpSearchKeyValue: Data found! : " + (scopeKey == null ? '' : scopeKey + ' / ') + searchKey + " = " + keyValue);
            if (typeof keyValue == 'object') keyValue = "<Object>"
            if (searchValue == '<N/A>') {
                variables.setVariable(variableName, keyValue)
                return { success: 1, message: "httpSearchKeyValue: Data found! " + (scopeKey == null ? '' : scopeKey + ' / ') + searchKey + " = " + keyValue, value: keyValue, stop: 0 };
            } else {
                if (operator == 'Equal') {
                    let op = (keyValue == searchValue)
                    variables.setVariable(variableName, op)
                    return { success: 1, message: "httpSearchKeyValue: Data Search", value: op, stop: 0 };
                } else {
                    let op = keyValue.includes(searchValue)
                    variables.setVariable(variableName, op)
                    return { success: 1, message: "httpSearchKeyValue: Data Search", value: op, stop: 0 };
                }
            }
        }

    } catch (error) {
        console.error("httpSearchKeyValue: Internal Error: ", error.message);
        variables.setVariable("$Error", "1");
        variables.setVariable(variableName, "-1")
        return { success: 0, message: "httpSearchKeyValue KO! : " + error.message, value: -1, stop: 1 };
    }

}


/**
* ---------------------------------------------------------------------------- 
* @function
*  countKeysRecursive:  Recursively counts how many times a key appears in an object or array
* 
* @param {object} obj:                  json object
* @param {string} targetKey:            the key in the json structure 
*
*/
function countKeysRecursive(obj, targetKey) {
    let count = 0;

    if (obj && typeof obj === 'object') {
        // If the current object has the key, count it
        if (Object.prototype.hasOwnProperty.call(obj, targetKey)) {
            // If the value is an array (multiple tags), count the array length
            // If it's a single object/value, count as 1
            count += Array.isArray(obj[targetKey]) ? obj[targetKey].length : 1;
        }

        // Continue searching deeper into all properties
        for (const key of Object.keys(obj)) {
            // Don't re-scan the targetKey's children to avoid double-counting 
            // if the key name repeats internally
            if (key !== targetKey) {
                count += countKeysRecursive(obj[key], targetKey);
            }
        }
    }
    return count;
}



/**
* ---------------------------------------------------------------------------- 
* @function
*  httpKeyCount:  Count the number of occurrence of a key into the http result
* 
* @param {object} page:                 playwright page
* @param {object} data:                 all the parameters
* @param {object} variables:            array of all the variables
* @param {string} code:                 code of the httpdata 
* @param {string} searchKey:            the key in the json structure 
* @param {string} parentKey:            the key in the parent in the json structure 
* @param {string} variableName:         name of the variable 
*
*/
async function httpKeyCount(page, data, variables, code, searchKey, parentKey = null, variableName) {

    const { getHttpdataByCode } = require("../../httpdata/httpdata.service.js");

    if (parentKey == '<N/A>') parentKey = null

    // replace $$name by the value of the variable $name
    variableName = await nameVariable(variables, variableName)

    // Get the http data
    const dataAPI1 = { subprojectID: data.subprojectID, code: code };
    const result1 = await getHttpdataByCode(dataAPI1);
    variables.setVariable("$Error", "0");
    if (result1.length == 0) {
        console.log("httpdata not found! : " + code)
        variables.setVariable("$Error", "1");
        variables.setVariable(variableName, "-1")
        return { success: 0, message: "httpdata not found! : " + code, value: -1, stop: 1 };
    }

    const dataResult = result1[0]
    //console.log ('dataResult: ', dataResult)
    try {
        const xmlData = dataResult.jsondata;
        if (!xmlData) {
            console.log("httpKeyCount: transactionResponse is empty!",);
            variables.setVariable("$Error", "1");
            variables.setVariable(variableName, "-1")
            return { success: 0, message: "httpKeyCount: transactionResponse is empty!", value: -1, stop: 1 };
        }

        const parser = new XMLParser({
            ignoreAttributes: true,
            removeNSPrefix: true
        });

        //const jsonObj = parser.parse(xmlData);

        let jsonObj;

        // Check if xmlData is a string and looks like JSON
        if (typeof xmlData === 'string' && (xmlData.trim().startsWith('{') || xmlData.trim().startsWith('['))) {
            try {
                jsonObj = JSON.parse(xmlData);
            } catch (e) {
                console.error("Failed to parse as JSON, trying XML...");
            }
        }

        // If it wasn't JSON or parsing failed, use the XML Parser
        if (!jsonObj) {
            const parser = new XMLParser({
                ignoreAttributes: true,
                removeNSPrefix: true
            });
            jsonObj = parser.parse(xmlData);
        }


        //
        // If a parent scope is defined, find it first
        // if (parentKey) {
        //     const { findValueByKey } = require('./your-util-file'); // Use the finder from previous step
        //     rootToSearch = findValueByKey(jsonObj, parentKey);
        // }

        //return countKeysRecursive(rootToSearch, searchKey);
        //        


        let countKey = countKeysRecursive(jsonObj, searchKey);
        console.log('countKey: ', countKey)

        variables.setVariable(variableName, countKey)
        return { success: 1, message: "httpKeyCount OK!", value: countKey, stop: 0 };

    } catch (error) {
        console.error("httpKeyCount: Error counting occurrences:", error);
        variables.setVariable("$Error", "1");
        variables.setVariable(variableName, "-1")
        return { success: 0, message: "httpKeyCount KO! : " + error.message, value: -1, stop: 1 };
    }

}


/**
 * compareImages: Compares two images and returns similarity percentage and creates a diff image
 * 
 * @param {string|Buffer} baselineImagePath - Path to baseline image or Buffer
 * @param {string|Buffer} compareImagePath - Path to comparison image or Buffer
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Matching threshold (0 to 1). Smaller values make comparison more sensitive
 * @param {boolean} options.includeAA - Whether to include anti-aliasing in comparison
 * @param {number} options.alpha - Blending factor of original image in diff (0 to 1)
 * *
 * @returns {Promise<Object>} Object containing similarity percentage and diff stats
 */
async function compareImages(baselineImagePath, compareImagePath, options = {}) {
    const sharp = require('sharp');
    const pixelmatch = require('pixelmatch');
    const fs = require('fs').promises;

    const {
        threshold = 0.1,
        includeAA = false,
        alpha = 0.1
    } = options;

    try {
        // Load and process baseline image
        let baselineBuffer;
        if (Buffer.isBuffer(baselineImagePath)) {
            baselineBuffer = baselineImagePath;
        } else {
            baselineBuffer = await fs.readFile(baselineImagePath);
        }

        // Load and process comparison image
        let compareBuffer;
        if (Buffer.isBuffer(compareImagePath)) {
            compareBuffer = compareImagePath;
        } else {
            compareBuffer = await fs.readFile(compareImagePath);
        }

        // Get metadata from both images
        const baselineMetadata = await sharp(baselineBuffer).metadata();
        const compareMetadata = await sharp(compareBuffer).metadata();

        // Determine the dimensions to use (use the larger dimensions)
        const width = Math.max(baselineMetadata.width, compareMetadata.width);
        const height = Math.max(baselineMetadata.height, compareMetadata.height);

        console.log(`Processing images at ${width}x${height} pixels`);

        // Resize both images to the same dimensions and convert to RGBA
        const baselineRGBA = await sharp(baselineBuffer)
            .resize(width, height, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            })
            .ensureAlpha()
            .raw()
            .toBuffer();

        const compareRGBA = await sharp(compareBuffer)
            .resize(width, height, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            })
            .ensureAlpha()
            .raw()
            .toBuffer();

        // Create buffer for diff image
        const diffBuffer = Buffer.alloc(width * height * 4);

        // Perform pixel comparison
        const numDiffPixels = pixelmatch(
            baselineRGBA,
            compareRGBA,
            diffBuffer,
            width,
            height,
            {
                threshold,
                includeAA,
                alpha,
                diffColor: [255, 0, 0],          // Red for differences
                diffColorAlt: [255, 100, 100],   // Light red for anti-aliasing differences
                aaColor: [255, 255, 0],          // Yellow for anti-aliasing
                diffMask: false                   // Don't create a mask, blend with original
            }
        );

        // Calculate similarity percentage
        const totalPixels = width * height;
        const similarityPercentage = ((totalPixels - numDiffPixels) / totalPixels) * 100;

        // Return results
        return {
            similarityPercentage: parseFloat(similarityPercentage.toFixed(2)),
            differencePercentage: parseFloat((100 - similarityPercentage).toFixed(2)),
            totalPixels,
            differentPixels: numDiffPixels,
            dimensions: { width, height }
        };

    } catch (error) {
        throw new Error(`Image comparison failed: ${error.message}`);
    }
}



/**
* ---------------------------------------------------------------------------- 
* @function
*  imageDifference:  take a printscreen and compare the image with a baseline.
*                    use the function imageDifferenceData() to get all the info.
*                    if a slot is defined for the baseline, the picture will be store on it    
* 
* @param {object} page:             playwright page
* @param {object} data:             all the parameters
* @param {object} variables:        array of all the variables
* @param {string} baselineName      name of the baseline image
* @param {number} printscreenSlot   number of the slot to store the printscreen
* @param {number} baselineSlot      <optional> number of the slot to store the baseline
* @param {string} mask1             name of the element to mask (or Dictionary)
* @param {string} mask2             name of the element to mask (or Dictionary)
* @param {string} mask3             name of the element to mask (or Dictionary)
* @param {string} mask4             name of the element to mask (or Dictionary)
* @param {string} mask5             name of the element to mask (or Dictionary)

*
*/
async function imageDifference(page, data, variables, baselineName, printscreenSlot, baselineSlot, mask1, mask2, mask3, mask4, mask5) {
    const { fileExist } = require("./file.library")

    // take a printscreen
    let fs = require("fs")

    try {

        // Check the masks
        const maskLocators = [];
        for (const rawMask of [mask1, mask2, mask3, mask4, mask5]) {
            const resolved = await resolveMask(page, data, variables, rawMask);
            if (resolved === '<ERROR>') return { success: 0, message: 'Mask cannot be resolve: ' + rawMask, stop: 1 };
            if (resolved != undefined) maskLocators.push(page.locator(resolved));
        }
        console.log('maskLocators', maskLocators)


        let baselinePath = './Image/Baseline/' + baselineName + "_" + data.userID + '_image.png'
        // check if the baseline exists
        ret = await fileExist(baselinePath)
        if (ret == false) {
            // file not found, take a printscreen and store the result as the baseline
            await page.screenshot({
                path: baselinePath,
                ...(maskLocators.length > 0 && { mask: maskLocators })
            })
            let basePath = './printscreen/' + data.userID + '_image' + printscreenSlot + '.png'
            fs.copyFile(baselinePath, basePath, (err) => {
                if (err) console.log("Error Found:", err);
                else console.log("file: " + baselinePath + " copy to: " + basePath)
            });
            return { success: 1, message: "Baseline picture created visible in the slot: " + printscreenSlot, stop: 0 }
        } else if (baselineSlot != undefined && baselineSlot > 0) {
            // copy the baseline in the slot
            let basePath = './printscreen/' + data.userID + '_image' + baselineSlot + '.png'
            fs.copyFile(baselinePath, basePath, (err) => {
                if (err) console.log("Error Found:", err);
                else console.log("file: " + baselinePath + " copy to: " + basePath)
            });

        }

        // Take a fresh printscreen
        let picture = './printscreen/' + data.userID + '_image' + printscreenSlot + '.png'
        console.log('printScreen', picture)
        await page.screenshot({
            path: picture,
            ...(maskLocators.length > 0 && { mask: maskLocators })
        })

        // Compare images
        try {
            imageResult = await compareImages(
                baselinePath,           // Path to baseline image
                picture,                // Path to comparison image  
                {
                    threshold: 0.1,     // Sensitivity (lower = more sensitive)
                    includeAA: false,   // Include anti-aliasing in comparison
                    alpha: 0.2          // Blend factor for diff overlay
                }
            );

            console.log('Comparison Results:');
            console.log(`Similarity: ${imageResult.similarityPercentage}%`);
            console.log(`Difference: ${imageResult.differencePercentage}%`);
            console.log(`Different pixels: ${imageResult.differentPixels} out of ${imageResult.totalPixels}`);
            console.log(`Image dimensions: ${imageResult.dimensions.width}x${imageResult.dimensions.height}`);

            return { success: 1, message: `Similarity: ${imageResult.similarityPercentage}%`, stop: 0 }

        } catch (error) {
            console.error('Error comparing images:', error.message);
        }

    } catch (err) {
        return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
    }

}


/**
* ---------------------------------------------------------------------------- 
* @function
*  imageDifferenceData:  return info on the difference (use only after the call of the function imageDifference)
* 
* @param {object} variables:    array of all the variables
* @param {string} parameter:    name of the parameter
* @param {string} variable:     name of the variable to store the parameter
*
*/
async function imageDifferenceData(variables, parameter, variable) {

    // replace $$name by the value of the variable $name
    variable = await nameVariable(variables, variable)

    switch (parameter) {

        case 'Similarity':
            variables.setVariable(variable, imageResult.similarityPercentage)
            ret = { success: 1, message: 'imageDifferenceData OK', value: `Similarity: ${imageResult.similarityPercentage}%`, stop: 0 }
            return ret

        case 'Difference':
            variables.setVariable(variable, imageResult.differencePercentage)
            ret = { success: 1, message: 'imageDifferenceData OK', value: `Difference: ${imageResult.differencePercentage}%`, stop: 0 }
            return ret

        case 'Different pixels':
            variables.setVariable(variable, `${imageResult.differentPixels} out of ${imageResult.totalPixels}`)
            ret = { success: 1, message: 'imageDifferenceData OK', value: `Different pixels: ${imageResult.differentPixels} out of ${imageResult.totalPixels}`, stop: 0 }
            return ret

        case 'Image dimensions':
            variables.setVariable(variable, `${imageResult.dimensions.width}x${imageResult.dimensions.height}`)
            ret = { success: 1, message: 'imageDifferenceData OK', value: `Image dimensions: ${imageResult.dimensions.width}x${imageResult.dimensions.height}`, stop: 0 }
            return ret

        default:
            variables.displayLog(1, 1, 'No parameter with the name: ' + parameter)
            ret = { success: 0, message: 'parameter: ' + parameter + ' unknown!', stop: 1 }
            return ret
    }

}

/**
* ---------------------------------------------------------------------------- 
* @function
*  resolveMask:  resolve the locator of the mask.
* 
* @param {object} page:             playwright page
* @param {object} data:             all the parameters
* @param {object} variables:        array of all the variables
* @param {string} mask              name of the element to mask (or Dictionary)
*
*/
async function resolveMask(page, data, variables, mask) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");

    if (!mask || mask === '<N/A>') return undefined
    else if (mask[0] == '@') {
        // Check if the mask is expressed in a valid dictionary format
        const dataAPI = { projectID: data.projectID, code: mask, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            mask = result[0].label
        } else {
            return "<ERROR>"
        }
    }
    mask = variables.evaluateVariable(mask)
    mask = mask.replace(/'/g, "");

    return mask
}


/**
* ---------------------------------------------------------------------------- 
* @function
*  imageBaseline:  take a printscreen and store the image as a baseline.
* 
* @param {object} page:             playwright page
* @param {object} data:             all the parameters
* @param {object} variables:        array of all the variables
* @param {string} baselineName      name of the baseline image
* @param {number} printscreenSlot   number of the slot to store the printscreen
* @param {string} mask1             name of the element to mask (or Dictionary)
* @param {string} mask2             name of the element to mask (or Dictionary)
* @param {string} mask3             name of the element to mask (or Dictionary)
* @param {string} mask4             name of the element to mask (or Dictionary)
* @param {string} mask5             name of the element to mask (or Dictionary)
*
*/
async function imageBaseline(page, data, variables, baselineName, printscreenSlot, mask1, mask2, mask3, mask4, mask5) {


    let fs = require("fs")

    try {

        // Check the masks
        const maskLocators = [];
        for (const rawMask of [mask1, mask2, mask3, mask4, mask5]) {
            const resolved = await resolveMask(page, data, variables, rawMask);
            if (resolved === '<ERROR>') return { success: 0, message: 'Mask cannot be resolve: ' + rawMask, stop: 1 };
            if (resolved != undefined) maskLocators.push(page.locator(resolved));
        }
        console.log('maskLocators', maskLocators)

        let baselinePath = './Image/Baseline/' + baselineName + "_" + data.userID + '_image.png'
        await page.screenshot({
            path: baselinePath,
            ...(maskLocators.length > 0 && { mask: maskLocators })
        })
        let basePath = './printscreen/' + data.userID + '_image' + printscreenSlot + '.png'
        fs.copyFile(baselinePath, basePath, (err) => {
            if (err) console.log("Error Found:", err);
            else console.log("file: " + baselinePath + " copy to: " + basePath)
        });
        return { success: 1, message: "Baseline picture created visible in the slot: " + printscreenSlot, stop: 0 }

    } catch (err) {
        return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
    }

}


/**
* ---------------------------------------------------------------------------- 
* @function
*  clickXY:  perform a Click at a specific X, Y coordinates
* 
* @param {object} variables:    array of all the variables
* @param {string} parameter:    name of the parameter
* @param {string} variable:     name of the variable to store the parameter
*
*/
async function clickXY(variables, xPosition, yPosition) {
    const Python = require("../python/click.js")
    console.log('____ step 1')
    const python = new Python
    console.log('____ step 2')
    const automator = python.DesktopAutomator();
    console.log('____ step 3')

    try {
        // Simple usage
        await automator.click(xPosition, yPosition);
        console.log('Click with python completed');
        ret = { success: 1, message: 'clickXY OK!', value: "click on X:" + xPosition + ", Y:" + yPosition, stop: 0 }
        return ret
    } catch (error) {
        console.error('Python Automation failed:', error);
        ret = { success: 0, message: 'clickXY KO!', stop: 1 }
        return ret
    }
}

/**
* ---------------------------------------------------------------------------- 
* @function
*  phoneConnect:  Establish a connection with Android Studio (we will see later if we need a parameter to specify "Android" or "Phone on USB")
* 
* @param {object} variables:            array of all the variables
*
*/
async function phoneConnect(variables) {
    let device = null
    device = await variables.setPhoneDevice() // Create a device for Android Phone
    if (!device) {
        ret = { success: 0, message: 'phoneConnect KO!', stop: 1 }
    } else {

        ret = { success: 1, message: "phoneConnect to " + device.model(), stop: 0 }
    }
    return ret
}


/**
* ---------------------------------------------------------------------------- 
* @function
*  phoneTap:  Simulate the tap on the phone
* 
* @param {object} data:                 all the parameters
* @param {object} variables:            array of all the variables
* @param {string} tapType:              text or element
* @param {string} tapValue:             element to tap
*
*/
async function phoneTap(data, variables, tapType, tapValue) {

    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");

    let device = await variables.getPhoneDevice() // get a device for Android Phone
    if (!device) { device = await variables.setPhoneDevice() } // Reset a device for Android Phone
    if (!device) {
        return { success: 0, message: 'phoneTap KO!', stop: 1 }
    }

    tapType = variables.evaluateVariable(tapType, true)
    tapValue = variables.evaluateVariable(tapValue, false)

    // Check if the phoneElement is a dictionary format
    if (tapValue[0] == '@') {
        variables.displayLog(1, 1, 'dictionary(' + tapValue + ')')
        const dataAPI = { projectID: data.projectID, code: tapValue, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            tapValue = result[0].label
        } else {
            variables.displayLog(1, 1, 'Dictionary: ' + tapValue + ' not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + tapValue + " in the dictionary!", stop: 1 }
        }
    }

    try {
        if (tapType == "text") {
            // ---- TEXT ------
            console.log("Tap with a text")
            const tapElt = { text: tapValue };
            await device.tap(tapElt);
        } else if (tapType == "element") {
            // ---- ELEMENT ------
            console.log("Tap with an element")
            const tapElt = { res: tapValue };
            await device.tap(tapElt);
        } else if (tapType == "web") {
            // ---- WEB ------
            const page = await variables.getPhonePage();
            const tapElt = page.locator(tapValue);
            await tapElt.waitFor({ state: 'visible', timeout: 10000 });
            await tapElt.click();
        } else {
            return { success: 0, message: 'phoneTap KO! - Invalid type: ' + tapType, stop: 1 }
        }

        return { success: 1, message: 'phoneTap OK!', stop: 0 }
    } catch (err) {
        if (err.message.includes('Timed out waiting for selector')) {
            return { success: 0, message: 'phoneTap KO! - Timed out waiting for selector', stop: 1 }
        } else {
            return { success: 0, message: 'phoneTap KO! ' + err.message, stop: 1 }
        }
    }


}


/**
* ---------------------------------------------------------------------------- 
* @function
*  phoneFill:  Simulate the fill of an element on the phone
* 
* @param {object} data:                 all the parameters
* @param {object} variables:            array of all the variables
* @param {string} phoneType:            type of element: "phone" or "web"
* @param {string} phoneElement:         element to fill
* @param {string} phoneValue:           Value to use to fill
*
*/
async function phoneFill(data, variables, phoneType, phoneElement, phoneValue) {

    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");

    let device = await variables.getPhoneDevice() // get a device for Android Phone
    if (!device) { device = await variables.setPhoneDevice() } // Reset a device for Android Phone
    if (!device) {
        return { success: 0, message: 'phoneFill KO!', stop: 1 }
    }

    phoneType = variables.evaluateVariable(phoneType, true)
    phoneElement = variables.evaluateVariable(phoneElement, true)
    phoneValue = variables.evaluateVariable(phoneValue, false)

    // Check if the phoneElement is a dictionary format
    if (phoneElement[0] == '@') {
        variables.displayLog(1, 1, 'dictionary(' + phoneElement + ')')
        const dataAPI = { projectID: data.projectID, code: phoneElement, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            phoneElement = result[0].label
        } else {
            variables.displayLog(1, 1, 'Dictionary: ' + phoneElement + ' not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + phoneElement + " in the dictionary!", stop: 1 }
        }
    }

    try {
        if (phoneType == 'phone') {
            // ---- PHONE -----
            const tapElt = { res: phoneElement };
            await device.fill(tapElt, phoneValue);
            return { success: 1, message: 'phoneFill OK!', stop: 0 }
        } else if (phoneType == 'web') {
            // ---- WEB ------
            const page = await variables.getPhonePage();
            // Use wait ForSelector to ensure the page is interactive
            const tapElt = page.locator(phoneElement);
            await tapElt.waitFor({ state: 'visible', timeout: 10000 });
            await tapElt.fill(phoneValue);
            return { success: 1, message: 'phoneFill OK!', stop: 0 }
        } else {
            return { success: 0, message: 'phoneFill KO! - Invalid type: ' + phoneType, stop: 1 }
        }

    } catch (err) {
        if (err.message.includes('Timed out waiting for selector')) {
            return { success: 0, message: 'phoneFill KO! - Timed out waiting for selector', stop: 1 }
        } else {
            return { success: 0, message: 'phoneFill KO! ' + err.message, stop: 1 }
        }
    }


}

/**
* ---------------------------------------------------------------------------- 
* @function
*  phonePress:  Simulate the press of a key on the phone
* 
* @param {object} data:                 all the parameters
* @param {object} variables:            array of all the variables
* @param {string} phoneType:            type of element: "phone" or "web"
* @param {string} phoneElement:         element to use
* @param {string} phoneKey:             Key to press
*
*/
async function phonePress(data, variables, phoneType, phoneElement, phoneKey) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");

    let device = await variables.getPhoneDevice() // get a device for Android Phone
    if (!device) { device = await variables.setPhoneDevice() } // Reset a device for Android Phone
    if (!device) {
        return { success: 0, message: 'phonePress KO!', stop: 1 }
    }

    phoneType = variables.evaluateVariable(phoneType, true)
    phoneElement = variables.evaluateVariable(phoneElement, false)
    phoneKey = variables.evaluateVariable(phoneKey, true)

    // Check if the phoneElement is a dictionary format
    if (phoneElement[0] == '@') {
        variables.displayLog(1, 1, 'dictionary(' + phoneElement + ')')
        const dataAPI = { projectID: data.projectID, code: phoneElement, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            phoneElement = result[0].label
        } else {
            variables.displayLog(1, 1, 'Dictionary: ' + phoneElement + ' not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + phoneElement + " in the dictionary!", stop: 1 }
        }
    }

    try {
        if (phoneType == 'phone') {
            // ---- PHONE ------
            if (phoneKey == 'Home') {
                console.log('Home key')
                // Keycode 3 is the Android Home Button
                await device.shell('input keyevent 3');
                console.log('Home key OK')
                // Sometimes a second press is needed if an app is in a deep sub-menu
                // or if the software keyboard is open.
                await device.shell('input keyevent 3');
                //await wait(1000); // Give the OS a moment to animate back to home
            } else {
                const tapElt = { res: phoneElement };
                await device.press(tapElt, phoneKey);
            }

            return { success: 1, message: 'phonePress OK!', stop: 0 }
        } else if (phoneType == 'web') {
            // ---- WEB ------
            const page = await variables.getPhonePage();
            await page.keyboard.press(phoneKey);
            await page.waitForLoadState("networkidle");
            return { success: 1, message: 'phonePress OK!', stop: 0 }
        } else {
            return { success: 0, message: 'phonePress KO! - Invalid type: ' + phoneType, stop: 1 }
        }


    } catch (err) {
        if (err.message.includes('Timed out waiting for selector')) {
            return { success: 0, message: 'phonePress KO! - Timed out waiting for selector', stop: 1 }
        } else {
            return { success: 0, message: 'phonePress KO! ' + err.message, stop: 1 }
        }
    }

}



/**
* ---------------------------------------------------------------------------- 
* @function
*  phoneUrl:  Launch the Chrome browser and go to a webpage
* 
* @param {object} data:                 all the parameters
* @param {object} variables:            array of all the variables
* @param {string} link:                 link to the wepage
*
*/
async function phoneUrl(data, variables, link) {
    const { getDictionaryByCode } = require("../../dictionary/dictionary.service.js");

    // evaluate the link
    link = variables.evaluateVariable(link, true)

    // Search the text in the dictionary 
    if (link[0] == '@') {
        const dataAPI = { projectID: data.projectID, code: link, language: '*', active: 1 }
        const result = await getDictionaryByCode(dataAPI);
        if (result.length) {
            link = result[0].label
            //console.log (link)
        } else {
            variables.displayLog(1, 1, 'Data not found in the dictionary!')
            return { success: 0, message: "Cannot find the code: " + link + " in the dictionary!", stop: 1 }
        }
    }


    let device = await variables.getPhoneDevice() // get a device for Android Phone
    if (!device) { device = await variables.setPhoneDevice() } // Reset a device for Android Phone
    if (!device) {
        return { success: 0, message: 'phonePress KO!', stop: 1 }
    }


    console.log("Launching Chrome...");
    const context = await device.launchBrowser({
        // Explicitly target the Chrome package to ensure no confusion
        pkg: 'com.android.chrome',
        // Increase timeout in case Android 16 is slow to bridge the socket
        timeout: 30000
    });

    console.log("Context created, requesting page...");

    // If newPage() hangs, try using the existing first page often created by default
    const pages = context.pages();
    const page = pages.length > 0 ? pages[0] : await context.newPage();

    console.log("Page ready!");
    variables.setPhonePage(page)
    await page.goto(link, { waitUntil: 'domcontentloaded' });
    return { success: 1, message: 'phoneUrl OK!', stop: 0 }
}



/**
 * ---------------------------------------------------------------------------- 
 * @function <OK>
 *  phoneCapture:  take a print screen of the phone
 * 
 * @param {object} data:        all the parameters
 * @param {object} variables:   array of all the variables
 * @param {string} phoneType:   type of element: "phone" or "web" 
 * @param {string} slotID:      slot number = 0: Error, 1 --> 5 User print screen 
 * @param {string} fullPage:    0 (default): Normal capture, 1: full page (work only for web page, not for phone) 
 *  
 */
async function phoneCapture(data, variables, phoneType, slotID, fullPage) {
    const fs = require('fs');

    try {

        let device = await variables.getPhoneDevice() // get a device for Android Phone
        if (!device) { device = await variables.setPhoneDevice() } // Reset a device for Android Phone
        if (!device) {
            return { success: 0, message: 'phoneCapture KO - No device connected!', stop: 1 }
        }

        phoneType = variables.evaluateVariable(phoneType, true)

        let picture = './printscreen/' + data.userID + '_image' + slotID + '.png'
        if (fullPage == undefined || fullPage == 0) fullPage = false
        else fullPage = true

        if (phoneType == 'phone') {
            // ---- PHONE -----
            console.log('printScreen: Phone', picture)
            const buffer = await device.screenshot();
            fs.writeFileSync(picture, buffer);
            return { success: 1, message: 'phoneCapture OK', slot: slotID, stop: 0 }
        } else if (phoneType == 'web') {
            // ---- WEB ------
            console.log('printScreen: Web', picture)
            const page = await variables.getPhonePage();
            await page.screenshot({ path: picture, fullPage: fullPage });
            return { success: 1, message: 'phoneCapture OK', slot: slotID, stop: 0 }
        } else {
            return { success: 0, message: 'phoneCapture KO! - Invalid type: ' + phoneType, stop: 1 }
        }

    } catch (err) {
        return { success: 0, message: 'Fatal Error: ' + err.message, stop: 1 }
    }
}



/**
 * ---------------------------------------------------------------------------- 
 * @function <OK>
 *  ODBC_Generic:  Store a generic ODBC Connection string
 * 
 * @param {object} data:            all the parameters
 * @param {object} variables:       array of all the variables
 * @param {string} connectString:   ODBC Connection string 
 *  
 */
async function ODBC_Generic(data, variables, connectString) {

    const ODBC = require('./odbc.library.js')


    try {

        let ret = ODBC.setConnectionString(connectString)
        console.log('ODBC_Generic', ret)
        return { success: 1, message: 'ODBC_Generic OK', stop: 0 }
    } catch (err) {
        return { success: 0, message: 'ODBC_Generic Fatal Error: ' + err.message, stop: 1 }
    }
}




/**
 * ---------------------------------------------------------------------------- 
 * @function <OK>
 *  ODBC_SQLServer:  Store a SQL Server ODBC Connection string
 * 
 * @param {object} data:        all the parameters
 * @param {object} variables:   array of all the variables
 * @param {string} Driver:      name of the driver
 * @param {string} Server:      name of the server
 * @param {string} Database:    name of the database
 * @param {string} DummyUser:   name of the dummy user
 * @param {string} Encrypyt:    yes / no
 * 
 */
async function ODBC_SQLServer(data, variables, Driver, Server, Database, DummyUser, Encrypyt) {

    const { getDummyuserByUser } = require("../../dummyuser/dummyuser.service.js");
    const { decryptPassword } = require("./password.library.js")
    const { getDatasetByCode } = require("../../dataset/dataset.service.js");
    const ODBC = require('./odbc.library.js')

    try {

        // Evaluate the dummyUser
        let UserId = ""
        let Password = ""

        if (DummyUser == undefined) {
            return { success: 0, message: "LoginUser: dummy User cannot be empty!", stop: 1 }
        } else {
            DummyUser = variables.evaluateVariable(DummyUser, true)
        }

        if (DummyUser == '<ME>') {
            DummyUser = data.userName
            variables.displayLog(1, 3, 'ME Dummy user: ' + DummyUser)

        } else if (DummyUser[0] == '#') {
            // Evaluate the dataset (if any)
            const dataAPI = { subprojectID: data.subprojectID, code: DummyUser, language: '*', active: 1 }
            const result = await getDatasetByCode(dataAPI);
            if (result.length) {
                DummyUser = result[0].label
            } else {
                variables.displayLog(1, 1, 'Data not found in the dataset! - dummyUser: ' + DummyUser)
                return { success: 0, message: "Cannot find the code: " + DummyUser + " in the dataset!", stop: 1 }
            }
        }

        variables.displayLog(1, 1, '***** Dummy user: ' + DummyUser)

        // get the active dummy user data
        const dataAPI = { projectID: data.projectID, dummy: DummyUser, active: 1 }
        const result = await getDummyuserByUser(dataAPI);
        if (result.length) {
            UserId = result[0].user
            Password = result[0].password
        } else {
            variables.displayLog(1, 1, '>>>>> Data not found in the dummy users!')
            return { success: 0, message: "Cannot find the user: " + DummyUser + " in the dummy users!", stop: 1 }
        }

        // Decrypt the password
        if (result[0].crypted) {
            let ret = await decryptPassword(Password)
            if (ret.success) {
                Password = ret.password
            } else {
                return { success: 0, message: "Cannot decrypt the password!", stop: 1 }
            }
        }

        let connectString = `Driver={${Driver}};Server=${Server};Database=${Database};UID=${UserId};PWD=${Password};Encrypt=${Encrypyt};`

        let ret = ODBC.setConnectionString(connectString)
        //console.log('ODBC_SQLServer', ret)
        return { success: 1, message: 'ODBC_SQLServer OK', stop: 0 }
    } catch (err) {
        return { success: 0, message: 'ODBC_SQLServer Fatal Error: ' + err.message, stop: 1 }
    }
}



/**
 * ---------------------------------------------------------------------------- 
 * @function <OK>
 *  ODBC_Oracle:  Store an Oracle ODBC Connection string
 * 
 * @param {object} data:        all the parameters
 * @param {object} variables:   array of all the variables
 * @param {string} Driver:      name of the driver
 * @param {string} Server:      name of the server
 * @param {string} Database:    name of the database
 * @param {string} DummyUser:   name of the dummy user
 * 
 */
async function ODBC_Oracle(data, variables, Driver, Server, Database, DummyUser) {

    const { getDummyuserByUser } = require("../../dummyuser/dummyuser.service.js");
    const { decryptPassword } = require("./password.library.js")
    const { getDatasetByCode } = require("../../dataset/dataset.service.js");
    const ODBC = require('./odbc.library.js')

    try {

        // Evaluate the dummyUser
        let UserId = ""
        let Password = ""

        if (DummyUser == undefined) {
            return { success: 0, message: "LoginUser: dummy User cannot be empty!", stop: 1 }
        } else {
            DummyUser = variables.evaluateVariable(DummyUser, true)
        }

        if (DummyUser == '<ME>') {
            DummyUser = data.userName
            variables.displayLog(1, 3, 'ME Dummy user: ' + DummyUser)

        } else if (DummyUser[0] == '#') {
            // Evaluate the dataset (if any)
            const dataAPI = { subprojectID: data.subprojectID, code: DummyUser, language: '*', active: 1 }
            const result = await getDatasetByCode(dataAPI);
            if (result.length) {
                DummyUser = result[0].label
            } else {
                variables.displayLog(1, 1, 'Data not found in the dataset! - dummyUser: ' + DummyUser)
                return { success: 0, message: "Cannot find the code: " + DummyUser + " in the dataset!", stop: 1 }
            }
        }

        variables.displayLog(1, 1, '***** Dummy user: ' + DummyUser)

        // get the active dummy user data
        const dataAPI = { projectID: data.projectID, dummy: DummyUser, active: 1 }
        const result = await getDummyuserByUser(dataAPI);
        if (result.length) {
            UserId = result[0].user
            Password = result[0].password
        } else {
            variables.displayLog(1, 1, '>>>>> Data not found in the dummy users!')
            return { success: 0, message: "Cannot find the user: " + DummyUser + " in the dummy users!", stop: 1 }
        }

        // Decrypt the password
        if (result[0].crypted) {
            let ret = await decryptPassword(Password)
            if (ret.success) {
                Password = ret.password
            } else {
                return { success: 0, message: "Cannot decrypt the password!", stop: 1 }
            }
        }

        Server = Server.replace(",", ":")
        Server = Server.replace(": ", ":")
        Server = Server.replace(" :", ":")

        let connectString = `Driver={${Driver}};Dbq=${Server}/${Database};UID=${UserId};PWD=${Password};`

        let ret = ODBC.setConnectionString(connectString)
        //console.log('ODBC_Oracle', ret)
        return { success: 1, message: 'ODBC_Oracle OK', stop: 0 }
    } catch (err) {
        return { success: 0, message: 'ODBC_Oracle Fatal Error: ' + err.message, stop: 1 }
    }
}



/**
 * ---------------------------------------------------------------------------- 
 * @function <OK>
 *  ODBC_MySQL:  Store a MySQL ODBC Connection string
 * 
 * @param {object} data:        all the parameters
 * @param {object} variables:   array of all the variables
 * @param {string} Driver:      name of the driver
 * @param {string} Server:      name of the server
 * @param {string} Database:    name of the database
 * @param {string} DummyUser:   name of the dummy user
 * 
 */
async function ODBC_MySQL(data, variables, Driver, Server, Database, DummyUser) {

    const { getDummyuserByUser } = require("../../dummyuser/dummyuser.service.js");
    const { decryptPassword } = require("./password.library.js")
    const { getDatasetByCode } = require("../../dataset/dataset.service.js");

    const ODBC = require('./odbc.library.js')

    try {

        // Evaluate the dummyUser
        let UserId = ""
        let Password = ""

        if (DummyUser == undefined) {
            return { success: 0, message: "LoginUser: dummy User cannot be empty!", stop: 1 }
        } else {
            DummyUser = variables.evaluateVariable(DummyUser, true)
        }

        if (DummyUser == '<ME>') {
            DummyUser = data.userName
            variables.displayLog(1, 3, 'ME Dummy user: ' + DummyUser)

        } else if (DummyUser[0] == '#') {
            // Evaluate the dataset (if any)
            const dataAPI = { subprojectID: data.subprojectID, code: DummyUser, language: '*', active: 1 }
            const result = await getDatasetByCode(dataAPI);
            if (result.length) {
                DummyUser = result[0].label
            } else {
                variables.displayLog(1, 1, 'Data not found in the dataset! - dummyUser: ' + DummyUser)
                return { success: 0, message: "Cannot find the code: " + DummyUser + " in the dataset!", stop: 1 }
            }
        }

        variables.displayLog(1, 1, '***** Dummy user: ' + DummyUser)

        // get the active dummy user data
        const dataAPI = { projectID: data.projectID, dummy: DummyUser, active: 1 }
        const result = await getDummyuserByUser(dataAPI);
        if (result.length) {
            UserId = result[0].user
            Password = result[0].password
        } else {
            variables.displayLog(1, 1, '>>>>> Data not found in the dummy users!')
            return { success: 0, message: "Cannot find the user: " + DummyUser + " in the dummy users!", stop: 1 }
        }

        // Decrypt the password
        if (result[0].crypted) {
            let ret = await decryptPassword(Password)
            if (ret.success) {
                Password = ret.password
            } else {
                return { success: 0, message: "Cannot decrypt the password!", stop: 1 }
            }
        }

        let connectString = `Driver={${Driver}};Server=${Server};Database=${Database};User=${UserId};Password=${Password};`

        let ret = ODBC.setConnectionString(connectString)
        //console.log('ODBC_MySQL', ret)

        return { success: 1, message: 'ODBC_MySQL OK', stop: 0 }
    } catch (err) {
        return { success: 0, message: 'ODBC_MySQL Fatal Error: ' + err.message, stop: 1 }
    }
}

/**
 * ---------------------------------------------------------------------------- 
 * @function <OK>
 *  ODBC_normalizeResult:  Normalize the ODBC result to avoid to much information, keep only the essential
 * 
 * @param {object} data:            all the parameters 
 * @param {string} result:          result of the ODBC.executeSql
 * @param {array} excludedFields:   array of column(s) to exclude from the ODBC result!
 *
 * 
 */
async function ODBC_normalizeResult(data, result, excludedFields = ['password', 'token', 'secret']) {
    const { getParametersByCode } = require("../../parameter/parameter.service.js");

    // Check if we have a parameter to exclude some columns of the database
    let dataAPI = { projectID: data.projectID, code: 'Secret Column' }
    const result1 = await getParametersByCode(dataAPI);
    if (result1.length) {
        let param = result1[0].paramValue
        excludedFields = param.split(",").map(field => field.trim()).filter(field => field.length > 0);
    }

    // Remove the secret columns
    const cleanRows = result.map(row => {
        const safe = { ...row };
        for (const field of excludedFields) delete safe[field];
        return safe;
    });

    //console.log ('Safe', cleanRows)

    return {
        rows: cleanRows,
        count: cleanRows.length,
        columns: result.columns
            ? result.columns.map(c => c.name)
            : Object.keys(cleanRows[0] ?? {})
    };
}


/**
 * ---------------------------------------------------------------------------- 
 * @function <OK>
 *  ODBC_ExecuteSQL:  Execute a SQL statement with an ODBC Connection
 * 
 * @param {object} data:        all the parameters
 * @param {object} variables:   array of all the variables
 * @param {string} Sql:         SQL statement
 * @param {Array} params:       parameter(s)
 * 
 */
async function ODBC_ExecuteSQL(data, variables, Sql, param) {

    const { getDatasetByCode } = require("../../dataset/dataset.service.js");

    const ODBC = require('./odbc.library.js')
    let returnCount = ''

    try {
        variables.setVariable("$Error", "0");
        parameters = param.split(';')
        console.log('Sql', Sql)
        console.log('parameters', parameters)
        const result = await ODBC.executeSql(Sql, parameters)


        // COMMIT for DML statements
        if (/^\s*(INSERT|UPDATE|DELETE)/i.test(Sql)) {
            if (result.count != undefined) {
                returnCount = 'Affected rows:' + result.count
                console.log('Affected rows:', result.count);
                variables.setVariable("$ODBCRow", result.count);
            }
        } else {
            // Store the result in http data (only for non DML)
            let code = "ODBC#" + data.userID
            const normalized = await ODBC_normalizeResult(data, result);
            //console.log('ODBC_ExecuteSQL', normalized)
            returnCount = 'rows:' + result.count
            variables.setVariable("$ODBCRow", result.count);

            let ret = await Store_HttpData(data, code, normalized)
            if (ret.success != 1) {
                variables.setVariable("$Error", "1");
                return { success: 0, message: "ODBC_ExecuteSQL: KO - no way to store the result of the request!", stop: 1 };
            }
        }

        return { success: 1, message: 'ODBC_ExecuteSQL OK', value: returnCount, stop: 0 }
    } catch (err) {
        variables.setVariable("$Error", "1");
        return { success: 0, message: 'ODBC_ExecuteSQL Fatal Error: ' + err.message, stop: 1 }
    }
}


/**
 * ---------------------------------------------------------------------------- 
 * @function <OK>
 *  ODBC_GetResult:  Get the ODBC result stored in the database
 *
 * @param {object} data:        all the parameters
 * @param {object} variables:   array of all the variables
 * 
 */
async function ODBC_GetResult(data, variables) {
    const { getHttpdataByCode } = require("../../httpdata/httpdata.service.js");

    try {

        // Get the http data
        let code = "ODBC#" + data.userID
        const dataAPI1 = { subprojectID: data.subprojectID, code: code };
        const result1 = await getHttpdataByCode(dataAPI1);
        variables.setVariable("$Error", "0");
        if (result1.length == 0) {
            console.log("httpdata not found! : " + code)
            variables.setVariable("$Error", "1");
            return { success: 0, message: "ODBC_GetResult: httpdata not found! : " + code, stop: 1 };
        }

        const dataResult = result1[0]
        let xmlData = JSON.parse(dataResult.jsondata);
        if (!xmlData) {
            console.log("httpSearchKeyValue: jsondata is empty!",);
            variables.setVariable("$Error", "1");
            return { success: 0, message: "ODBC_GetResult: transactionResponse is empty!", stop: 1 };
        }
        return { success: 1, message: "ODBC_GetResult: OK!", value: xmlData, stop: 0 };

    } catch (error) {
        return { success: 0, message: error.message, stop: 1 };
    }

}


/**
 * ---------------------------------------------------------------------------- 
 * @function <OK>
 *  ODBC_DataColumn:  Extract the columns of the previous ODBC process
 *
 * @param {object} data:        all the parameters
 * @param {object} variables:   array of all the variables
 * 
 * 
 */
async function ODBC_DataColumn(data, variables) {


    try {

        // Get the http data
        let xmlData = ''
        let ret = await ODBC_GetResult(data, variables)
        if (ret.success == 1) {
            xmlData = ret.value
        } else {
            return { success: 0, message: ret.message, stop: 1 };
        }
        console.log('XMLData', xmlData)
        return { success: 1, message: 'ODBC_DataColumn OK', value: xmlData.columns, stop: 0 };


    } catch (error) {
        return { success: 0, message: error.message, stop: 1 };
    }

}



/**
 * ---------------------------------------------------------------------------- 
 * @function <OK>
 *  ODBC_Data:  Extract the value of a record of the previous ODBC process
 *
 * @param {object} data:        all the parameters
 * @param {object} variables:   array of all the variables
 * @param {string} column:      name of the column to extract
 * @param {number} row:         row of the record 
 * @param {string} variable:    name of the variable to store the value
 * 
 */
async function ODBC_DataValue(data, variables, column, row, variable) {


    try {

        // Get the http data
        let xmlData = ''
        variables.setVariable("$Error", "0");
        let ret = await ODBC_GetResult(data, variables)
        if (ret.success == 1) {
            xmlData = ret.value
        } else {
            variables.setVariable("$Error", "1");
            return { success: 0, message: ret.message, stop: 1 };
        }
        if (row < 1 || row > xmlData.count) {
            variables.setVariable("$Error", "1");
            return { success: 0, message: "invalid row: " + row + " (row count: " + xmlData.count + ")", stop: 1 };
        }
        row = row - 1
        console.log('XMLData', xmlData.rows[row][column])
        variables.setVariable(variable, xmlData.rows[row][column]);

        return { success: 1, message: 'ODBC_DataValue OK', value: xmlData.rows[row][column], stop: 0 };


    } catch (error) {
        return { success: 0, message: error.message, stop: 1 };
    }

}



/**
 * ---------------------------------------------------------------------------- 
 * @function <OK>
 *  ODBC_DataCount:  Extract the number of a record of the previous ODBC process
 *
 * @param {object} data:        all the parameters
 * @param {object} variables:   array of all the variables
 * @param {string} variable:    name of the variable to store the value
 * 
 */
async function ODBC_DataCount(data, variables, variable) {


    try {

        // Get the http data
        let xmlData = ''
        variables.setVariable("$Error", "0");
        let ret = await ODBC_GetResult(data, variables)
        if (ret.success == 1) {
            xmlData = ret.value
        } else {
            variables.setVariable("$Error", "1");
            return { success: 0, message: ret.message, stop: 1 };
        }
        console.log('XMLData', xmlData.count)
        variables.setVariable(variable, xmlData.count);

        return { success: 1, message: 'ODBC_DataCount OK', value: xmlData.count, stop: 0 };


    } catch (error) {
        return { success: 0, message: error.message, stop: 1 };
    }

}


/**
* ---------------------------------------------------------------------------- 
* @function <OK>
*   evaluateFunction: convert a function name into a selenium function
*
* @param {object} page:                 playwright page
* @param {object} variables:            array of all the variables
* @param {string} name:                 name of the function
* @param {object} data:                 all the parameters
* @param {string} param1 --> param8:    parameter 1 to 8 of the function
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
*
 */
async function evaluateFunction(page, variables, name, data, param1, param2, param3, param4, param5, param6, param7, param8) {

    let delay = 2
    let ret

    //console.log('----------  Evaluate Function ----------------', name)
    //console.log (name)
    //console.log ('--------------------------')

    //variables.listVariable()
    //variables.setVariable('$Evaluate', 'OK')

    // Restore the page to the current tab (by default the first one)
    page = tabPage[tabPageCurrent]

    try {

        switch (name) {

            case 'debug':
                ret = await debug(variables, param1)
                return ret

            case 'url':
                ret = await url(page, variables, data, param1)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.value)
                return ret

            case 'getUrl':
                ret = await getUrl(page, variables, param1)
                return ret

            case 'getUrlTitle':
                ret = await getUrlTitle(page, variables, param1)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... Title: ' + ret.value)
                return ret

            case 'loginUser':
                ret = await loginUser(page, variables, data, param1, param2, param3)
                return ret

            case 'loginPassword':
                ret = await loginPassword(page, variables, data, param1, param2, param3)
                return ret

            case 'dummyExtraInfo':
                ret = await dummyExtraInfo(page, variables, data, param1, param2)
                await logfile(data.userID, 'Info', '... ' + ret.value)
                return ret

            case 'dummyLogin':
                ret = await dummyLogin(page, variables, data, param1, param2)
                await logfile(data.userID, 'Info', '... ' + ret.value)
                return ret

            case 'detectGUI':
                ret = await detectGUI(page, variables, data, param1, param2, param3, param4)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... patternID: ' + ret.patternID)
                return ret

            case 'switchToFrame':
                ret = await switchToFrame(page, variables, data, param1)
                return ret

            case 'openNewTab':
                ret = await openNewTab(variables, data, param1)
                return ret

            case 'switchTab':
                ret = await switchTab(param1)
                return ret

            case 'clickNewTab':
                ret = await clickNewTab(page, data, variables, param1)
                return ret

            case 'closeTab':
                ret = await closeTab(param1)
                return ret

            // case 'closeBrowserTab':
            //     ret = await closeBrowserTab(page)
            //     return ret

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
                ret = await click(page, data, variables, param1, param2, param3)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                return ret

            case 'JSclick':
                ret = await JSclick(page, data, variables, param1, param2)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                return ret

            case 'doubleClick':
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                ret = await doubleClick(page, data, variables, param1, param2)
                return ret

            case 'uploadFile':
                ret = await uploadFile(page, data, variables, param1, param2)
                return ret

            case 'getTableData':
                ret = await getTableData(page, data, variables, param1, param2, param3, param4)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                await logfile(data.userID, 'Info', '... ' + ret.value)
                return ret

            case 'getTableHeader':
                ret = await getTableHeader(page, data, variables, param1, param2, param3, param4)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                await logfile(data.userID, 'Info', '... ' + ret.value)
                return ret

            case 'setTableData':
                ret = await setTableData(page, data, variables, param1, param2, param3, param4)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                return ret

            case 'countTableRow':
                ret = await countTableRow(page, data, variables, param1, param2)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                await logfile(data.userID, 'Info', '... ' + ret.value)
                return ret

            case 'searchTableData':
                ret = await searchTableData(page, data, variables, param1, param2, param3, param4)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                await logfile(data.userID, 'Info', '... $Row: ' + ret.value)
                return ret

            case 'clickCell':
                ret = await clickCell(page, data, variables, param1, param2, param3, param4)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                return ret

            case 'enable':
                ret = await enable(page, data, variables, param1)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                return ret

            case 'isExist':
                ret = await isExist(page, data, variables, param1, param2, param3)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                await logfile(data.userID, 'Info', '... ' + ret.message + ' : ' + ret.value)
                return ret

            case 'isCheck':
                ret = await isCheck(page, data, variables, param1, param2, param3)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                await logfile(data.userID, 'Info', '... ' + ret.message + ' : ' + ret.value)
                return ret

            case 'ask':
                //console.log('ASK: ' + param1 + ', ' + param2 + ', ' + param3 + ', ' + param4)
                ret = await ask(page, variables, param1, param2, param3, param4)
                await logfile(data.userID, 'Info', '... value is: ' + ret.value)
                return ret

            case 'email':
                ret = await email(variables, data, param1, param2, param3, param4)
                if (ret == undefined) ret = { success: 1, message: 'Email sent OK', stop: 0 }
                await logfile(data.userID, 'Info', '... ' + ret.message)
                return ret

            case 'check':
                ret = await check(page, data, variables, param1, param2)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                return ret

            case 'uncheck':
                ret = await uncheck(page, data, variables, param1, param2)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                return ret

            case 'isEnable':
                ret = await isEnable(page, data, variables, param1, param2, param3)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                return ret

            case 'setValue':
                ret = await setValue(page, data, variables, param1, param2, param3)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.value)
                return ret

            case 'select':
                ret = await select(page, data, variables, param1, param2, param3, param4)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... $Value=' + ret.value)
                return ret

            case 'selectCount':
                ret = await selectCount(page, data, variables, param1, param2)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.value)
                return ret


            case 'countElement':
                ret = await countElement(page, data, variables, param1, param2, param3)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.value)
                return ret

            case 'getValue':
                ret = await getValue(page, data, variables, param1, param2)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                await logfile(data.userID, 'Info', '... ' + ret.value)
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

            case 'popupKeys':
                ret = popupKeys(page, data, variables, param1, param2)
                return ret

            case 'showAllPopups':
                ret = showAllPopups(page, data, variables)
                return ret

            case 'waitFor':
                ret = await waitFor(page, data, variables, param1, param2, param3)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                await logfile(data.userID, 'Info', '... ' + ret.message)
                return ret

            case 'waitForNot':
                ret = await waitForNot(page, data, variables, param1, param2, param3)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                return ret

            case 'isVisible':
                ret = await isVisible(page, data, variables, param1, param2, param3)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                return ret

            case 'waitInvisible':
                ret = await waitInvisible(page, data, variables, param1, param2, param3)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                return ret

            case 'setVariable':
                ret = await setVariable(variables, param1, param2)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + param1 + ' = ' + ret.value)
                return ret

            case 'listVariable':
                //variables.displayLog(1, 1,'listVariable')
                ret = await listVariable(data.userID, variables)
                ret = { success: 1, message: 'listVariable OK', stop: 0 }
                return ret

            // case 'refreshURL':
            //     //variables.displayLog(1, 1,'listVariable')
            //     ret = await refreshURL(data.userID, variables)
            //     ret = { success: 1, message: 'refreshURL OK', stop: 0 }
            //     return ret

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
                ret = await printScreen(page, data, param1, param2)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... Print screen is in the slot: ' + ret.slot)
                return ret

            case 'pause':
                ret = await pause(page, variables, data.subprojectID, param1);
                return ret

            case 'stopTest':
                ret = await stopTest(variables, param1, param2)
                return ret

            case 'setReference':
                ret = await setReference(variables, data.projectID, data.userID, param1, param2, param3)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.message)
                return ret

            case 'getReference':
                ret = await getReference(variables, data.projectID, data.userID, param1, param2)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.message)
                return ret

            case 'getData':
                ret = await getData(data, variables, param1, param2)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.message)
                return ret

            case 'setData':
                ret = await setData(data, variables, param1, param2, param3)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.message)
                return ret

            case 'JSinput':
                ret = await JSinput(page, data, variables, param1, param2, param3)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.message)
                return ret

            case 'skipIt':
                ret = await skipIt(variables, param1, param2)
                return ret

            case 'skipDescribe':
                ret = await skipDescribe(variables, param1, param2)
                return ret

            case 'epoch':
                ret = await epoch(variables, param1, param2, param3)
                await logfile(data.userID, 'Info', '... ' + ret.value)
                return ret

            case 'epochDate':
                ret = await epochDate(variables, param1, param2, param3)
                await logfile(data.userID, 'Info', '... ' + ret.value)
                return ret

            case 'epochAddHour':
                ret = await epochAddHour(variables, param1, param2, param3, param4)
                await logfile(data.userID, 'Info', '... ' + ret.value)
                return ret

            case 'epochAddMinute':
                ret = await epochAddMinute(variables, param1, param2, param3, param4)
                await logfile(data.userID, 'Info', '... ' + ret.value)
                return ret

            case 'epochAddSecond':
                ret = await epochAddSecond(variables, param1, param2, param3, param4)
                await logfile(data.userID, 'Info', '... ' + ret.value)
                return ret

            // case 'getAllElements':
            //     ret = await getAllElements(page, variables, data, param1)
            //     return ret

            case 'rule':
                ret = await executeRules(page, variables, data, param1, param2, param3, param4)
                variables.displayLog(3, 1, 'Rule - Ret: ', ret)
                return ret

            case 'dictionary':
                ret = await dictionary(variables, data, param1, param2, param3)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.value)
                return ret

            case 'removeAttribute':
                ret = await removeAttribute(page, data, variables, param1, param2)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                await logfile(data.userID, 'Info', '... Remove attribute - return:' + ret.success)
                return ret

            case 'setAttribute':
                ret = await setAttribute(page, data, variables, param1, param2, param3)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                await logfile(data.userID, 'Info', '... Set attribute: ' + ret.value)
                return ret

            case 'readAttribute':
                ret = await readAttribute(page, data, variables, param1, param2, param3)
                if (ret.success == 1 && ret.frameID > 0) await logfile(data.userID, 'Info', '... Detected in the frame: ' + ret.frameID)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.value)
                return ret

            case 'callScenario':
                ret = await callScenario(data, page, variables, param1)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.value)
                return ret

            case 'callSuite':
                ret = await callSuite(data, page, variables, param1)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.value)
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
                    await logfile(data.userID, 'Info', '... ' + param1)
                    await logfile(data.userID, 'Info', '... ' + ret.value)
                }
                return ret

            case 'httpPost':
                ret = await httpPost(data, variables, param1, param2, param3, param4, param5)
                //if (ret.success == 1) await logfile(data.userID, 'Info', '... httpPost OK')
                return ret

            case 'httpPut':
                ret = await httpPut(data, variables, param1, param2, param3, param4)
                //if (ret.success == 1) await logfile(data.userID, 'Info', '... httpPut OK')
                return ret

            case 'httpGet':
                ret = await httpGet(data, variables, param1, param2, param3, param4)
                //if (ret.success == 1) await logfile(data.userID, 'Info', '... httpGet OK')
                return ret

            case 'httpDelete':
                ret = await httpDelete(data, variables, param1, param2, param3)
                //if (ret.success == 1) await logfile(data.userID, 'Info', '... httpDelete OK')
                return ret

            case 'SAML_Assertion':
                ret = await SAML_Assertion(page, data, variables, param1, param2, param3, param4)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.message)
                return ret

            case 'SAML_Transaction':
                ret = await SAML_Transaction(page, data, variables, param1, param2, param3, param4)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.message)
                return ret

            case 'SOAP_postData':
                ret = await SOAP_postData(data, variables, param1, param2, param3, param4, param5)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.message)
                return ret

            case 'httpSearchKeyValue':
                ret = await httpSearchKeyValue(page, data, variables, param1, param2, param3, param4, param5, param6, param7, param8)
                if (ret.success == 1 && ret.value != 99) await logfile(data.userID, 'Info', '... ' + ret.value)
                return ret

            case 'httpKeyCount':
                ret = await httpKeyCount(page, data, variables, param1, param2, param3, param4)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.value)
                return ret

            case 'imageDifference':
                ret = await imageDifference(page, data, variables, param1, param2, param3, param4, param5, param6, param7, param8)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.message)
                return ret

            case 'imageBaseline':
                ret = await imageBaseline(page, data, variables, param1, param2, param3, param4, param5, param6, param7)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.message)
                return ret

            case 'imageDifferenceData':
                ret = await imageDifferenceData(variables, param1, param2)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.value)
                return ret

            case 'clickXY':
                ret = await clickXY(variables, param1, param2)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.value)
                return ret

            case 'phoneConnect':
                ret = await phoneConnect(variables)
                if (ret.success == 1) {
                    await logfile(data.userID, 'Info', ret.message)
                }
                else await logfile(data.userID, 'Info', '... no way to connect to the Phone!')
                return ret

            case 'phoneTap':
                ret = await phoneTap(data, variables, param1, param2)
                return ret

            case 'phoneFill':
                ret = await phoneFill(data, variables, param1, param2, param3)
                return ret

            case 'phonePress':
                ret = await phonePress(data, variables, param1, param2, param3)
                return ret

            case 'phoneUrl':
                ret = await phoneUrl(data, variables, param1)
                return ret

            case 'phoneCapture':
                ret = await phoneCapture(data, variables, param1, param2, param3)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... Print screen is in the slot: ' + ret.slot)
                return ret

            case 'ODBC_Generic':
                ret = await ODBC_Generic(data, variables, param1)
                return ret

            case 'ODBC_SQLServer':
                ret = await ODBC_SQLServer(data, variables, param1, param2, param3, param4, param5)
                return ret

            case 'ODBC_Oracle':
                ret = await ODBC_Oracle(data, variables, param1, param2, param3, param4)
                return ret

            case 'ODBC_MySQL':
                ret = await ODBC_MySQL(data, variables, param1, param2, param3, param4)
                return ret

            case 'ODBC_ExecuteSQL':
                ret = await ODBC_ExecuteSQL(data, variables, param1, param2)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.value)
                return ret

            case 'ODBC_DataColumn':
                ret = await ODBC_DataColumn(data, variables)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.value)
                return ret

            case 'ODBC_DataValue':
                ret = await ODBC_DataValue(data, variables, param1, param2, param3)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.value)
                return ret

            case 'ODBC_DataCount':
                ret = await ODBC_DataCount(data, variables, param1)
                if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.value)
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
                parameter5: tests[index].parameter5, parameter6: tests[index].parameter6, parameter7: tests[index].parameter7, parameter8: tests[index].parameter8,
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
                                ret = await robot.evaluateFunction(page, variables, 'logfile', data, item.action, '[' + item.position + '] Loop (' + identification + ') ' + item.comment)

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
                                    ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Loop', '[' + item.position + '] Loop (' + identification + ') ' + loopInfo[loopID].comment)
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
                                // Here, we execute the function defined by the Tester
                                ret = await robot.evaluateFunction(page, variables, item.functionName, data, item.parameter1, item.parameter2, item.parameter3, item.parameter4, item.parameter5, item.parameter6, item.parameter7, item.parameter8)

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
    openNewTab: openNewTab,
    switchTab: switchTab,
    clickNewTab: clickNewTab,
    closeTab: closeTab,
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
    getUrlTitle: getUrlTitle,
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
    //refreshURL: refreshURL,
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
    getTableData: getTableData,
    getTableHeader: getTableHeader,
    setTableData: setTableData,
    countTableRow: countTableRow,
    searchTableData: searchTableData,
    clickCell: clickCell,
    uploadFile: uploadFile,
    skipIt: skipIt,
    skipDescribe: skipDescribe,
    executeRules: executeRules,
    callScenario: callScenario,
    callSuite: callSuite,
    startTimer: startTimer,
    stopTimer: stopTimer,
    promptAI: promptAI,
    setBrowserMiddelware: setBrowserMiddelware,
    httpGet: httpGet,
    httpPost: httpPost,
    SAML_Assertion: SAML_Assertion,
    SAML_Transaction: SAML_Transaction,
    SOAP_postData: SOAP_postData,
    httpSearchKeyValue: httpSearchKeyValue,
    httpKeyCount: httpKeyCount,
    imageDifference: imageDifference,
    imageBaseline: imageBaseline,
    imageDifferenceData: imageDifferenceData,
    popupKeys: popupKeys,
    showAllPopups: showAllPopups,
    phoneConnect: phoneConnect,
    phoneTap: phoneTap,
    phoneFill: phoneFill,
    phonePress: phonePress,
    phoneUrl: phoneUrl,
    phoneCapture: phoneCapture,
    ODBC_Generic: ODBC_Generic,
    ODBC_SQLServer: ODBC_SQLServer,
    ODBC_Oracle: ODBC_Oracle,
    ODBC_MySQL: ODBC_MySQL,
    ODBC_ExecuteSQL: ODBC_ExecuteSQL,
    ODBC_DataColumn: ODBC_DataColumn,
    ODBC_DataValue: ODBC_DataValue,
    ODBC_DataCount: ODBC_DataCount

};
