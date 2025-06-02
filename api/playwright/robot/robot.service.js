const { time } = require('console');
const BrowserMiddelware = require("../library/browser.library.js")
const browserMiddelware = new BrowserMiddelware

module.exports = {

  /*
  * @Author: Philippe Goffin 
  * @Email: artcomputer123@gmail.com
  * @Date: 2025-05-08
  * @Last Modified by: Someone
  * @Last Modified time: 2025-06-02 13:50:00
  * @Description: All the Playwright services available for robot
  */

  // -----------------------------------------------------------
  // Analyse a webpage: open the screen into the browser
  //
  // @param {number} data.projectID
  // @param {number} data.subprojectID
  // @param {number} data.userID
  // @param {number} data.link  1: URL, 2: Scenario
  // @param {string} data.targetlink depending of the data.link either a URL or un scenarioID
  // @param {string} data.selector  name of the selector (that will be used by the function detectGUI)
  // @param {string} data.criteria  criteria for the detectGUI
  //
  // -----------------------------------------------------------
  AIAnalyseScreen: async (data) => {

    return new Promise(async (resolve, reject) => {

      const robot = require("../library/robot.library")
      const { getScenarioById } = require("../../scenario/scenario.service");
      const { getTestByScenario } = require("../../test/test.service");
      const { deleteLogfile } = require("../../logfile/logfile.service");

      const Variables = require('../library/variable.library');
      let variables = new Variables();

      variables.displayLog(1, 1, '============================================================================')
      variables.displayLog(1, 1, "Analysis Opening the browser")
      variables.displayLog(1, 1, '============================================================================')
      await robot.speaking('Opening webpage')

      let ret = 0
      let dataResult = []
      let driver = 0
      let timeout = 30 // 30 seconds by default      

      if (data.link == undefined || data.targetlink == undefined || data.selector == undefined || data.criteria == undefined) {
        variables.displayLog(1, 1, 'Invalid data!')
        variables.displayLog(1, 1, data)
        ret = { success: 0, message: "Invalid data!", data: dataResult }
        return resolve(ret);
      }

      // ----------------------------------
      // Delete all the logs of a user
      // ----------------------------------
      const log = await deleteLogfile(data.userID);

      // ----------------------------------
      // Start the browser
      // ----------------------------------
      const { getReferenceByCode } = require("../../reference/reference.service.js");

      let retBrowser = await browserMiddelware.startBrowser(data)
      //console.log('RetBrowser', retBrowser)
      if (!retBrowser.success) {
        ret = { success: 0, message: "No way to start the browser: " + retBrowser.message }
        return resolve(ret);
      }

      let headless = browserMiddelware.getHeadless() // 0 by default (browser is visible)
      let browserName = browserMiddelware.getBrowserName()
      let device = browserMiddelware.getDevice()
      let page = browserMiddelware.getPage()
      let browser = browserMiddelware.getBrowser()


      // Get the timeout (if any)
      const dataAPI4 = { projectID: data.projectID, userID: data.userID, code: 'TimeOut' }
      const reference4 = await getReferenceByCode(dataAPI4);
      if (reference4.length) {
        if (reference4[0].label != '<N/A>') {
          timeout = reference4[0].label * 1
        }
      }
      console.log('TimeOut: ' + timeout)
      page.setDefaultTimeout(timeout * 1000)
      await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', "Timeout is set to " + timeout + " second(s)")
      await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', "Browser is: " + browserName + " - Headless: " + headless + " - Device is: " + device)


      // write the scenario name in the reference for the title in the logfile
      ret = await robot.evaluateFunction(page, variables, 'setReference', data, 'Scenario Name', 'AI Robot - Analysis', 'Name of the current scenario')

      // Process a scenario
      if (data.link == 2) {
        data.scenarioID = data.targetlink
        // ----------------------------------
        // Get the detail of the scenario
        // ----------------------------------
        const scenario = await getScenarioById(data.scenarioID);
        if (!scenario.length) {
          ret = { success: 0, message: "No scenario found for the Id: " + data.scenarioID, data: dataResult }
        } else {
          data.scenarioName = scenario[0].scenario
          // ----------------------------------
          // Read all the tests of a scenario
          // ----------------------------------
          const tests = await getTestByScenario(data.scenarioID);
          if (!tests.length) {
            ret = { success: 0, message: "No test found for the scenario Id: " + data.scenarioID, data: dataResult }
          } else {
            // Execute the scenario
            variables.setVariable("$error", "0");
            ret = await robot.executeScenario(data, page, tests)
            if (!ret.success) await robot.evaluateFunction(page, variables, 'setReference', data, 'Execution Status', 0, 'Error during the execuction')
            else await robot.evaluateFunction(page, variables, 'setReference', data, 'Execution Status', 1, 'Test OK')
            await robot.evaluateFunction(page, variables, 'listVariable', data, '', '')
          }
        }
      } else {
        // Process an URL
        ret = await robot.evaluateFunction(page, variables, 'url', data, data.targetlink)
      }

      if (ret.success) {
        await robot.speaking('Screen is ready')
        ret = { success: 1, message: "Screen is ready", data: dataResult }
      } else {
        await robot.speaking('Opening screen fails!')
        ret = { success: 0, message: "Opening screen fails!" }
      }
      return resolve(ret)

    });
  },




  // -----------------------------------------------------------
  // Analyse a webpage
  //
  // @param {number} data.projectID
  // @param {number} data.subprojectID
  // @param {number} data.userID
  // @param {number} data.link  1: URL, 2: Scenario
  // @param {string} data.targetlink depending of the data.link either a URL or un scenarioID
  // @param {string} data.selector  name of the selector (that will be used by the function detectGUI)
  // @param {string} data.criteria  criteria for the detectGUI
  //
  // -----------------------------------------------------------
  AIAnalyse: async (data) => {

    return new Promise(async (resolve, reject) => {

      const robot = require("../library/robot.library")
      const Variables = require('../library/variable.library');
      let variables = new Variables();
      let ret = 0
      let dataResult = []
      let value = ''

      variables.displayLog(1, 1, '')
      variables.displayLog(1, 1, '============================================================================')
      variables.displayLog(1, 1, "Start a analysis ")
      variables.displayLog(1, 1, '============================================================================')
      await robot.speaking('Analysis in progress...')
      //console.log('Data: ', data)

      //----------------------------------
      // Get the playwright page
      // ----------------------------------
      let page = browserMiddelware.getPage()

      // ----------------------------------
      // Analyse the webpage
      // ----------------------------------
      let today = new Date()
      let date = variables.formatDate(today, 'dd/mm/year hh:mi')
      ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', '**************************************')
      ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', "AI Analysis: " + data.criteria)
      ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', "Date: " + date)
      ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', '**************************************')


      if (data.link == undefined || data.targetlink == undefined || data.selectorID == undefined || data.criteria == undefined) {
        variables.displayLog(1, 1, 'Invalid data!')
        variables.displayLog(1, 1, data)
        ret = { success: 0, message: "Invalid data!", data: dataResult }
        return resolve(ret);
      }



      //await robot.evaluateFunction(driver, variables, 'pause', data, 10)
      ret = await robot.evaluateFunction(page, variables, 'detectGUI', data, data.selectorID, data.criteria, data.occurence, 10)
      await robot.evaluateFunction(page, variables, 'logfile', data, 'Analysis', ret.message)
      if (ret.success) {
        let GUI = ret.GUI
        let patternID = ret.patternID
        variables.displayLog(1, 1, 'GUI: ', ret.GUI)
        // Get all the occurences
        ret = await robot.evaluateFunction(page, variables, 'getAllElements', data, '$GUI')
        if (ret.success) {
          let elements = ret.element
          let size = elements.length
          for (let elt = 0; elt < size; elt++) {
            // Extract the value of the cell
            value = await elements[elt].getText();
            if (value == undefined || value == '') {
              // try with the value
              value = await elements[elt].getAttribute('value');
              if (value == '' || value == undefined) {
                value = '<EMPTY>'
              }
            }
            if (value.length > 80) value = value.substring(0, 80) + '....'
            dataResult.push({ 'GUI': GUI, 'Occurence': elt + 1, 'Value': value, 'PatternID': patternID })
          }


          await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '**************************************')
          await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', "Analysis OK")
          await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '**************************************')
          ret = { success: 1, message: "Analysis OK", data: dataResult }
          return resolve(ret);
        }
      } else {
        await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '**************************************')
        await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', ret.message)
        await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '**************************************')
        ret = { success: 0, message: ret.message }
        return resolve(ret);
      }

      // ----------------------------------
      // close the browser
      // ----------------------------------
      // await stopBrowser()
      await browserMiddelware.quitBrowser()
      variables.displayLog(1, 1, 'Analysis: OK!')
      ret = { success: 1, message: 'Analysis: OK!', data: dataResult }
      return resolve(ret);

    });
  },



  // -----------------------------------------------------------
  // Train the robot on a webpage
  //
  // @param {number} data.projectID
  // @param {number} data.subprojectID
  // @param {number} data.userID
  // @param {number} data.link  1: URL, 2: Scenario
  // @param {string} data.targetlink depending of the data.link either a URL or un scenarioID
  // @param {string} data.selector  name of the selector
  // @param {number} data.selectorID  ID of the selector 
  // @param {string} data.criteria  criteria for the detectGUI
  //
  // -----------------------------------------------------------
  AITraining: async (data) => {

    return new Promise(async (resolve, reject) => {

      const robot = require("../library/robot.library")
      const { getPathByProject } = require("../../ai_path/path.service")
      const { getSelector } = require("../../ai_selector/selector.service")
      const { getAttributeByProject } = require("../../ai_attribute/attribute.service")
      const { getParametersByCode } = require("../../parameter/parameter.service.js");
      const { createTraining, reorderTraining } = require("../../ai_training/training.service.js");
      const { createTagAttribute, reorderTagAttribute } = require("../../ai_tagattribute/tagattribute.service")
      const { createTagElement, reorderTagElement } = require("../../ai_tagelement/tagelement.service.js");
      const { getReferenceByCode } = require("../../reference/reference.service.js");


      const Variables = require('../library/variable.library');
      let variables = new Variables();

      variables.displayLog(1, 1, '')
      variables.displayLog(1, 1, '============================================================================')
      variables.displayLog(1, 1, "Start a training ")
      variables.displayLog(1, 1, '============================================================================')
      await robot.speaking('Training in progress...')

      let ret = 0
      let retTraining = { success: 0, message: "Training fails!" }

      let dataResult = []
      let AIRoot = ''
      let value = ''
      let trainingID = 0
      let pathID = 0
      let tagelementID = 0
      let stop = 0 // stop all the process in cas of fatal error in the training analysis

      //----------------------------------
      // Get the playwright page
      // ----------------------------------
      let page = browserMiddelware.getPage()


      let locators
      let locators2
      let xxlocators2

      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
      const year = currentDate.getFullYear();
      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes()
      let today = ('0' + day).slice(-2) + '/' + ('0' + month).slice(-2) + '/' + year + ' ' + ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2)


      ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', '**************************************')
      ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', "AI Training: " + data.criteria)
      ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', "Date: " + today)
      ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', '**************************************')


      // --------------------------------------
      // Check the validity of the parameters
      // --------------------------------------
      if (data.link == undefined || data.targetlink == undefined || data.selector == undefined || data.criteria == undefined) {
        variables.displayLog(1, 1, 'Invalid data!')
        variables.displayLog(1, 1, data)
        await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '**************************************')
        await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', "Training KO, Invalid data!")
        await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '**************************************')
        ret = { success: 0, message: "Invalid data!", data: dataResult }
        return resolve(ret);
      }

      // --------------------------------------------------------------------------
      // get the global parameter: AI Root (a generic xpath to detect the criteria)
      // --------------------------------------------------------------------------
      let dataAPI = { projectID: 0, code: 'AI Root' }
      const result1 = await getParametersByCode(dataAPI);
      if (result1.length) {
        AIRoot = result1[0].paramValue
      } else {
        await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '**************************************')
        await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', "Training KO, AI Root not found!")
        await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '**************************************')
        variables.displayLog(1, 1, 'AI Training - global parameter AI Root not found!')
        ret = { success: 0, message: "Cannot find the global parameter AI Root!", stop: 1 }
        return resolve(ret);
      }

      // -----------------------------------------
      // get all the active paths for the project
      // -----------------------------------------
      dataAPI = { projectID: data.projectID, active: 1 }
      const paths = await getPathByProject(dataAPI);
      if (!paths.length) {
        await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '**************************************')
        await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', "Training KO, No paths for the project!")
        await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '**************************************')
        variables.displayLog(1, 1, 'AI Training - paths for the project not found!')
        ret = { success: 0, message: "Cannot find the paths for the project!", stop: 1 }
        return resolve(ret);
      }

      // ---------------------------------------
      // Get information on the active selectors
      // ---------------------------------------
      const selector = await getSelector(data.selectorID)
      if (!selector.length) {
        await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '**************************************')
        await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', "Training KO, No selectors found!")
        await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '**************************************')
        variables.displayLog(1, 1, 'AI Training - selector not found!')
        ret = { success: 0, message: "Cannot find the selector!", stop: 1 }
        return resolve(ret);
      }

      // ----------------------------------------
      // Get information on the active attributes
      // ----------------------------------------
      // PGO: 07/06/2024 1 --> %
      dataAPI = { projectID: data.projectID, active: '%' }
      const attributes = await getAttributeByProject(dataAPI)
      if (!attributes.length) {
        await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '**************************************')
        await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', "Training KO, No attributes found!")
        await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '**************************************')
        variables.displayLog(1, 1, 'AI Training - attributes of the project not found!')
        ret = { success: 0, message: "Cannot find the attributes of the project!", stop: 1 }
        return resolve(ret)
      }

      // ---------------------------------------
      // Write information in the training table
      // ---------------------------------------
      dataAPI = { subprojectID: data.subprojectID, selectorID: data.selectorID, criteria: data.criteria, position: 0, active: 0, createdby: data.userName, created: today }
      const result2 = await createTraining(dataAPI);
      if (result2.affectedRows) {
        trainingID = result2.insertId
        variables.displayLog(2, 1, '@@@@@@@ Training ID: ', trainingID)
        // Reorder the table
        let dataAPI = { subprojectID: data.subprojectID }
        const result3 = await reorderTraining(dataAPI);
        if (!result3.affectedRows) {
          await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '*******************************************')
          await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', "Training KO, Error reordering statistics!")
          await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '*******************************************')
          variables.displayLog(1, 1, 'AI Training - Error during the reordered of Training!')
          variables.displayLog(1, 1, 'Error: ', result3)
          ret = { success: 0, message: "Error during the reordered of Training!", stop: 1 }
          return resolve(ret);
        }
      } else {
        await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '*****************************************')
        await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', "Training KO, Error inserting a statistic!")
        await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '*****************************************')
        variables.displayLog(1, 1, 'AI Training - Error during the insert in Training!')
        variables.displayLog(1, 1, 'Error: ', result3)
        ret = { success: 0, message: "Error during the insert in Training!", stop: 1 }
        return resolve(ret);
      }



      let timeout = 0.1
      dataAPI = { projectID: data.projectID, userID: data.userID, code: 'Training TimeOut' }
      const reference4 = await getReferenceByCode(dataAPI);
      if (reference4.length) {
        if (reference4[0].label != '<N/A>') {
          timeout = reference4[0].label * 1
        }
      }
      console.log('Training TimeOut: ' + timeout)
      page.setDefaultTimeout(timeout * 1000)

      // ----------------------------------
      // Prepare the training on the webpage
      // ----------------------------------
      variables.displayLog(1, 1, '------------------------')
      variables.displayLog(1, 1, '-- Start The Training --')
      variables.displayLog(1, 1, '------------------------')


      // In AI Root, replace <PARAM> by the criteria
      let AIRoot2 = AIRoot.replace(/<PARAM>/g, data.criteria)
      variables.displayLog(1, 1, 'AIRoot: ', AIRoot2)

      // ---------------------------------------------
      // Get all the occurences of the generic XPath 
      // ---------------------------------------------
      locators = page.locator(AIRoot2)
      let count = 0
      try {
        await locators.first().waitFor()
        count = await locators.count()
      } catch (err) {
        count = 0
      }
      console.log('locators count: ' + count)

      if (count > 0) {

        for (let elt = 0; elt < count; elt++) {

          let elementOK = 0
          variables.displayLog(1, 1, "------------------------------------------------------")
          variables.displayLog(1, 1, 'Element : ', elt + 1)
          variables.displayLog(1, 1, "------------------------------------------------------")

          if (data.criteria[0] == '#') {
            // -----------------------
            // The criteria is an ID
            // -----------------------
            value = await locators.nth(elt).getAttribute('id')
            if (value == undefined || value == '') value = '<EMPTY>'
            else value = '#' + value
            // Check if the ID is matching
            if (value.trim().toUpperCase() == data.criteria.trim().toUpperCase()) {
              // Insert the element in a table ???
              if (value.length > 80) value = value.substring(0, 80) + '....'
              variables.displayLog(1, 1, 'Value: ', value)
              dataResult.push({ 'GUI': '', 'Occurence': elt + 1, 'Value': value, 'PatternID': '' })
              elementOK = 1
            }
          } else { // end of ID
            // -----------------------
            // Extract the value
            // -----------------------
            value = await locators.nth(elt).textContent()
            if (value == undefined || value == '') value = await locators.nth(elt).evaluate(el => el.value);
            if (value == undefined || value == '') value = '<EMPTY>'

            // --------------------------------------------------------
            // Check if the text is matching criteria (exact matching)
            // --------------------------------------------------------
            if (value.trim().toUpperCase() == data.criteria.trim().toUpperCase()) {
              // Insert the element in a table ???
              variables.displayLog(1, 1, '@@@@@@@ Value: ', value)
              elementOK = 1
            } else {
              variables.displayLog(1, 1, 'Element ', elt + 1, ' no matching with the name: ' + data.criteria.trim().toUpperCase() + ' we got: ' + value.trim().toUpperCase().substring(0, 80))
            }

          } // end of Value

          if (elementOK) {
            // ---------------------------------------
            // Check the element versus all the paths
            // ---------------------------------------
            for (let path = 0; path < paths.length && !stop; path++) {

              console.log('------ Path: ', paths[path].fullPath)
              // --------------------------------------------------
              // Check if the path is compliant for this selector
              // --------------------------------------------------
              pathID = paths[path].pathID
              elementOK = 1
              let selectorCondition = paths[path].pathCondition.split("|");
              if (selectorCondition.includes('*')) {
                // Check if the selector is not excluded from this path
                if (selectorCondition.includes('!' + data.selector)) {
                  // selector is exculde
                  console.log('     ' + paths[path].fullPath + ' is excluded, selector ' + paths[path].pathCondition + ' is not compliant with ' + data.selector)
                  elementOK = 0
                }
              } else {
                if (!selectorCondition.includes(data.selector)) {
                  // path is not defined for this selector
                  console.log('     ' + paths[path].fullPath + ' is excluded, selector ' + paths[path].pathCondition + ' is not compliant with ' + data.selector)
                  elementOK = 0
                }
              }

              //console.log('----- elementOK: ', elementOK)
              if (elementOK) {
                // -------------------------------------------------------------------
                // path is compliant with the selector, check if xpath returns row(s)
                // -------------------------------------------------------------------
                let id = elt + 1
                let xpath = '(' + AIRoot + ')[' + id + ']' + paths[path].fullPath
                // Remove the word Root in the xpath
                xpath = xpath.replace('Root', '')
                xpath = xpath.trim()
                // In xpath, replace <PARAM> by the criteria
                let xpath2 = xpath.replace(/<PARAM>/g, data.criteria)
                console.log('xpath2', xpath2)

                locators2 = page.locator(xpath2)
                let count2 = 0
                try {
                  await locators2.first().waitFor()
                  count2 = await locators2.count()
                } catch (err) {
                  let count2 = 0
                }
                console.log('locators2 count: ' + count2)
                if (count2 > 0) {
                  for (let xpelt = 0; xpelt < count2; xpelt++) {
                    let tag = await locators2.nth(xpelt).evaluate(el => el.tagName);
                    console.log('locators2 tag', tag)
                    let endtag = selector[0].endTag.toUpperCase().split("|");

                    if (endtag.includes(tag.toUpperCase())) {

                      // Extract the value to show to the user to help to decide for the best pattern
                      let valueEnd = await locators2.nth(xpelt).textContent()
                      if (valueEnd == undefined || valueEnd == '') valueEnd = '<EMPTY>'

                      // -----------------------------------------------------------
                      // check if the valueEnd is compliant with the expected value
                      // -----------------------------------------------------------
                      if (data.expected != undefined && data.expected != '') {
                        if (valueEnd.trim().toUpperCase() == data.expected.trim().toUpperCase()) {
                          dataResult.push({ 'GUI': paths[path].fullPath, 'Occurence': elt + 1, 'Value': value + ' / ' + valueEnd, 'PatternID': paths[path].pathID })
                          variables.displayLog(1, 1, '====> Xpath: ', paths[path].fullPath, 'Record(s) detected - tag: ' + tag)
                        } else {
                          variables.displayLog(1, 1, '----> Xpath: ', paths[path].fullPath, 'Tag: ' + tag + ' Not the expected value: ' + data.expected.trim().toUpperCase() + ' and got: ' + valueEnd.trim().toUpperCase())
                          elementOK = 0
                        }
                      } else {
                        // No expected value, display the result  
                        dataResult.push({ 'GUI': paths[path].fullPath, 'Occurence': elt + 1, 'Value': value + ' / ' + valueEnd, 'PatternID': paths[path].pathID })
                        variables.displayLog(1, 1, '====> Xpath: ', paths[path].fullPath, count2 + ' record(s) detected - tag: ' + tag)
                      }

                      // ----------------------------------------------------------------------------
                      // Extract all the required attributes 
                      // ----------------------------------------------------------------------------
                      if (elementOK) {

                        // ----------------------------------
                        // Create an entry in the Tag Element
                        // ----------------------------------
                        // projectID, trainingID, pathID, selectorID, position, active
                        let dataAPI = { projectID: data.projectID, trainingID: trainingID, pathID: pathID, selectorID: data.selectorID, position: 0, active: 1 }
                        const result4 = await createTagElement(dataAPI);
                        if (result4.affectedRows) {
                          tagelementID = result4.insertId
                          variables.displayLog(1, 1, '@@@@@@@ Tag Element ID: ', tagelementID)
                          // Reorder the table
                          let dataAPI = { projectID: data.projectID }
                          const result5 = await reorderTagElement(dataAPI);
                          if (!result5.affectedRows) {
                            variables.displayLog(1, 1, 'AI Training - Error during the reordered of Tag Element!')
                            variables.displayLog(1, 1, 'Error: ', result5)
                            retTraining = { success: 0, message: "Error during the reordered of tag Tag Element!" }
                            stop = 1 // Fatal error, stop all the processes
                          }

                        } else {
                          variables.displayLog(1, 1, 'AI Training - Error during the creation of Tag Element!')
                          retTraining = { success: 0, message: "Error during the creation of Tag Element!" }
                          stop = 1 // Fatal error, stop all the processes
                        }

                        // Loop on the levels
                        let pathDepth = paths[path].fullPath.split("/");
                        //variables.displayLog(1, 1, '---> pathDepth: ' + pathDepth.length)

                        for (let level = 0; level < pathDepth.length && !stop; level++) {
                          let myLevel = pathDepth.length - level - 1
                          // Get the ancestor, use the xpath slice it and rebuild it a partial path
                          if (level > 0) {
                            let pathArr = xpath.replace('//', '##').split("/")
                            let xxpath = ''
                            let sep2 = ''
                            for (let i = 0; i <= myLevel; i++) {
                              //console.log ('===%%%%%%% ' + pathArr[i])
                              xxpath = xxpath + sep2 + pathArr[i]
                              sep2 = '/'
                            }
                            xxpath = xxpath.replace('##', '//')
                            //console.log ('===@@==@@=== xxpath: ', xxpath)
                            // In xxpath, replace <PARAM> by the criteria
                            let xxpath2 = xxpath.replace(/<PARAM>/g, data.criteria)

                            locators2 = page.locator(xxpath2)
                            let xxcount2 = 0
                            try {
                              await locators2.first().waitFor()
                              xxcount2 = await locators2.count()
                            } catch (err) {
                              xxcount2 = 0
                            }
                            console.log('xxlocators2 count: ' + xxcount2)

                            if (xxcount2 == 0) {
                              elementOK = 0
                              variables.displayLog(1, 1, 'No element found for the ancestor: ' + xxpath2)
                              retTraining = { success: 0, message: "No element found for the ancestor!" }
                            } else {
                              variables.displayLog(1, 1, 'Element found for the ancestor: ' + xxpath2)
                            }
                          } // end if level

                          let pathValue = ''
                          let sep = ''
                          for (let i = 0; i <= myLevel; i++) {
                            console.log('===%%%%%%% ' + pathDepth[i])
                            pathValue = pathValue + sep + pathDepth[i]
                            sep = '/'
                          }
                          variables.displayLog(1, 1, '@@@@@@ PathValue: ', pathValue)

                          //let outerHTML = await locators2.nth(xpelt).getAttribute('outerHTML')
                          let outerHTML = await locators2.nth(xpelt).evaluate(el => el.outerHTML);
                          //variables.displayLog(1, 1, 'outerHTML:' + outerHTML)

                          // Loop on the attributes of the project
                          let valueAttr = undefined
                          for (let attr = 0; attr < attributes.length && !stop; attr++) {

                            if (attributes[attr].name == 'display') {
                              valueAttr = await locators2.nth(xpelt).isVisible()
                              if (valueAttr) valueAttr = 'true'
                              else valueAttr = 'false'
                            } else if (attributes[attr].name == 'disabled') {
                              valueAttr = await locators2.nth(xpelt).isEnabled()
                              if (valueAttr) valueAttr = 'false'
                              else valueAttr = 'true'
                            } else if (attributes[attr].name == 'tagName') {
                              valueAttr = await locators2.nth(xpelt).evaluate(el => el.tagName);
                            } else if (attributes[attr].name == 'type') {
                              valueAttr = await locators2.nth(xpelt).evaluate(el => el.type);
                            } else if (attributes[attr].name == 'id') {
                              valueAttr = await locators2.nth(xpelt).evaluate(el => el.id);
                            } else if (attributes[attr].name == 'name') {
                              valueAttr = await locators2.nth(xpelt).evaluate(el => el.name);
                            } else if (attributes[attr].name == 'class') {
                              valueAttr = await locators2.nth(xpelt).evaluate(el => el.className);
                              console.log('Class: ', valueAttr)
                            } else {
                              retTraining = { success: 0, message: "Inavlid attribute: " + attributes[attr].name }
                              return resolve(retTraining);
                            }
                            // } else {
                            //   let valueAttr = await locators2.nth(xpelt).getAttribute(attributes[attr].name)
                            //   if (attributes[attr].name != 'textContent' && attributes[attr].name != 'tagName') {
                            //     // check if the attribute is visible in the outerHTML
                            //     if (outerHTML.includes(attributes[attr].name)) {
                            //       variables.displayLog(1, 2, 'Attribute: ' + attributes[attr].name + ' is included in the html')
                            //     } else {
                            //       variables.displayLog(1, 2, 'Attribute: ' + attributes[attr].name + ' is NOT INCLUDED in the html')
                            //       valueAttr = undefined
                            //     }
                            //   }
                            // }

                            //variables.displayLog(1, 1, 'Attribute before: ' + attributes[attr].name + ' = ' + valueAttr)
                            if (valueAttr == undefined || valueAttr == null || valueAttr == '' || valueAttr.length > 255) {
                              valueAttr = '??'
                            }
                            variables.displayLog(1, 1, 'Attribute: ' + attributes[attr].name + ' = ' + valueAttr)

                            // ------------------------------------
                            // Write attribute in Tag Attribute
                            // ------------------------------------
                            // PGO: 07/06/2024: active: 1 --> active: attributes[attr].active
                            let dataAPI = { projectID: data.projectID, trainingID: trainingID, tagelementID: tagelementID, level: myLevel, pathID: pathID, pathValue: pathValue, attributeID: attributes[attr].attributeID, value: valueAttr, position: 999999, active: attributes[attr].active }
                            const result6 = await createTagAttribute(dataAPI);
                            if (result6.affectedRows) {
                              let tagAttributeID = result6.insertId
                              //variables.displayLog(1, 1, '@@@@@@@ Tag Attribute ID: ', tagAttributeID)
                              // Reorder the table
                              let dataAPI = { projectID: data.projectID }
                              const result7 = await reorderTagAttribute(dataAPI);
                              if (!result7.affectedRows) {
                                variables.displayLog(1, 1, 'AI Training - Error during the reordered of Tag Attribute!')
                                variables.displayLog(1, 1, 'Error: ', result5)
                                retTraining = { success: 0, message: "Error during the reordered of tag Attribute!" }
                                stop = 1 // Fatal error, stop all the processes
                              }
                            } else {
                              variables.displayLog(1, 1, 'AI Training - Error during the creation of Tag Attribute!')
                              retTraining = { success: 0, message: "Error during the creation of Tag Attribute!" }
                              stop = 1 // Fatal error, stop all the processes
                            }

                          } // End Loop on the attributes
                        } // end for level
                      } else {
                        console.log('----- 2')
                      } // end if elementOK

                    } else {
                      variables.displayLog(1, 1, '@@@@@@@ Path: ', paths[path].fullPath + ' Tag: ' + tag.toUpperCase() + ' not included in ' + selector[0].endTag.toUpperCase())
                    }
                  } // end loop for locators2
                } else {
                  console.log(' no row detected for the path!')
                }

              } // end of elementOK
            } // end for path
          } // end elementOK
        }
        retTraining = { success: 1, message: "Training OK", data: dataResult }

      } else {
        variables.displayLog(1, 1, ' Cannot detect element with AIRoot')
        variables.displayLog(1, 1, 'Ret:', ret)
        retTraining = { success: 0, message: "No record found with the generic xpath!" }
      }


      // ----------------------------------
      // End of the Training
      // ----------------------------------
      variables.displayLog(1, 1, '-------------------------')
      variables.displayLog(1, 1, '-- End of The Training --')
      variables.displayLog(1, 1, '-------------------------')
      for (let i = 0; i < dataResult.length; i++) {
        await robot.evaluateFunction(page, variables, 'logfile', data, 'info', 'PathID: ' + dataResult[i].PatternID)
      }
      await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '**************************************')
      await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', "Training OK!")
      await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '**************************************')

      //await stopBrowser()
      variables.displayLog(1, 1, 'Training: OK!')
      return resolve(retTraining);

    });
  },


  // -----------------------------------------------------------
  // AI Robot: Stop (Quit) the browser
  //
  // -----------------------------------------------------------
  AIStopBrowser: async () => {

    return new Promise(async (resolve, reject) => {

      // const { Builder, By, Key, ChromeOptions } = require("selenium-webdriver")
      const robot = require("../library/robot.library")
      // const { stopBrowser } = require("../browser/browser.service.js")

      const Variables = require('../library/variable.library');
      let variables = new Variables();

      variables.displayLog(1, 1, '')
      variables.displayLog(1, 1, '============================================================================')
      variables.displayLog(1, 1, " AI Robot: Quit the browser")
      variables.displayLog(1, 1, '============================================================================')
      await robot.speaking('Close the browser')

      let ret = 0

      //----------------------------------
      // Quit the browser
      // ----------------------------------
      //ret = await stopBrowser()
      ret = await browserMiddelware.quitBrowser()

      variables.displayLog(2, 1, 'Ret: ', ret)
      if (!ret.success) {
        ret = ({ success: 0, message: "AI Robot: Error during the closure of the browser" })
      } else {
        ret = { success: 1, message: "Browser is closed!" }
      }
      return resolve(ret)

    });
  },


  // -----------------------------------------------------------
  // AI Statistics to refine the patterns
  //
  // @param {number} data.projectID
  // @param {number} data.subprojectID
  // @param {number} data.userID
  // @param {string} data.selector  name of the selector
  // @param {number} data.selectorID  ID of the selector 
  //
  // -----------------------------------------------------------
  AIStatistic: async (data) => {

    return new Promise(async (resolve, reject) => {
      //const { Builder, By, Key, ChromeOptions } = require("selenium-webdriver")
      const robot = require("../library/robot.library")
      const { getParametersByCode } = require("../../parameter/parameter.service.js");
      const { createStatistic, getStatisticByPath, updateStatisticCondition, deleteAllStatistic } = require("../../ai_statistic/statistic.service.js");
      const { getPathTagElement } = require("../../ai_tagelement/tagelement.service.js");
      const { getTagAttributeByPath } = require("../../ai_tagattribute/tagattribute.service.js");
      const { getPatternsByPath, createPattern, reorderPattern, updatePatternStatistic, deleteAllPattern } = require("../../pattern/pattern.service.js");
      const { Left, Right } = require("../library/string.library")




      const Variables = require('../library/variable.library');
      let variables = new Variables();

      variables.displayLog(1, 1, '')
      variables.displayLog(1, 1, '============================================================================')
      variables.displayLog(1, 1, "Start Statistics ")
      variables.displayLog(1, 1, '============================================================================')


      let ret = 0

      let AIRoot = ''
      let AIDisplay = ''
      let AINotDisplay = ''
      let stop = 0 // stop all the process in cas of fatal error in the training analysis
      let myLevel = -1
      let myAttributeID = -1
      let myValue = ''
      let statisticNb = 0
      let myOccurence = 0
      let weight = 100
      let myCondition = ''
      let tempCondition = ''
      let sep = ''

      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
      const year = currentDate.getFullYear();
      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes()
      let today = ('0' + day).slice(-2) + '/' + ('0' + month).slice(-2) + '/' + year + ' ' + ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2)


      // --------------------------------------
      // Check the validity of the parameters
      // --------------------------------------
      if (data.userID == undefined || data.projectID == undefined || data.selector == undefined || data.selectorID == undefined) {
        variables.displayLog(1, 1, 'Invalid data!')
        variables.displayLog(1, 1, data)
        ret = { success: 0, message: "Invalid data!" }
        return resolve(ret);
      }

      // ----------------------------------------
      // Delete all the Patterns of the selector
      // ----------------------------------------
      let dataAPI2 = { projectID: data.projectID, selector: data.selector }
      const result0 = await deleteAllPattern(dataAPI2);


      // --------------------------------------------------------------------------
      // get the global parameter: AI Root (a generic xpath to detect the criteria)
      // --------------------------------------------------------------------------
      let dataAPI = { projectID: 0, code: 'AI Root' }
      const result1 = await getParametersByCode(dataAPI);
      if (result1.length) {
        AIRoot = result1[0].paramValue
      } else {
        variables.displayLog(1, 1, 'AI Statistics - global parameter AI Root not found!')
        ret = { success: 0, message: "Cannot find the global parameter AI Root!", stop: 1 }
        return resolve(ret);
      }

      // --------------------------------------------------------------------------------------------
      // get the global parameter: AI Display (a generic xpath to detect if the element is displayed)
      // --------------------------------------------------------------------------------------------
      dataAPI = { projectID: 0, code: 'AI Display' }
      const result2 = await getParametersByCode(dataAPI);
      if (result2.length) {
        AIDisplay = result2[0].paramValue
      } else {
        variables.displayLog(1, 1, 'AI Statistics - global parameter AI Display not found!')
        ret = { success: 0, message: "Cannot find the global parameter AI Display!", stop: 1 }
        return resolve(ret);
      }

      // --------------------------------------------------------------------------------------------
      // get the global parameter: AI Not Display (a generic xpath to detect if the element is not visible)
      // --------------------------------------------------------------------------------------------
      dataAPI = { projectID: 0, code: 'AI Not Display' }
      const result3 = await getParametersByCode(dataAPI);
      if (result3.length) {
        AINotDisplay = result3[0].paramValue
      } else {
        variables.displayLog(1, 1, 'AI Statistics - global parameter AI Not Display not found!')
        ret = { success: 0, message: "Cannot find the global parameter AI Not Display!", stop: 1 }
        return resolve(ret);
      }

      // ---------------------------
      // Delete all the statistics
      // ---------------------------
      dataAPI = { projectID: data.projectID }
      const result4 = await deleteAllStatistic(dataAPI);

      // ---------------------------------------
      // Get information on the paths in TagElement 
      // ---------------------------------------
      dataAPI = { projectID: data.projectID, selectorID: data.selectorID }
      const paths = await getPathTagElement(dataAPI)
      if (!paths.length) {
        variables.displayLog(1, 1, 'AI Statistic - path (from tagElement) not found!')
        ret = { success: 0, message: "Cannot find the path (from tagElement)!", stop: 1 }
        return resolve(ret);
      }

      statisticNb++
      for (let eltPath = 0; eltPath < paths.length; eltPath++) {

        let pathID = paths[eltPath].pathID
        weight = paths[eltPath].weight
        //console.log ('Weight: ', weight)
        //let tagElementID = paths[eltPath].tagelementID  // Added by Phil on 03/05
        let pathArray = paths[eltPath].fullPath.split('/')
        let myMaxOccurence = pathArray.length
        myCondition = ''
        sep = ''

        variables.displayLog(1, 1, eltPath + ') pathID: ' + pathID + ', path: ' + paths[eltPath].fullPath)

        // --------------------------------------------------------------------------------------------------------
        // Read the attributes of the Tag Attributes by pathID + first, intermediate, last occurence from Attribute
        // --------------------------------------------------------------------------------------------------------
        dataAPI = { projectID: data.projectID, pathID: pathID, selectorID: data.selectorID }
        const tagAttributes = await getTagAttributeByPath(dataAPI);
        if (!tagAttributes.length) {
          variables.displayLog(1, 1, 'AI Statistics - Tag Attribute for the path: ' + pathID + ' not found!')
          ret = { success: 0, message: "Cannot find the Tag Attribute for the path:" + + pathID + " not found!", stop: 1 }
          return resolve(ret);
        }

        // ------------------------
        // Generate the Statistics
        // ------------------------
        variables.displayLog(1, 2, 'TagAttribute Nb: ' + tagAttributes.length)
        for (let eltAttrib = 0; eltAttrib < tagAttributes.length; eltAttrib++) {

          // Skip the attribute textContent
          if (tagAttributes[eltAttrib].name == 'textContent') continue

          variables.displayLog(1, 3, eltAttrib + ') level: ' + myLevel + ' versus ' + tagAttributes[eltAttrib].level + ' attribute: ' + myAttributeID + ' versus ' + tagAttributes[eltAttrib].attributeID + ' ' + tagAttributes[eltAttrib].name)
          // Break on the level 
          if (myLevel != tagAttributes[eltAttrib].level) {
            myCondition = myCondition + sep + tempCondition
            sep = '/'
            tempCondition = ''
            variables.displayLog(1, 4, 'myCondition: ', myCondition)

          }

          // Break on the level or the attribute
          if (myLevel != tagAttributes[eltAttrib].level || myAttributeID != tagAttributes[eltAttrib].attributeID) {
            // Valid break on the level or the attribute
            if (myLevel >= 0 && myValue != '??') {
              // Insert into Statistic if it is not the first time and the value is valid
              dataAPI = {
                projectID: data.projectID, selectorID: data.selectorID, pathID: paths[eltPath].pathID, pathValue: paths[eltPath].fullPath, conditionValue: '', level: myLevel,
                attributeID: myAttributeID, value: myValue, position: statisticNb, active: 1
              }
              const result5 = await createStatistic(dataAPI)
              if (!result5.affectedRows) {
                variables.displayLog(1, 1, 'AI Statistic - Error in the creation of the statistic No ' + statisticNb + '!')
                ret = { success: 0, message: 'Error in the creation of the statistic No ' + statisticNb + '!', stop: 1 }
                return resolve(ret);
              }
              variables.displayLog(1, 3, 'Insert statistic')
              statisticNb++
            } // end valid break level/attribute

            // Reset the values
            myValue = tagAttributes[eltAttrib].value
            myLevel = tagAttributes[eltAttrib].level
            myAttributeID = tagAttributes[eltAttrib].attributeID
            myOccurence = 0

            // end break level/attribute
          } else {

            // Check if value is identical to the data stored
            let found = 0
            if (myValue.includes('|')) {
              let TagArray = myValue.split('|')
              for (let i = 0; i < TagArray.length; i++) {
                if (TagArray[i] == tagAttributes[eltAttrib].value) found = 1
              }
            } else {
              if (myValue == tagAttributes[eltAttrib].value) found = 1
            }

            // We detected a difference in the value of the tag elements
            if (!found) {
              variables.displayLog(1, 3, 'Attribute difference detected - myValue: ' + myValue + ' versus ' + tagAttributes[eltAttrib].value)

              if (tagAttributes[eltAttrib].value == '??' || myValue == '??') {
                myValue = '??'
              } else {
                if (myLevel == 0) { // First occurence
                  //console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Level 0 - myOccurence: ' + myOccurence + ' First: ' + tagAttributes[eltAttrib].first)
                  if (myOccurence >= tagAttributes[eltAttrib].first) { // We exceed the max occurence
                    myValue = '??'
                  } else {
                    myValue = myValue + '|' + tagAttributes[eltAttrib].value
                    myOccurence++
                  }
                  // end first occurence
                } else if (myLevel == myMaxOccurence - 1) { // last occurence
                  if (myOccurence >= tagAttributes[eltAttrib].last) { // We exceed the max occurence
                    myValue = '??'
                  } else {
                    myValue = myValue + '|' + tagAttributes[eltAttrib].value
                    myOccurence++
                  }
                  // end last occurence
                } else { // intermediate occurence
                  if (myOccurence >= tagAttributes[eltAttrib].intermediate) { // We exceed the max occurence
                    myValue = '??'
                  } else {
                    myValue = myValue + '|' + tagAttributes[eltAttrib].value
                    myOccurence++
                  }
                } // end intermediate occurence  
              } // else ??        
            }

          } // end no break

          variables.displayLog(1, 4, 'Value: ', myValue)
          if (tagAttributes[eltAttrib].name == 'tagName') {
            tempCondition = myValue // tagAttributes[eltAttrib].value
            variables.displayLog(1, 4, 'tempCondition: ', tempCondition)
            //sep = '/'
          }

        } // end for eltAttrib

        // Write the last statistic
        myCondition = myCondition + sep + tempCondition
        tempCondition = ''
        if (myCondition[0] == '/') myCondition = myCondition.substring(1) // skip the first /
        variables.displayLog(1, 4, 'myCondition: ', myCondition)

        if (myValue != '??') {
          // Insert into Statistic
          dataAPI = {
            projectID: data.projectID, selectorID: data.selectorID, pathID: paths[eltPath].pathID, pathValue: paths[eltPath].fullPath, conditionValue: '', level: myLevel,
            attributeID: myAttributeID, value: myValue, position: statisticNb, active: 1
          }
          const result6 = await createStatistic(dataAPI)
          if (!result6.affectedRows) {
            variables.displayLog(1, 2, 'AI Statistic - Error in the creation of the last statistic No ' + statisticNb + '!')
            ret = { success: 0, message: 'Error in the creation of the last statistic No ' + statisticNb + '!', stop: 1 }
            return resolve(ret);
          }
          variables.displayLog(1, 2, 'write the last statistic')
          statisticNb++
        } // end write last statistic  


        // Update the condition in the statistic
        dataAPI = { conditionValue: myCondition, projectID: data.projectID, pathID: paths[eltPath].pathID, selectorID: data.selectorID }
        const result7 = await updateStatisticCondition(dataAPI)
        if (!result7.affectedRows) {
          variables.displayLog(1, 1, 'AI Statistic - Error in the update of the condition in the statistic No ' + statisticNb + '!')
          ret = { success: 0, message: 'Error in the update of the condition in the statistic No ' + statisticNb + '!', stop: 1 }
          return resolve(ret);
        }


        // --------------------------------
        // Apply statistics on the Pattern
        // --------------------------------

        variables.displayLog(1, 1, '----------------')
        variables.displayLog(1, 1, '--   Patterns --')
        variables.displayLog(1, 1, '----------------')



        let patternID = 0
        let pattern = []
        // Get the pattern (if it exists)
        dataAPI = { projectID: data.projectID, path: paths[eltPath].fullPath, selector: data.selector }
        pattern = await getPatternsByPath(dataAPI);
        if (pattern.length) {
          patternID = pattern[0].paternID
        } else {
          // No pattern found, create a new one
          // (projectID, selector, path, tag, attribute, result, weight, comment, position, active
          variables.displayLog(1, 1, 'No pattern found, create a new one')
          dataAPI = {
            projectID: data.projectID, selector: data.selector, path: paths[eltPath].fullPath, tag: myCondition, weight: weight, attribute: '', result: '', weight: weight,
            comment: 'Created on ' + today, position: 99999, active: 1
          }
          pattern = await createPattern(dataAPI);
          if (!pattern.affectedRows) {
            variables.displayLog(1, 1, 'AI Statistic - Error in the creation of the pattern!')
            ret = { success: 0, message: 'Error in the creation of the pattern!' }
            return resolve(ret);
          }
          patternID = pattern.insertId
          // Reorder the table
          dataAPI = { projectID: data.projectID }
          const result8 = await reorderPattern(dataAPI);
        } // end create pattern

        variables.displayLog(1, 2, 'PatternID: ', patternID)

        let myPatterTag = ''
        let myPatternResult = ''
        let myPatternAttribute = ''

        // Loop on the level
        for (myLevel = 0; myLevel < myMaxOccurence; myLevel++) {

          let myLastTag = ''
          let myConditionTag = ''
          let myConditionAttribute = ''
          let myResultTag = ''
          let myResultAttribute = ''

          // Select the statistics by pathID
          dataAPI = { projectID: data.projectID, pathID: paths[eltPath].pathID, selectorID: data.selectorID, level: myLevel }
          const statistics = await getStatisticByPath(dataAPI);
          if (!statistics.length) {
            variables.displayLog(1, 1, 'AI Statistic - No statistics for the path: ' + paths[eltPath].pathID + ' selector: ' + data.selectorID + '!')
            ret = { success: 0, message: 'Error no statistics to process patterns!' }
            return resolve(ret);
          }

          // Loop on the statistics for a specific level of a selector
          for (eltStat = 0; eltStat < statistics.length; eltStat++) {

            let myValueArray = statistics[eltStat].value.split('|')

            if (statistics[eltStat].name == 'tagName') {

              myLastTag = '*'
              myConditionTag = statistics[eltStat].value

              let myTag = pathArray[statistics[eltStat].level]
              myTag = myTag.replace('Root', '*')
              console.log('>>>>>> myTag 1/2:', myTag)

              // extract the position from myTag
              let position = ''
              let i = myTag.indexOf('[', 0);
              let j = myTag.indexOf(']', i + 1);
              if (i >= 0 && j >= 0) {
                position = myTag.substring(i, i + (j - i) + 1)
                myTag = myTag.replace(position, '')
              }
              console.log('>>>>>> myTag 2/2:', myTag)


              // if (myValueArray.length > 1) {
              myResultTag = ''
              let mysep = ''
              let mybegin = '['
              if (myTag == '*') {
                myTag = ''
                mybegin = '*['
              }

              for (let eltTag = 0; eltTag < myValueArray.length; eltTag++) {
                myResultTag = myResultTag + mysep + myTag + mybegin + 'self::' + myValueArray[eltTag].toLowerCase()
                mysep = ' or '
                mybegin = ''
                myTag = ''
              }

              if (statistics[eltStat].level == 0) {  // first level 
                myResultTag = myResultTag + '] ' + AIRoot.replace('//*', '')
              } else myResultTag = myResultTag + ']'
              // Add the position
              myResultTag = myResultTag + position
              console.log('myResultTag 1:', myResultTag)
              // } else {
              //   myResultTag = statistics[eltStat].value
              //   console.log ('myResultTag 2:', myResultTag)
              // } // end myValueArray > 1

            } else if (!(statistics[eltStat].level != myMaxOccurence - 1 && '*visible*display*disabled'.includes(statistics[eltStat].name))) {
              // if we are on the last level with *visible*display*disabled or another level without *visible*display*disabled            

              myConditionAttribute = myConditionAttribute + '@' + statistics[eltStat].name + '=' + statistics[eltStat].value
              variables.displayLog(1, 3, 'Pattern Attribute: ', statistics[eltStat].name)

              if (statistics[eltStat].name == 'display') {
                variables.displayLog(1, 2, 'display')
                if (statistics[eltStat].value == 'true') {
                  myResultTag = myResultTag + ' [' + AIDisplay + ']'
                  console.log('myResultTag 3:', myResultTag)

                } else if (statistics[eltStat].value == 'false') {
                  myResultTag = myResultTag + ' [' + AINotDisplay + ']'
                  console.log('myResultTag 4:', myResultTag)

                }
              }
              //else if (statistics[eltStat].name != 'textContent' && statistics[eltStat].name != 'type') {
              else if (statistics[eltStat].name != 'textContent') {

                myResultTag = myResultTag + '['
                let mysep = ''
                for (let eltAttr = 0; eltAttr < myValueArray.length; eltAttr++) {

                  let myContains = ''
                  // if (statistics[eltStat].name == 'type') {
                  //   if (myValueArray[eltAttr].toLowerCase() != 'submit') { // submit is the value by default but not always inside  HTML, so xpath cannot find it!
                  //     myContains = 'contains( @' + statistics[eltStat].name.toLowerCase() + ", '" + myValueArray[eltAttr].toLowerCase() + "')"
                  //   }
                  // } else {
                  myContains = 'contains( @' + statistics[eltStat].name.toLowerCase() + ", '" + myValueArray[eltAttr].toLowerCase() + "')"
                  // }

                  myResultTag = myResultTag + mysep + myContains
                  mysep = ' or '
                }
                myResultTag = myResultTag + ']'
                console.log('myResultTag 5:', myResultTag)


              } // end else textContent/type               

            } // end of if '*visible*display*disabled'



            //variables.displayLog(1, 3, 'Inside the loop Statistics: ', myResultTag)

          } // end loop statistics


          variables.displayLog(1, 1, 'End loop Statistics: ', myResultTag)


          // let myText = ''
          // if (myResultAttribute != '') {
          //   myText = Right(myResultTag.trim(), 3)
          //   myText = myText[0] + '*' + Right(myText, 1) // [*]

          //   if (myText == '[*]' || myText == '[#]') {
          //     myText = myResultTag + '[' + myResultAttribute + ']'
          //   } else if (Right(myResultTag, 1) == ']') {
          //     myText = myResultTag.substring(0, myResultTag.length - 1) + ' and ' + myResultAttribute + ']'
          //   } else {
          //     myText = myResultTag
          //   }
          // } else {
          //   myText = myResultTag
          // } // end if empty myResultAttribute

          myPatternResult = myPatternResult + '/' + myResultTag
          myPatternAttribute = myPatternAttribute + '/' + myConditionTag + myConditionAttribute

        } // Loop on level

        myPatternResult = myPatternResult.replace('<param>', '<PARAM>')
        myPatternResult = myPatternResult.replace('([#])', '')
        myPatternResult = myPatternResult.replace('[#]', '')
        myPatternResult = '/' + myPatternResult.trim()
        myPatternAttribute = myPatternAttribute.substring(1)

        variables.displayLog(1, 1, 'myPatternResult: ', myPatternResult)
        variables.displayLog(1, 1, 'myPatternAttribute: ', myPatternAttribute)
        // -------------------
        // Update the Pattern
        // -------------------
        dataAPI = { attribute: myPatternAttribute, result: myPatternResult, patternID: patternID }
        pattern = await updatePatternStatistic(dataAPI);
        if (!pattern.affectedRows) {
          variables.displayLog(1, 1, 'AI Statistic - Error in the update of the pattern!')
          ret = { success: 0, message: 'Error in the update of the pattern!' }
          return resolve(ret);
        }

        variables.displayLog(1, 1, '----------------')
        variables.displayLog(1, 1, 'Pattern updated!')
        variables.displayLog(1, 1, '----------------')


        myLevel = -1 // Reset the level
        myCondition = '' // Reset the condition
        sep = ''  // Reset the separator

      } // end for eltPath


      variables.displayLog(1, 1, '-----------------------------')
      variables.displayLog(1, 1, '--   End of The Statistics --')
      variables.displayLog(1, 1, '-----------------------------')

      ret = { success: 1, message: 'Statistic OK!' }
      return resolve(ret);

    });
  },




  // -----------------------------------------------------------
  // Call a scenario to execute the test
  //
  // @param {string} data.scenarioName  Name of the scenario
  // @param {number} data.scenarioID    ID of the scenario
  // @param {number} data.subprojectID  ID of the subproject
  // @param {number} data.projectID     ID of the subproject
  // @param {number} data.userID        ID of the user
  //
  // -----------------------------------------------------------

  testScenario: async (data) => {

    return new Promise(async (resolve, reject) => {

      //const { chromium, firefox, webkit, devices } = require('playwright'); // chromium, firefox or webkit
      //const { test } = require('@playwright/test')
      const robot = require("../library/robot.library.js")
      const { getScenarioById } = require("../../scenario/scenario.service.js");
      const { getTestByScenario } = require("../../test/test.service.js");
      const { deleteLogfile } = require("../../logfile/logfile.service.js");
      const { getReferenceByCode } = require("../../reference/reference.service.js");
      //const { startBrowser } = require("../library/browser.library.js")

      // const BrowserMiddelware = require("../library/browser.library.js")
      // const browserMiddelware = new BrowserMiddelware

      console.log('**********  Playwright ****************')


      const Variables = require('../library/variable.library.js');
      let variables = new Variables();

      variables.displayLog(1, 1, '')
      variables.displayLog(1, 1, '============================================================================')
      variables.displayLog(1, 1, "Start a test for the scenario:" + data.scenarioName + " with the userID: " + data.userID)
      variables.displayLog(1, 1, '============================================================================')
      variables.setVariable('$Scenario', data.scenarioName)

      let ret = 0
      let timeout = 30 // 30 seconds by default
      let headless = 0 // 0 by default (browser is visible)
      let browserName = 'chrome'

      if (data.scenarioID == undefined || data.subprojectID == undefined || data.userID == undefined) {
        variables.displayLog(1, 1, 'Invalid data!')
        variables.displayLog(1, 1, data)
        ret = { success: 0, message: "Invalid data!" }
        return resolve(ret);
      }

      // ----------------------------------
      // Get the detail of the scenario
      // ----------------------------------
      const scenario = await getScenarioById(data.scenarioID);
      if (!scenario.length) {
        ret = { success: 0, message: "No scenario found for the Id: " + data.scenarioID }
        return resolve(ret);
      }
      data.scenarioName = scenario[0].scenario


      // ----------------------------------
      // Read all the tests of a scenario
      // ----------------------------------
      const steps = await getTestByScenario(data.scenarioID);
      if (!steps.length) {
        ret = { success: 0, message: "No test found for the scenario Id: " + data.scenarioID }
        return resolve(ret);
      }


      // ----------------------------------
      // Delete all the logs of a user
      // ----------------------------------
      const log = await deleteLogfile(data.userID);

      console.log('***** before test playwright')

      //----------------------------------
      // launch the browser
      // ----------------------------------      
      let retBrowser = await browserMiddelware.startBrowser(data)
      //console.log('RetBrowser', retBrowser)
      if (!retBrowser.success) {
        ret = { success: 0, message: "No way to start the browser: " + retBrowser.message }
        return resolve(ret);
      }


      headless = browserMiddelware.getHeadless() // 0 by default (browser is visible)
      browserName = browserMiddelware.getBrowserName()
      let device = browserMiddelware.getDevice()
      let page = browserMiddelware.getPage()
      let browser = browserMiddelware.getBrowser()


      // Get the timeout (if any)
      const dataAPI4 = { projectID: data.projectID, userID: data.userID, code: 'TimeOut' }
      const reference4 = await getReferenceByCode(dataAPI4);
      if (reference4.length) {
        if (reference4[0].label != '<N/A>') {
          timeout = reference4[0].label * 1
        }
      }
      console.log('TimeOut: ' + timeout)
      page.setDefaultTimeout(timeout * 1000)
      await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', "Timeout is set to " + timeout + " second(s)")
      await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', "Browser is: " + browserName + " - Headless: " + headless + " - Device is: " + device)


      // write the scenario name in the reference for the title in the logfile
      ret = await robot.evaluateFunction(page, variables, 'setReference', data, 'Scenario Name', data.scenarioName, 'Name of the current scenario')
      // Reset the mergency stop
      ret = await robot.evaluateFunction(page, variables, 'setReference', data, 'Emergency Stop', 0, 'Emergency stop: 1 or 0')

      try {
        // Execute the scenario
        variables.setVariable("$error", "0");
        ret = await robot.executeScenario(data, page, steps)
        variables.displayLog(1, 1, 'Finalize the closure of the test')
        console.log(ret)

        if (!ret.success) await robot.evaluateFunction(page, variables, 'setReference', data, 'Execution Status', 0, 'Error during the execuction')
        else await robot.evaluateFunction(page, variables, 'setReference', data, 'Execution Status', 1, 'Test OK')
        //console.log('step 1')
        await robot.evaluateFunction(page, variables, 'listVariable', data, '', '')
        //console.log('step 2')

        // Stop the test
        await robot.evaluateFunction(page, variables, 'pause', 3)

        //await browser.close();
        await browserMiddelware.quitBrowser()

        return resolve(ret);

      } catch (err) {
        console.log('testScenario: catch error', err)
        //addConsoleHandler.log('testScenario: catch error')
        //await browser.close();
        await browserMiddelware.quitBrowser()
        ret.success = 1
        ret.stop = 0
        return resolve(ret);
      }

    })


  },


  // -----------------------------------------------------------
  // Call a suite to execute the scenario
  //
  // @param {string} data.suiteName     Name of the suite
  // @param {number} data.suiteID       ID of the suite
  // @param {number} data.projectID     ID of the project
  // @param {number} data.subprojectID  ID of the subproject
  // @param {number} data.userID        ID of the user
  //
  // -----------------------------------------------------------
  testSuite: (data) => {

    return new Promise(async (resolve, reject) => {

      //const { Builder, By, Key, ChromeOptions } = require("selenium-webdriver")
      const robot = require("../library/robot.library.js")
      const { getScenarioById } = require("../../scenario/scenario.service.js");
      const { getTestByScenario } = require("../../test/test.service.js");
      const { getSuiteByHeader } = require("../../suite/suite.service.js");
      const { deleteLogfile } = require("../../logfile/logfile.service.js");
      const { getReferenceByCode } = require("../../reference/reference.service.js");
      //const { startBrowser, stopBrowser } = require("../browser/browser.service.js")
      //const { startBrowser } = require("../library/browser.library.js")

      // const BrowserMiddelware = require("../library/browser.library.js")
      // const browserMiddelware = new BrowserMiddelware



      const Variables = require('../library/variable.library.js');
      let variables = new Variables();

      variables.displayLog(1, 1, '')
      variables.displayLog(1, 1, '============================================================================')
      variables.displayLog(1, 1, "Start a suite: '" + data.suiteName + "' with the userID: " + data.userID)
      variables.displayLog(1, 1, '============================================================================')
      variables.setVariable('$Suite', data.suiteName)

      //variables.displayLog(1, 1, 'Data: ', data)


      let scenarioID = 0
      let ret = 0
      let timeout = 30 // 30 seconds by default
      let headless = 0 // 0 by default (browser is visible)
      let browserName = 'chrome'

      if (data.suiteID == undefined || data.subprojectID == undefined || data.userID == undefined) {
        variables.displayLog(1, 1, 'Invalid data!')
        variables.displayLog(1, 1, data)
        ret = { success: 0, message: "Invalid data!" }
        return resolve(ret);
      }

      let suiteheaderID = data.suiteID
      let suiteID = 0
      let suiteErrorID = 0
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

      //console.log ('Suites: ', suites)


      // ----------------------------------
      // Delete all the logs of a user
      // ----------------------------------
      const log = await deleteLogfile(data.userID);

      //----------------------------------
      // launch the browser
      // ----------------------------------
      let retBrowser = await browserMiddelware.startBrowser(data)
      console.log('RetBrowser', retBrowser)
      if (!retBrowser.success) {
        ret = { success: 0, message: "No way to start the browser: " + retBrowser.message }
        return resolve(ret);
      }

      headless = browserMiddelware.getHeadless() // 0 by default (browser is visible)
      browserName = browserMiddelware.getBrowserName()
      let device = browserMiddelware.getDevice()
      let page = browserMiddelware.getPage()
      let browser = browserMiddelware.getBrowser()


      // Get the timeout (if any)
      const dataAPI4 = { projectID: data.projectID, userID: data.userID, code: 'TimeOut' }
      const reference4 = await getReferenceByCode(dataAPI4);
      if (reference4.length) {
        if (reference4[0].label != '<N/A>') {
          timeout = reference4[0].label * 1
        }
      }
      console.log('TimeOut: ' + timeout)
      page.setDefaultTimeout(timeout * 1000)
      await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', "Timeout is set to " + timeout + " second(s)")
      await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', "Browser is: " + browserName + " - Headless: " + headless + " - Device is: " + device)




      // write the scenario name in the reference for the title in the logfile
      let today = new Date()
      let date = variables.formatDate(today, 'dd/mm/year hh:mi')
      ret = await robot.evaluateFunction(page, variables, 'setReference', data, 'Scenario Name', data.suiteName, 'Name of the current suite')
      ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Execute', '**************************************')
      ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Execute', "Executing suite: " + data.suiteName)
      ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Execute', "Date: " + date)
      ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Execute', '**************************************')
      // Reset the mergency stop
      ret = await robot.evaluateFunction(page, variables, 'setReference', data, 'Emergency Stop', 0, 'Emergency stop: 1 or 0')


      // Get the position of the suite in error (if any)
      const dataAPI5 = { projectID: data.projectID, userID: data.userID, code: 'Suite Error ' + suiteheaderID }
      const reference5 = await getReferenceByCode(dataAPI5);
      if (reference5.length) {
        if (reference5[0].label != '<N/A>') {
          // split the label to extract the suiteErrorID and the context in the scenario
          let dataRef = reference5[0].label.split("=");
          suiteErrorID = dataRef[0]
          context = dataRef[1]
          data.context = context
          variables.displayLog(1, 1, 'A previous error detected in the suite: ' + suiteErrorID + ' restart from this point with the context: ' + context)
        } else {
          variables.displayLog(1, 1, 'No previous error in the suite detected, start from the begining')
          suiteErrorID = ''
        }
      } else {
        variables.displayLog(1, 1, 'No previous error in the suite detected, start from the begining')
        suiteErrorID = ''
      }

      variables.startTime()

      let stop = false
      variables.setVariable("$error", "0");

      // ---------------------------------------------------
      // Loop through all the suites to extract the scenarios
      // ---------------------------------------------------
      for (const item of suites) {

        suiteID = item.suiteID
        // in case of error, start from the suite in error
        if (suiteErrorID && suiteID != suiteErrorID) {
          variables.displayLog(1, 1, 'skip the suite: ' + suiteID + ' to go to the suite: ' + suiteErrorID)
          continue
        }
        else suiteErrorID = 0

        if (!stop) {
          scenarioID = item.scenarioID

          // Get the detail of the scenario
          const scenario = await getScenarioById(scenarioID);
          if (!scenario.length) {
            ret = { success: 0, message: "No scenario found for the Id: " + scenarioID }
            await robot.evaluateFunction(driver, variables, 'logfile', data, 'Error', "No scenario found for the Id: " + scenarioID)
            //return resolve(ret);
            stop = 1
            continue
          }
          data.scenarioName = scenario[0].scenario

          variables.displayLog(1, 1, 'Scenario Name: ' + data.scenarioName)

          // Read all the tests of a scenario
          const tests = await getTestByScenario(scenarioID);
          if (!tests.length) {
            ret = { success: 0, message: "No test found in the suite for the Id: " + scenarioID }
            await robot.evaluateFunction(driver, variables, 'logfile', data, 'Error', "No test found in the suite for the Id: " + scenarioID)
            //return resolve(ret);
            stop = 1
            continue
          }
          // Execute the scenario
          data.scenarioID = scenarioID
          variables.displayLog(1, 1, 'Before execute scenario: ', data.context)


          ret = await robot.executeScenario(data, page, tests)


          if (!ret.success) {
            stop = true
            context = ret.context
            await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '**************************************')
            await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', "Error detected in the suite ")
            await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '**************************************')
            await robot.evaluateFunction(page, variables, 'logfile', data, 'Error', "Error detected in the suite, stop the tests!")
            // write the suiteheaderID/suiteID in error in the reference
            await robot.evaluateFunction(page, variables, 'setReference', data, 'Suite Error ' + suiteheaderID, suiteID + '=' + context, 'Position in the suite in case of error')
          }
        }
      } // end for suites

      await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '**************************************')
      await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', "End suite: " + data.suiteName)
      await robot.evaluateFunction(page, variables, 'logfile', data, 'Message', '**************************************')

      if (!stop) {
        // Reset the suite error in the reference
        await robot.evaluateFunction(page, variables, 'setReference', data, 'Suite Error ' + suiteheaderID, '<N/A>', 'Position in the suite in case of error')
        await robot.evaluateFunction(page, variables, 'setReference', data, 'Execution Status', 1, 'Test OK')
      } else await robot.evaluateFunction(page, variables, 'setReference', data, 'Execution Status', 0, 'Error during the execuction')

      //await robot.evaluateFunction(driver, variables, 'listVariable', data, '', '')
      // close the browser
      await robot.evaluateFunction(page, variables, 'pause', 3)
      //await stopBrowser()
      //await browser.close();
      await browserMiddelware.quitBrowser()
      return resolve(ret);

    });
  },




  // -----------------------------------------------------------
  // Call a story to execute the suite/scenario (from the TESTER)
  //
  // @param {string} data.storyName     Name of the story (obsolete)
  // @param {number} data.storyID       ID of the story
  // @param {number} data.projectID     ID of the project
  // @param {number} data.subprojectID  ID of the subproject
  // @param {number} data.userID        ID of the user
  //
  // -----------------------------------------------------------
  testStory: (data) => {

    return new Promise(async (resolve, reject) => {

      //const { chromium, firefox, webkit, devices } = require('playwright'); // chromium, firefox or webkit
      //const { Builder, By, Key, ChromeOptions } = require("selenium-webdriver")
      const robot = require("../library/robot.library.js")
      const { getScenarioById } = require("../../scenario/scenario.service.js");
      const { getTestByScenario } = require("../../test/test.service.js");
      const { getSuiteByHeader } = require("../../suite/suite.service.js");
      const { getStory } = require("../../story/story.service.js");
      const { deleteLogfile } = require("../../logfile/logfile.service.js");
      const { getReferenceByCode } = require("../../reference/reference.service.js");
      //const { startBrowser, stopBrowser } = require("../browser/browser.service.js")
      //const { startBrowser } = require("../library/browser.library.js")
      // const BrowserMiddelware = require("../library/browser.library.js")
      // const browserMiddelware = new BrowserMiddelware


      const Variables = require('../library/variable.library.js');
      let variables = new Variables();

      variables.displayLog(1, 1, '')
      variables.displayLog(1, 1, '============================================================================')
      variables.displayLog(1, 1, "Start a test for the story:" + data.storyName + " with the userID: " + data.userID)
      variables.displayLog(1, 1, '============================================================================')
      //variables.displayLog(1, 1, 'Data: ', data)

      let scenarioID = 0
      let storyStatus = ''
      let storyheaderID = data.storyheaderID
      let storyID = data.storyID
      let storyErrorID = 0
      let suiteID = 0
      let suiteheaderID = 0
      let suiteErrorID = 0
      let ret = 0
      let context = ''
      data.context = ''

      if (data.storyID == undefined || data.subprojectID == undefined || data.userID == undefined) {
        variables.displayLog(1, 1, 'Invalid data!')
        variables.displayLog(1, 1, data)
        ret = { success: 0, message: "Invalid data!" }
        return resolve(ret);
      }

      // ------------------------------------------
      // Read all the scenarios/suites of the story
      // ------------------------------------------

      const stories = await getStory(data.storyID);
      if (!stories.length) {
        ret = { success: 0, message: "No story found for the storyheaderId: " + data.storyID }
        return resolve(ret);
      }
      variables.setVariable('$Suite', data.storyName)
      data.storyName = stories[0].story


      // ----------------------------------
      // Delete all the logs of a user
      // ----------------------------------
      if (data.resetLog) {
        variables.displayLog(1, 1, '--- Reset the logfile')
        const log = await deleteLogfile(data.userID);
      }

      //----------------------------------
      // launch the browser
      // ----------------------------------
      let retBrowser = await browserMiddelware.startBrowser(data)
      console.log('RetBrowser', retBrowser)
      if (!retBrowser.success) {
        ret = { success: 0, message: "No way to start the browser: " + retBrowser.message }
        return resolve(ret);
      }


      headless = browserMiddelware.getHeadless() // 0 by default (browser is visible)
      browserName = browserMiddelware.getBrowserName()
      let device = browserMiddelware.getDevice()
      let page = browserMiddelware.getPage()
      let browser = browserMiddelware.getBrowser()


      // Get the timeout (if any)
      const dataAPI4 = { projectID: data.projectID, userID: data.userID, code: 'TimeOut' }
      const reference4 = await getReferenceByCode(dataAPI4);
      if (reference4.length) {
        if (reference4[0].label != '<N/A>') {
          timeout = reference4[0].label * 1
        }
      }
      console.log('TimeOut: ' + timeout)
      page.setDefaultTimeout(timeout * 1000)
      await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', "Timeout is set to " + timeout + " second(s)")
      await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', "Browser is: " + browserName + " - Headless: " + headless + " - Device is: " + device)



      // write the scenario name in the reference for the title in the logfile
      let today = new Date()
      let date = variables.formatDate(today, 'dd/mm/year hh:mi')
      ret = await robot.evaluateFunction(page, variables, 'setReference', data, 'Scenario Name', data.storyName, 'Name of the current story')
      ret = await robot.evaluateFunction(page, variables, 'setReference', data, 'Story Name', data.storyName, 'Name of the current story')
      ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', '**************************************')
      ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', "Executing Story: " + data.storyName)
      ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', "Date: " + date)
      ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', '**************************************')

      // if we not start from the setup scenario, remember the latest status of the story execution
      if (!data.resetLog) {
        // Get the status of the latest story execution (if any)
        const dataAPI2 = { projectID: data.projectID, userID: data.userID, code: 'Story Status ' + data.subprojectID + '/' + storyheaderID }
        const reference = await getReferenceByCode(dataAPI2);
        if (reference.length) {
          variables.displayLog(1, 1, 'A previous execution detected in the story: ' + reference[0].label + ' restart from this point')
          // split the label to extract the storyID and the suiteID
          // Format: <status>=<storyID>=<suiteID>=<Context>
          let dataRef = reference[0].label.split("=");
          storyStatus = dataRef[0]
          if (storyStatus == 'ERROR') {
            storyErrorID = dataRef[1]
            suiteErrorID = dataRef[2]
            context = dataRef[3]
            data.context = context
            ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Warning', ' if not a setup, Test will restart from the last error detected!')
            variables.displayLog(1, 1, 'storyStatus:', storyStatus, 'StoryErrorId:', storyErrorID, 'suiteErrorID: ', suiteErrorID, 'context: ', context)
          } else {
            ret = await robot.evaluateFunction(page, variables, 'logfile', data, 'Warning', ' Test will restart from the last execution detected!')
            variables.displayLog(1, 1, 'No previous error in the story detected, start from the begining')
            storyErrorID = ''
            suiteErrorID = ''
          }
        } else {
          variables.displayLog(1, 1, 'No previous status in the story detected, start from the begining')
          storyErrorID = ''
          suiteErrorID = ''
        }
      } else {
        variables.displayLog(1, 1, 'Reset the story, start from the begining')
        storyErrorID = ''
        suiteErrorID = ''
      }

      variables.startTime()

      let fatalError = 0
      variables.setVariable("$error", "1");
      // ------------------------------------------------------------
      // Loop through all the stories to extract the scenarios/suites
      // ------------------------------------------------------------
      for (const item of stories) {  // there is only one story at this level
        suiteID = item.suiteID
        scenarioID = item.scenarioID
        storyID = item.storyID

        // in case of a previous execution, start from the last position in the suite
        if (storyErrorID && storyID != storyErrorID) {
          variables.displayLog(1, 1, 'skip the story: ' + storyID + ' to go to the story: ' + storyErrorID)
          continue
        }
        else storyErrorID = 0

        if (!fatalError) {
          //console.log ('SuiteID: ', suiteID, ', scenarioID', scenarioID)

          // ------------------------------------------
          // Execute the scenario of the story
          // ------------------------------------------
          if (scenarioID != 0) {
            // Get the detail of the scenario
            const scenario = await getScenarioById(scenarioID);
            if (!scenario.length) {
              ret = { success: 0, message: "No scenario found for the Id: " + data.scenarioID }
              return resolve(ret);
            }
            data.scenarioName = scenario[0].scenario
            data.scenarioID = scenarioID

            // Read all the tests of a scenario
            const tests = await getTestByScenario(scenarioID);
            if (!tests.length) {
              ret = { success: 0, message: "No scenario found in the suite for the Id: " + scenarioID }
              return resolve(ret);
            }

            // Execute the scenario
            ret = await robot.executeScenario(data, page, tests)
            if (!ret.success && ret.stop) {
              fatalError = 1
              context = ret.context
              await robot.evaluateFunction(page, variables, 'logfile', data, 'Error', "Error detected in the Story, stop the test!")
              // write the ERROR/storyheaderID/storyID/0/context in error in the reference
              await robot.evaluateFunction(page, variables, 'setReference', data, 'Story Status ' + data.subprojectID + '/' + storyheaderID, 'ERROR=' + storyID + '=' + 0 + '=' + context, 'Position in the story (Error)')
            }
          } // end of scenario        

          // ------------------------------------------
          // Execute the suite of the story
          // ------------------------------------------
          if (suiteID != 0) {
            // Read all the scenarios of the suite
            const dataAPI = { suiteheaderID: suiteID }
            const suites = await getSuiteByHeader(dataAPI);
            if (!suites.length) {
              ret = { success: 0, message: "No suite found for the Id: " + suiteID }
              return resolve(ret);
            }

            for (const item2 of suites) {
              scenarioID = item2.scenarioID
              suiteID = item2.suiteID
              suiteheaderID = item2.suiteheaderID
              // in case of error, start from the suite in error
              if (suiteErrorID && suiteID != suiteErrorID) {
                variables.displayLog(1, 1, 'skip the suite: ' + suiteID + ' to go to the suite: ' + suiteErrorID)
                continue
              }
              else suiteErrorID = 0

              if (!fatalError) {
                // Get the detail of the scenario
                const scenario = await getScenarioById(scenarioID);
                if (!scenario.length) {
                  ret = { success: 0, message: "No scenario found for the Id: " + data.scenarioID }
                  return resolve(ret);
                }
                data.scenarioName = scenario[0].scenario
                data.scenarioID = scenarioID

                //console.log ('Scenario: ', scenario)
                //console.log ('testStory Data: ', data)

                // Read all the tests of a scenario
                const tests = await getTestByScenario(scenarioID);
                if (!tests.length) {
                  ret = { success: 0, message: "No scenario found in the suite for the Id: " + scenarioID }
                  return resolve(ret);
                }

                // Execute the scenario
                ret = await robot.executeScenario(data, page, tests)
                variables.displayLog(1, 1, 'Suite ret:', ret)
                if (!ret.success && ret.stop) {
                  fatalError = 1
                  context = ret.context
                  await robot.evaluateFunction(page, variables, 'logfile', data, 'Error', "Error detected in the Story, stop the test!")
                  // write the storyheaderID/storyID/suiteID/context in error in the reference
                  await robot.evaluateFunction(page, variables, 'setReference', data, 'Story Status ' + data.subprojectID + '/' + storyheaderID, 'ERROR=' + storyID + '=' + suiteID + '=' + context, 'Position in the story (Error)')
                }

              } // if fatal error

            } // end for suites

          } // end suite          

        } // if fatal error

      } // end for suites

      await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', '**************************************')
      await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', "End of the Story: " + data.storyName)
      await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', '**************************************')

      await robot.evaluateFunction(page, variables, 'setReference', data, 'Story Last ' + data.subprojectID, storyheaderID + '=' + storyID, 'Last story executed')
      if (!fatalError) {
        // Reset the suite error in the reference
        if (suiteheaderID) await robot.evaluateFunction(page, variables, 'setReference', data, 'Suite Error ' + suiteheaderID, '<N/A>', 'Position in the suite in case of error')
        await robot.evaluateFunction(page, variables, 'setReference', data, 'Story Status ' + data.subprojectID + '/' + storyheaderID, 'OK=' + storyID + '=' + 0 + '=', 'Position in the story (Success)')
        await robot.evaluateFunction(page, variables, 'setReference', data, 'Execution Status', 1, 'Test OK')
      } else await robot.evaluateFunction(page, variables, 'setReference', data, 'Execution Status', 0, 'Error during the execuction')

      //await browser.close();
      await browserMiddelware.quitBrowser()

      return resolve(ret);

    });
  },


  // -----------------------------------------------------------
  // Call a story to execute all the suite/scenario (from the DESIGNER)
  //
  // @param {string} data.storyName     Name of the story (obsolete)
  // @param {number} data.storyID       ID of the story
  // @param {number} data.projectID     ID of the project
  // @param {number} data.subprojectID  ID of the subproject
  // @param {number} data.userID        ID of the user
  //
  // -----------------------------------------------------------
  testAllStory: (data) => {

    return new Promise(async (resolve, reject) => {

      //const { Builder, By, Key, ChromeOptions } = require("selenium-webdriver")
      const robot = require("../library/robot.library.js")
      const { getScenarioById } = require("../../scenario/scenario.service.js");
      const { getTestByScenario } = require("../../test/test.service.js");
      const { getSuiteByHeader } = require("../../suite/suite.service.js");
      const { getStoryByHeader } = require("../../story/story.service.js");
      const { getReferenceByCode } = require("../../reference/reference.service.js");
      const { deleteLogfile } = require("../../logfile/logfile.service.js");
      //const { startBrowser, stopBrowser } = require("../browser/browser.service.js")
      //const { startBrowser } = require("../library/browser.library.js")
      // const BrowserMiddelware = require("../library/browser.library.js")
      // const browserMiddelware = new BrowserMiddelware


      const Variables = require('../library/variable.library.js');
      let variables = new Variables();

      variables.displayLog(1, 1, '')
      variables.displayLog(1, 1, '============================================================================')
      variables.displayLog(1, 1, "Start a test for the story:" + data.storyName + " with the userID: " + data.userID)
      variables.displayLog(1, 1, '============================================================================')


      let scenarioID = 0
      let storyStatus = ''
      let storyheaderID = data.storyID
      let storyID = data.storyID
      let storyErrorID = 0
      let suiteID = 0
      let suiteErrorID = 0
      let ret = 0
      let context = ''
      data.context = ''

      let timeout = 30 // 30 seconds by default
      let headless = 0 // 0 by default (browser is visible)
      let browserName = 'chrome'


      if (data.storyID == undefined || data.subprojectID == undefined || data.userID == undefined) {
        variables.displayLog(1, 1, 'Invalid data!')
        variables.displayLog(1, 1, data)
        ret = { success: 0, message: "Invalid data!" }
        return resolve(ret);
      }

      // ------------------------------------------
      // Read all the scenarios/suites of the story
      // ------------------------------------------
      const dataAPI = { storyheaderID: storyheaderID }
      const stories = await getStoryByHeader(dataAPI);
      if (!stories.length) {
        ret = { success: 0, message: "No story found for the storyheaderId: " + data.storyID }
        return resolve(ret);
      }
      variables.setVariable('$Suite', data.storyName)


      // ----------------------------------
      // Delete all the logs of a user
      // ----------------------------------
      const log = await deleteLogfile(data.userID);


      //----------------------------------
      // launch the browser
      // ----------------------------------
      let retBrowser = await browserMiddelware.startBrowser(data)
      console.log('RetBrowser', retBrowser)
      if (!retBrowser.success) {
        ret = { success: 0, message: "No way to start the browser: " + retBrowser.message }
        return resolve(ret);
      }


      headless = browserMiddelware.getHeadless() // 0 by default (browser is visible)
      browserName = browserMiddelware.getBrowserName()
      let device = browserMiddelware.getDevice()
      let page = browserMiddelware.getPage()
      let browser = browserMiddelware.getBrowser()


      // Get the timeout (if any)
      const dataAPI4 = { projectID: data.projectID, userID: data.userID, code: 'TimeOut' }
      const reference4 = await getReferenceByCode(dataAPI4);
      if (reference4.length) {
        if (reference4[0].label != '<N/A>') {
          timeout = reference4[0].label * 1
        }
      }
      console.log('TimeOut: ' + timeout)
      page.setDefaultTimeout(timeout * 1000)
      await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', "Timeout is set to " + timeout + " second(s)")
      await robot.evaluateFunction(page, variables, 'logfile', data, 'Title', "Browser is: " + browserName + " - Headless: " + headless + " - Device is: " + device)



      ret = await startBrowser(data.projectID)
      //console.log ('Ret: ', ret)
      if (!ret.success) {
        ret = ({ success: 0, message: "Error during the start of the browser" })
        return resolve(ret);
      }
      driver = ret.driver


      // write the scenario name in the reference for the title in the logfile
      let today = new Date()
      let date = variables.formatDate(today, 'dd/mm/year hh:mi')
      ret = await robot.evaluateFunction(driver, variables, 'setReference', data, 'Scenario Name', data.storyName, 'Name of the current story')
      ret = await robot.evaluateFunction(driver, variables, 'setReference', data, 'Story Name', data.storyName, 'Name of the current story')
      ret = await robot.evaluateFunction(driver, variables, 'logfile', data, 'Title', '**************************************')
      ret = await robot.evaluateFunction(driver, variables, 'logfile', data, 'Title', "Executing Story: " + data.storyName)
      ret = await robot.evaluateFunction(driver, variables, 'logfile', data, 'Title', "Date: " + date)
      ret = await robot.evaluateFunction(driver, variables, 'logfile', data, 'Title', '**************************************')

      // Get the status of the latest story execution (if any)
      const dataAPI2 = { projectID: data.projectID, userID: data.userID, code: 'Story Status ' + data.subprojectID + '/' + storyheaderID }
      const reference = await getReferenceByCode(dataAPI2);
      if (reference.length) {
        variables.displayLog(1, 1, 'A previous execution detected in the story: ' + reference[0].label + ' restart from this point')
        // split the label to extract the storyID and the suiteID
        // Format: <status>=<storyID>=<suiteID>=<Context>
        let dataRef = reference[0].label.split("=");
        storyStatus = dataRef[0]
        if (storyStatus == 'ERROR') {
          storyErrorID = dataRef[1]
          suiteErrorID = dataRef[2]
          context = dataRef[3]
          data.context = context
          ret = await robot.evaluateFunction(driver, variables, 'logfile', data, 'Warning', ' Test will restart from the last execution detected!')
          variables.displayLog(1, 1, 'storyStatus:', storyStatus, 'StoryErrorId:', storyErrorID, 'suiteErrorID: ', suiteErrorID, 'context: ', context)
        } else {
          variables.displayLog(1, 1, 'No previous error in the story detected, start from the begining')
          storyErrorID = ''
          suiteErrorID = ''
        }
      } else {
        variables.displayLog(1, 1, 'No previous status in the story detected, start from the begining')
        storyErrorID = ''
        suiteErrorID = ''
      }


      variables.startTime()

      let fatalError = 0
      // ------------------------------------------------------------
      // Loop through all the stories to extract the scenarios/suites
      // ------------------------------------------------------------
      for (const item of stories) {
        suiteID = item.suiteID
        scenarioID = item.scenarioID
        storyID = item.storyID

        // in case of error, start from the suite in error
        if (storyErrorID && storyID != storyErrorID) {
          variables.displayLog(1, 1, 'skip the story: ' + storyID + ' to go to the story: ' + storyErrorID)
          continue
        }
        else storyErrorID = 0


        if (!fatalError) {
          //console.log ('SuiteID: ', suiteID, ', scenarioID', scenarioID)

          // ------------------------------------------
          // Execute the scenario of the story
          // ------------------------------------------
          if (scenarioID != 0) {
            // Get the detail of the scenario
            const scenario = await getScenarioById(scenarioID);
            if (!scenario.length) {
              ret = { success: 0, message: "No scenario found for the Id: " + data.scenarioID }
              return resolve(ret);
            }
            data.scenarioName = scenario[0].scenario
            data.scenarioID = scenarioID

            // Read all the tests of a scenario
            const tests = await getTestByScenario(scenarioID);
            if (!tests.length) {
              ret = { success: 0, message: "No scenario found in the suite for the Id: " + scenarioID }
              return resolve(ret);
            }

            //console.log ('Tests: ', tests)

            // Execute the scenario
            ret = await robot.executeScenario(data, driver, tests)
            if (!ret.success && ret.stop) {
              fatalError = 1
              context = ret.context
              await robot.evaluateFunction(driver, variables, 'logfile', data, 'Error', "Error detected in the Story, stop the test!")
              // write the storyheaderID/storyID/0/context in error in the reference
              await robot.evaluateFunction(driver, variables, 'setReference', data, 'Story Status ' + data.subprojectID + '/' + storyheaderID, 'ERROR=' + storyID + '=' + 0 + '=' + context, 'Position in the story (Error)')
            }

          } // end of scenario        

          // ------------------------------------------
          // Execute the suite of the story
          // ------------------------------------------
          if (suiteID != 0) {
            // Read all the scenarios of the suite
            const dataAPI = { suiteheaderID: suiteID }
            const suites = await getSuiteByHeader(dataAPI);
            if (!suites.length) {
              ret = { success: 0, message: "No suite found for the Id: " + suiteID }
              return resolve(ret);
            }

            for (const item2 of suites) {
              scenarioID = item2.scenarioID
              suiteID = item2.suiteID
              // in case of error, start from the suite in error
              if (suiteErrorID && suiteID != suiteErrorID) {
                variables.displayLog(1, 1, 'skip the suite: ' + suiteID + ' to go to the suite: ' + suiteErrorID)
                continue
              }
              else suiteErrorID = 0

              if (!fatalError) {
                // Get the detail of the scenario
                const scenario = await getScenarioById(scenarioID);
                if (!scenario.length) {
                  ret = { success: 0, message: "No scenario found for the Id: " + data.scenarioID }
                  return resolve(ret);
                }
                data.scenarioName = scenario[0].scenario
                data.scenarioID = scenarioID

                //console.log ('Scenario: ', scenario)
                //console.log ('testStory Data: ', data)

                // Read all the tests of a scenario
                const tests = await getTestByScenario(scenarioID);
                if (!tests.length) {
                  ret = { success: 0, message: "No scenario found in the suite for the Id: " + scenarioID }
                  return resolve(ret);
                }

                //console.log ('Tests: ', tests)

                // Execute the scenario
                ret = await robot.executeScenario(data, driver, tests)
                variables.displayLog(1, 1, 'Suite ret:', ret)
                if (!ret.success && ret.stop) {
                  fatalError = 1
                  context = ret.context
                  await robot.evaluateFunction(driver, variables, 'logfile', data, 'Error', "Error detected in the Story, stop the test!")
                  // write the storyheaderID/storyID/suiteID in error in the reference
                  await robot.evaluateFunction(driver, variables, 'setReference', data, 'Story Status ' + data.subprojectID + '/' + storyheaderID, 'ERROR=' + storyID + '=' + suiteID + '=' + context, 'Position in the story (Error)')
                }

              } // if fatal error

            } // end for suites

          } // end suite          

        } // if fatal error

      } // end for suites

      await robot.evaluateFunction(driver, variables, 'logfile', data, 'Title', '**************************************')
      await robot.evaluateFunction(driver, variables, 'logfile', data, 'Title', "End of the Story: " + data.storyName)
      await robot.evaluateFunction(driver, variables, 'logfile', data, 'Title', '**************************************')

      if (!fatalError) {
        // Reset the suite error in the reference
        if (suiteID) await robot.evaluateFunction(driver, variables, 'setReference', data, 'Suite Error ' + suiteID, '<N/A>', 'Position in the suite (Success)')
        await robot.evaluateFunction(driver, variables, 'setReference', data, 'Story Status ' + data.subprojectID + '/' + storyheaderID, 'OK=' + storyID + '=' + 0 + '=', 'Position in the story (Success)')
        await robot.evaluateFunction(driver, variables, 'setReference', data, 'Execution Status', 1, 'Test OK')
      } else await robot.evaluateFunction(driver, variables, 'setReference', data, 'Execution Status', 0, 'Error during the execuction')

      //await browser.close();
      await browserMiddelware.quitBrowser()
      return resolve(ret);


    });
  },

  // -----------------------------------------------------------
  // Crypt a password
  // -----------------------------------------------------------
  cryptpassword: (data) => {
    return new Promise(async (resolve, reject) => {

      //console.log (data)
      let ret = 0

      const robot = require("../library/robot.library.js")
      const { cryptPassword } = require("../library/password.library.js")

      // Crypt a password
      ret = await cryptPassword(data.password)
      resolve(ret)

    });
  },

  // -----------------------------------------------------------
  // Decrypt a password
  // -----------------------------------------------------------
  decryptpassword: (data) => {
    return new Promise(async (resolve, reject) => {

      //console.log (data.scenarioName)
      let ret = 0

      const robot = require("../library/robot.library.js")
      const { decryptPassword } = require("../library/password.library.js")

      // Decrypt a password
      ret = await decryptPassword(data.password)
      resolve(ret)

    });
  },


  // -----------------------------------------------------------
  // Check if a file exists
  // -----------------------------------------------------------
  checkFilename: (body) => {
    return new Promise(async (resolve, reject) => {

      //console.log ('checkFilename - filename: ' + body.filename)
      let ret = 0

      const { fileExist } = require("../library/file.library.js")

      //variables.displayLog(1, 1, "----- Current directory:", process.cwd())

      // Check the filename
      ret = await fileExist(body.filename)
      //console.log (ret)
      resolve(ret)

    });
  },

  // -----------------------------------------------------------
  // Display a message on the console
  // -----------------------------------------------------------
  debugMsg: (body) => {
    return new Promise(async (resolve, reject) => {

      const Variables = require('../library/variable.library.js');
      let variables = new Variables();

      //console.log ('checkFilename - filename: ' + body.filename)
      let ret = 1
      if (body.level == undefined) body.level = 1
      if (body.ident == undefined) body.ident = 1
      if (body.title == undefined) body.title = ""
      if (body.value == undefined) body.value = ""


      variables.displayLog(body.level, body.ident, body.title, body.value)

      //console.log (ret)
      resolve(ret)

    });
  }

};
