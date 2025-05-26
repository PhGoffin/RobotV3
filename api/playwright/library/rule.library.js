/**
* @author 	Philippe Goffin
* @name   	string utility
* @property	javascript 
*
* @description 
*  The rules engine
*
* @version 
* V1.0 PGO	03/02/2024	Initial version   
*
*/

const express = require("express")



/**
 * @function
 *   specialFunction: execute a function from the library
 *
 * @param {object} page:         playwright page
 * @param {object} variables:    array of all the variables
 * @param {number} data:         all the parameters
 * @param {string} rulePosition: Position of the rule in the set
 * @param {string} ruleName:     Name of the rule
 * @param {string} param1:       Parameter 1
 * @param {string} param2:       Parameter 2
 * @param {string} param3:       Parameter 3
 * @param {string} param4:       Parameter 4
 * 
 */
async function specialFunction(page, variables, data, rulePosition, functionName, param1, param2, param3, param4) {
    const { logfile, speaking, dictionary, setReference, getReference, loginUser, loginPassword, dummyExtraInfo, dummyLogin, pause, getData, setData, debug, email,
        pressEnter, pressEscape, pressTab, click, doubleClick, setValue, getValue, select, selectCount, getElementDummy, setValueDummy, ask, waitInvisible,
        JSclick, JSinput, isExist, isCheck, isVisible, url, waitFor, waitForNot, setVariable, setFocus, refreshURL, printScreen, executeRules, newTab, newWindow,
        enable, removeAttribute, setAttribute, readAttribute, acceptPopup, cancelPopup, switchToFrame, switchToBrowserTab, uploadFile, callScenario, callSuite,
        epoch, epochDate, epochAddHour, epochAddMinute, epochAddSecond, skipIt, skipDescribe, detectGUI, keyboard, startTimer, stopTimer,
        getTableData, getTableHeader, setTableData, clickCell, countTableRow, searchTableData } = require("./robot.library")


    if (param1 == undefined) param1 = ''
    if (param2 == undefined) param2 = ''
    if (param3 == undefined) param3 = ''
    if (param4 == undefined) param4 = ''

    let originalParam1 = param1
    let originalParam2 = param2
    let originalParam3 = param3
    let originalParam4 = param4


    param1 = variables.evaluateVariable(param1.trim())
    //param1 = param1.replace(/'/g, "");
    param2 = variables.evaluateVariable(param2.trim())
    //param2 = param2.replace(/'/g, "");
    param3 = variables.evaluateVariable(param3.trim())
    //param3 = param3.replace(/'/g, "");
    param4 = variables.evaluateVariable(param4.trim())

    variables.displayLog(2, 2, 'special function: ' + functionName + ', param1: ' + param1 + ', param2: ' + param2 + ', param3: ' + param3)
    let ret = 0

    switch (functionName) {

        case '#Describe':
            //await logfile(data.userID, 'Describe', '--> (R' + rulePosition + ') Describe : ' + param1)
            break
        case '#It':
            //await logfile(data.userID, 'It', '--> (R' + rulePosition + ') It : ' + param1)
            break
        case '#debug':
            ret = await debug(variables, param1)
            break
        case '#printScreen':
            ret = await printScreen(page, data, param1)
            break
        case '#ask':
            ret = await ask(page, variables, param1, param2, param3, param4)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3 + ' : ' + param4)
            return ret
        case '#email':
            ret = await email(variables, data, param1, param2, param3, param4)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + ret.message)
            return ret
        case '#url':
            ret = await url(page, variables, data.projectID, param1)
            page.manage().window().maximize();
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1)
            return ret
        case '#newTab':
            ret = await newTab(page)
            return ret
        case '#newWindow':
            ret = await newWindow(page)
            return ret
        case '#loginUser':
            ret = await loginUser(page, variables, data, param1, param2, param3)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3)
            return ret
        case '#loginPassword':
            ret = await loginPassword(page, variables, data, param1, param2, param3)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3)
            return ret
        case '#dummyExtraInfo':
            ret = await dummyExtraInfo(page, variables, data, param1, param2)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2)
            return ret
        case '#dummyLogin':
            ret = await dummyLogin(page, variables, data, param1, param2)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2)
            return ret
        case '#setFocus':
            ret = await setFocus(page, data, variables, param1, param2)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2)
            return ret
        case '#click':
            ret = await click(page, data, variables, param1, param2)
            //await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 )
            return ret
        case '#JSclick':
            ret = await JSclick(page, data, variables, param1, param2, param3)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3)
            return ret
        case '#doubleClick':
            ret = await doubleClick(page, data, variables, param1, param2)
            return ret
        case '#JSinput':
            ret = await JSinput(page, data, variables, param1, param2, param3)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3)
            return ret
        case '#keyboard':
            ret = await keyboard(page, data, variables, param1)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1)
            return ret
        case '#enable':
            ret = await enable(page, data, variables, param1)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1)
            return ret
        case '#removeAttribute':
            ret = await removeAttribute(page, data, variables, param1, param2)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2)
            return ret
        case '#setAttribute':
            ret = await setAttribute(page, data, variables, param1, param2, param3)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3)
            return ret
        case '#readAttribute':
            ret = await readAttribute(page, data, variables, param1, param2, param3)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3)
            return ret
        case '#pressEscape':
            ret = await pressEscape(page)
            await logfile(data.userID, 'Info', '... ' + functionName)
            return ret
        case '#pressEnter':
            ret = await pressEnter(page)
            await logfile(data.userID, 'Info', '... ' + functionName)
            return ret
        case '#pressTab':
            ret = await pressTab(page, param1)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1)
            return ret
        case '#acceptPopup':
            ret = await acceptPopup(page, variables)
            await logfile(data.userID, 'Info', '... ' + functionName)
            return ret
        case '#cancelPopup':
            ret = await cancelPopup(page, variables)
            await logfile(data.userID, 'Info', '... ' + functionName)
            return ret
        case '#switchToFrame':
            ret = await switchToFrame(page, variables, data, param1)
            return ret
        case '#switchToBrowserTab':
            ret = await switchToBrowserTab(page, param1)
            return ret
        case 'closeBrowserTab':
            ret = await closeBrowserTab(page)
            return ret
        case '#waitFor':
            ret = await waitFor(page, data, variables, param1, param2, param3)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3)
            return ret
        case '#waitForNot':
            ret = await waitForNot(page, data, variables, param1, param2, param3)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3)
            return ret
        case '#setValue':
            ret = await setValue(page, data, variables, param1, param2, param3)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3)
            return ret
        case '#getValue':
            ret = await getValue(page, data, variables, param1, param2)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2)
            return ret
        case '#select':
            ret = await select(page, data, variables, param1, param2, param3)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3)
            return ret
        case '#selectCount':
            ret = await selectCount(page, data, variables, param1, param2)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2)
            if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.value)
            return ret
        case '#isExist':
            ret = await isExist(page, data, variables, param1, param2, param3)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3)
            return ret
        case '#isCheck':
            ret = await isCheck(page, data, variables, param1, param2, param3)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3)
            return ret
        case '#isVisible':
            ret = await isVisible(page, data, variables, param1, param2, param3)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3)
            return ret
        case '#waitInvisible':
            ret = await waitInvisible(page, data, variables, param1, param2, param3)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3)
            return ret
        case '#setVariable':
            ret = await setVariable(variables, param1, param2)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2)
            return ret
        case '#listVariable':
            break
        case '#refreshURL':
            ret = await refreshURL(page, data, variables)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2)
            return ret
        case '#speak':
            speaking(param1)
            //await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1)
            break
        case '#logfile':
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1)
            break
        case '#message':
            await logfile(data.userID, param2, param1)
            break
        case '#pause':
            await pause(page, variables, data.subprojectID, param1)
            break
        case '#setReference':
            await setReference(variables, data.projectID, data.userID, param1, param2, param3)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3)
            break
        case '#getReference':
            await getReference(variables, data.projectID, data.userID, param1, param2)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2)
            break
        case '#getData':
            ret = await getData(data, variables, param1, param2)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2)
            if (ret.success == 1) await logfile(data.userID, 'Info', '... ' + ret.message)
            break
        case '#setData':
            await setData(data, variables, param1, param2, param3)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3)
            break
        case '#epoch':
            await epoch(variables, param1, param2, param3)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3)
            break
        case '#epochDate':
            await epochDate(variables, param1, param2, param3)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3)
            break
        case '#epochAddHour':
            await epochAddHour(variables, param1, param2, param3, param4)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3 + ' : ' + param4)
            break
        case '#epochAddMinute':
            await epochAddMinute(variables, param1, param2, param3, param4)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3 + ' : ' + param4)
            break
        case '#epochAddSecond':
            await epochAddSecond(variables, param1, param2, param3, param4)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3 + ' : ' + param4)
            break
        case '#getTableData':
            await getTableData(page, data, variables, param1, param2, param3, param4)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3 + ' : ' + param4)
            break
        case '#getTableHeader':
            await getTableHeader(page, data, variables, param1, param2, param3, param4)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3 + ' : ' + param4)
            break
        case '#setTableData':
            await setTableData(page, data, variables, param1, param2, param3, param4)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3 + ' : ' + param4)
            break
        case '#countTableRow':
            await countTableRow(page, data, variables, param1, param2)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2)
            break
        case '#searchTableData':
            await searchTableData(page, data, variables, param1, param2, param3, param4)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3 + ' : ' + param4)
            break
        case '#clickCell':
            await clickCell(page, data, variables, param1, param2, param3, param4)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3 + ' : ' + param4)
            break
        case '#uploadFile':
            await uploadFile(page, data, variables, param1, param2)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3 + ' : ' + param4)
            break
        case '#skipIt':
            ret = await skipIt(variables, param1, param2)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + originalParam1 + ' --> (' + param1 + ') : ' + param2)
            return ret
        case '#skipDescribe':
            ret = await skipDescribe(variables, param1, param2)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + originalParam1 + ' --> (' + param1 + ' : ' + param2)
            return ret
        case '#detectGUI':
            ret = await detectGUI(page, variables, data, param1, param2, param3, param4)
            //await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3 + ' : ' + param4)
            if (ret.success == 1) await logfile(data.userID, 'Info', '... patternID: ' + ret.patternID)
            else await logfile(data.userID, 'Warning', '... Cannot detect ' + param2)
            return ret
        case '#dictionary':
            ret = await dictionary(variables, data, param1, param2, param3)
            if (ret.success == 1) await logfile(data.userID, 'Info', '... value: ' + ret.value)
            else await logfile(data.userID, 'Error', '... Cannot detect ' + param1)
            return ret
        case '#indexOf':
            ret = await _indexOf(variables, param1, param2, param3)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3)
            return ret
        case '#substring':
            ret = await _substring(variables, param1, param2, param3, param4)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3 + ' : ' + param4)
            return ret
        case '#rule':
            ret = await executeRules(page, variables, data, param1, param2, param3, param4)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2 + ' : ' + param3 + ' : ' + param4)
            variables.displayLog(3, 1, 'Rule - Ret: ', ret)
            return ret
        case '#callScenario':
            ret = await callScenario(data, page, variables, param1)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1)
            return ret
        case '#callSuite':
            ret = await callSuite(data, page, variables, param1)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1)
            return ret
        case '#startTimer':
            ret = await startTimer(data, page, variables, param1)
            await logfile(data.userID, 'Info', '... ' + functionName  + ' : ' + param1 )
            return ret
        case '#stopTimer':
            ret = await stopTimer(data, page, variables, param1, param2)
            await logfile(data.userID, 'Info', '... ' + functionName + ' : ' + param1 + ' : ' + param2)
            return ret


        default:
            variables.displayLog(1, 1, 'No special function with the name: ' + functionName)
            return { success: 0, message: 'special function: ' + functionName + ' unknown!', stop: 1 }
    }


    return { success: 1, message: 'special function - Name: ' + functionName + ' OK!', stop: 0 }
}



/**
* @function
*   _indexOf: execute the normal javascript function indexOf
*
* @param {object} variables:    array of all the variables
* @param {string} fullText:     full text 
* @param {string} searchFor:    text to search into the full text
* @param {string} variable:     variable name starting with §
* 
*/
async function _indexOf(variables, fullText, searchFor, variable) {

    fullText = variables.evaluateVariable(fullText)
    if (fullText[0] == "'") fullText = fullText.slice(1, -1)
    searchFor = variables.evaluateVariable(searchFor)
    if (searchFor[0] == "'") searchFor = searchFor.slice(1, -1)

    // variables.displayLog(1, 3, 'fullText: ' + fullText)
    // variables.displayLog(1, 3, 'searchFor: ' + searchFor)
    // variables.displayLog(1, 3, 'variable: ' + variable)

    let i = fullText.indexOf(searchFor)
    //variables.displayLog(1, 3, 'Return - i: ' + i)
    variables.setVariable(variable, i);
    return { success: 1, message: '_indexOf OK', stop: 0 }

}



/**
* @function
*   _substring: execute the normal javascript function substring
*
* @param {object} variables:    array of all the variables
* @param {string} fullText:     full text 
* @param {string} starting:     starting position
* @param {string} length:       length of the extraction
* @param {string} variable:     variable name starting with §
* 
*/
async function _substring(variables, fullText, starting, length, variable) {

    fullText = variables.evaluateVariable(fullText)
    if (fullText[0] == "'") fullText = fullText.slice(1, -1)
    starting = variables.evaluateVariable(starting)
    if (length == undefined) length = 0
    else length = variables.evaluateVariable(length)

    // variables.displayLog(1, 3, 'fullText: ' + fullText)
    // variables.displayLog(1, 3, 'starting: ' + starting)
    // variables.displayLog(1, 3, 'length: ' + length)
    // variables.displayLog(1, 3, 'variable: ' + variable)

    let str = ''
    if (length == '0') {
        // variables.displayLog(1, 3, 'str = ' + fullText + '.substring(' + starting + ')')
        str = fullText.substring(starting)
    } else {
        // variables.displayLog(1, 3, 'str = ' + fullText + '.substring(' + starting + ', ' + length + ')')
        str = fullText.substring(starting, length)
    }

    // variables.displayLog(1, 3, 'Return - str: ' + str)
    variables.setVariable(variable, str);
    return { success: 1, message: '_substring OK', stop: 0 }

}


/**
 * @function
 *   execRules: execute the rules
 *
 * @param {object} page:         playwright page
 * @param {object} variables:    array of all the variables
 * @param {number} data:         all the parameters
 * @param {number} ruleName:     Name of the rule
 * 
 */

/* --------------------------------------------------------------------------- 
*  Return value:   success       stop    skipIt  skipDescribe StopAll
*                      1           0
*                      1           1        Yes (no error)
*                      1           2                Yes
*                      0           0        Yes (with error)  
*                      0           1                           Yes
* --------------------------------------------------------------------------- 
*/

async function execRules(page, variables, data, ruleName) {
    const { getRulesByCode } = require("../../rule/rule.service");
    const { logfile } = require("./robot.library")
    const { Left, Right } = require("./string.library.js");

    variables.displayLog(1, 1, '*****************')
    variables.displayLog(1, 1, '***** rules *****')
    variables.displayLog(1, 1, '*****************')


    // Read the rules
    const dataAPI = { projectID: data.projectID, ruleName: ruleName }
    const rules = await getRulesByCode(dataAPI);
    if (!rules.length) {
        return { success: 0, message: 'No rule for: ' + ruleName, stop: 0 }
    }


    // console.log ('---------------------------------------------')
    // console.log (rules)
    // console.log ('---------------------------------------------')

    await logfile(data.userID, 'Message', '**>> Rule: ' + ruleName)
    let lastCondition = false   // used to be compared with the 'skip' statement (ruleContinue = 0)
    let expression = ''         // expression to be evaluated
    let expr = ''               // result of evaluation of the expression
    let specialFlag = 0         // Special Function flag
    let skipIT = 0              // Skip the It (inside a rule)
    let skipDescribe = 0        // Skip the Describe (inside a rule)

    // -------------------------------------------
    // Loop through all the tests of the scenario
    // -------------------------------------------
    for (const item of rules) {
        variables.displayLog(1, 2, '*************************************')
        variables.displayLog(1, 2, '***** (' + item.position + ')' + 'Rule: ' + item.comment)
        variables.displayLog(1, 2, '*************************************')
        if (!item.ruleContinue && lastCondition) {
            variables.displayLog(1, 1, '     skipping the rule: ' + item.position)
            //await logfile(data.userID, 'Info', 'Skipping (' + item.position + ') ' + item.comment)
        } else {
            // evaluate the variables of the rule condition
            expr = variables.evaluateVariable(item.ruleCondition)
            if (expr == '<N/A>') {
                variables.displayLog(1, 3, 'Error in the evaluation of the variables of the rule condition - Name (' + item.position + ') ' + ruleName + ', condition: ' + item.ruleCondition)
                return { success: 0, message: 'Error in the evaluation of the variables of the rule condition - Name (' + item.position + ') ' + ruleName + ', condition: ' + item.ruleCondition, stop: 1 }
            }
            // Evaluate the condition expression
            try {
                if (Left(expr, 3) == "' '") {
                    expr = expr.substring(2)
                }
                variables.displayLog(1, 3, 'Condition: ' + expr)
                lastCondition = await eval(expr);
                variables.displayLog(1, 3, 'Condition: ==> ' + lastCondition)
            }
            catch (err) {
                variables.displayLog(1, 3, 'Error in the evaluation of the rule condition - Name (' + item.position + ') ' + ruleName + ', condition: ' + item.ruleCondition)
                return { success: 0, message: 'Error in the evaluation of the rule condition - Name (' + item.position + ') ' + ruleName + ', condition: ' + item.ruleCondition, stop: 1 }
            }

            if (lastCondition) {

                // condition is true, we can start to evaluate the result
                variables.displayLog(1, 3, "Rule.condition: " + item.ruleCondition + ' is TRUE');
                let setResult = "";

                // split the result by ; to be able to process more than one command
                let actions = item.ruleResult.split(";");
                for (let action in actions) {
                    expression = actions[action].trim();
                    if (expression == "") continue;

                    variables.displayLog(1, 3, "result expr = " + expression);
                    // -----------------------------------------------
                    // Check for special functions (starting with #)
                    // -----------------------------------------------
                    if (expression[0] == '#') {
                        // Special function detected
                        specialFlag = 1
                        variables.displayLog(1, 3, 'special function detected: ' + expression)
                        let specials = expression.split(":");
                        if (specials.length != 2) return { success: 0, message: 'Rule N°: ' + item.position + ' - ' + item.comment + ' - Invalid syntax in the special function: ' + expression, stop: 1 }

                        let functionName = specials[0].trim()
                        let parameters = specials[1].split(",");

                        // Reset the IT or Describe
                        if (functionName == '#It') skipIT = 0
                        if (functionName == '#Describe') skipDescribe = 0

                        //console.log( 'Function: ' + functionName + ', skipIt: ' + skipIT + ', Describe: ' + skipDescribe)


                        if (skipIT || skipDescribe) {
                            await logfile(data.userID, 'Skip', '  >>> Skip the rule R' + item.position)
                        } else {
                            //console.log (parameters)
                            await logfile(data.userID, 'Step', '--> (R' + item.position + ') ' + item.comment)
                            let ret = await specialFunction(page, variables, data, item.position, functionName, parameters[0], parameters[1], parameters[2], parameters[3])
                            if (item.ruleMessage.trim() != '') {
                                expr = variables.evaluateVariable(item.ruleMessage)
                                await logfile(data.userID, 'Info', '  >>> Message: ' + expr)
                            }

                            if (ret.stop == 1) skipIT = 1
                            if (ret.stop == 2) skipDescribe = 1

                            if (skipIT || skipDescribe) console.log('@@@@@@@@ Ret - Skip: ' + 'Rule N°: ' + item.position + ', SkipIt: ' + skipIT + ', Describe: ' + skipDescribe)

                            // Analyse the result in ret to decide to continue or stop the rules execution
                            if (!ret.success) {
                                if (ret.stop) {
                                    console.log('Fatal error, stop the rules', ret)
                                    return ret
                                } else {
                                    skipIT = 1
                                    console.log('Skip IT the rules', ret)
                                }
                            }
                        }



                    } else {
                        // -----------------------------------------------
                        // check if the result must be set into a variable
                        // -----------------------------------------------
                        specialFlag = 0
                        var i = expression.indexOf(' = ');
                        if (i > 0) {
                            setResult = expression.substring(0, i).trim()
                            expression = expression.substring(i + 2).trim()
                        }
                        // evaluate the variables of the rule result
                        // expr = variables.evaluateVariable(expression) // PGO - 16/05/2024
                        expr = variables.evaluateVariableForRule(expression) // PGO - 16/05/2024

                        if (expr == '<N/A>') {
                            variables.displayLog(1, 3, 'Error in the evaluation of the variables of the rule result - (R' + item.position + ') ' + ruleName + ', result: ' + expression)
                            return { success: 0, message: 'Error in the evaluation of the variables of the rule result - (R' + item.position + ') ' + ruleName + ', result: ' + expression, stop: 1 }
                        }
                        // Evaluate the condition expression
                        try {
                            console.log('@@@@@@@ Expr1: ', expr)
                            expression = expr
                            expr = await eval(expression);
                            if (typeof (expr) == "string") {
                                expr = expr.replace(/&apos;/g, "'");
                            }
                            console.log('@@@@@@@ Expr2: ', expr)
                        }
                        catch (err) {
                            //variables.displayLog(1, 3, 'Error in the evaluation of the rule result -  (R' + item.position + ') ' + ruleName + ', result: ' + expression)
                            variables.displayLog(1, 3, 'Error in the evaluation of the rule result -  (R' + item.position + ') ' + ruleName)
                            variables.displayLog(1, 1, err.message)
                            return { success: 0, message: 'Error in the evaluation of the rule result - (R' + item.position + ') ' + ruleName + ', result: ' + expression, stop: 1 }
                        }

                        // if setResult is defined store the value in this variable
                        if (setResult != '') {
                            variables.setVariable(setResult, expr);
                        }
                        variables.displayLog(1, 3, "Rule.result: " + actions[action] + " --> " + expr);
                    }

                } // end loop actions

                if (!specialFlag) {
                    if (item.ruleMessage.trim() != '') {
                        expr = variables.evaluateVariable(item.ruleMessage)
                        await logfile(data.userID, 'Info', '--> (R' + item.position + ') ' + item.comment + ' OK! - Message: ' + expr)
                    } else {
                        await logfile(data.userID, 'Info', '--> (R' + item.position + ') ' + item.comment + ' OK!')
                    }
                }

            }


        }


    } // end loop on rules

    await logfile(data.userID, 'Message', '<<** Rule End')

    variables.displayLog(1, 1, '********************')
    variables.displayLog(1, 1, '***** end rule *****')
    variables.displayLog(1, 1, '********************')
    //console.log (rule)

    return { success: 1, message: 'execRules OK', stop: 0 }

}


module.exports = {
    execRules: execRules
};