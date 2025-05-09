
module.exports = {

  /*
  * @Author: Philippe Goffin 
  * @Email: artcomputer123@gmail.com
  * @Date: 2025-05-08
  * @Last Modified by: Someone
  * @Last Modified time: 2025-05-08 11:50:29
  * @Description: All the Playwright services available for robot
  */

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

      const { chromium } = require('playwright');
      const robot = require("../library/robot.library.js")
      const { getScenarioById } = require("../../scenario/scenario.service.js");
      const { getTestByScenario } = require("../../test/test.service.js");
      const { deleteLogfile } = require("../../logfile/logfile.service.js");

      console.log('**********  Playwright ****************')


      const Variables = require('../library/variable.library.js');
      let variables = new Variables();

      variables.displayLog(1, 1, '')
      variables.displayLog(1, 1, '============================================================================')
      variables.displayLog(1, 1, "Start a test for the scenario:" + data.scenarioName + " with the userID: " + data.userID)
      variables.displayLog(1, 1, '============================================================================')
      variables.setVariable('$Scenario', data.scenarioName)

      let ret = 0

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

      //test(data.scenarioName, async ({ browser }) => {

      const browser = await chromium.launch({headless: false});
      const page = await browser.newPage();

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

        await browser.close();

        return resolve(ret);

      } catch (err) {
        console.log('testScenario: catch error', err)
        //addConsoleHandler.log('testScenario: catch error')
        await browser.close();
        ret.success = 1
        ret.stop = 0
        return resolve(ret);
      }

      //}) // end test playwright


    });
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

      const { Builder, By, Key, ChromeOptions } = require("selenium-webdriver")
      const robot = require("../library/robot.library.js")
      const { getScenarioById } = require("../../scenario/scenario.service.js");
      const { getTestByScenario } = require("../../test/test.service.js");
      const { getSuiteByHeader } = require("../../suite/suite.service.js");
      const { deleteLogfile } = require("../../logfile/logfile.service.js");
      const { getReferenceByCode } = require("../../reference/reference.service.js");
      const { startBrowser, stopBrowser } = require("../browser/browser.service.js")

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

      // let chrome = require("selenium-webdriver/chrome")
      // let options = new chrome.Options()

      // // Connect to the Chrome driver
      // let driver = 0
      // try {
      //   driver = await new Builder().forBrowser("chrome").build()
      // } catch (err) {
      //   variables.displayLog(1, 1, err.message)
      //   return { success: 0, message: err.message }
      // }
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
      ret = await robot.evaluateFunction(driver, variables, 'setReference', data, 'Scenario Name', data.suiteName, 'Name of the current suite')
      ret = await robot.evaluateFunction(driver, variables, 'logfile', data, 'Execute', '**************************************')
      ret = await robot.evaluateFunction(driver, variables, 'logfile', data, 'Execute', "Executing suite: " + data.suiteName)
      ret = await robot.evaluateFunction(driver, variables, 'logfile', data, 'Execute', "Date: " + date)
      ret = await robot.evaluateFunction(driver, variables, 'logfile', data, 'Execute', '**************************************')
      // Reset the mergency stop
      ret = await robot.evaluateFunction(driver, variables, 'setReference', data, 'Emergency Stop', 0, 'Emergency stop: 1 or 0')


      // Get the position of the suite in error (if any)
      const dataAPI2 = { projectID: data.projectID, userID: data.userID, code: 'Suite Error ' + suiteheaderID }
      const reference = await getReferenceByCode(dataAPI2);
      if (reference.length) {
        if (reference[0].label != '<N/A>') {
          // split the label to extract the suiteErrorID and the context in the scenario
          let dataRef = reference[0].label.split("=");
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


          ret = await robot.executeScenario(data, driver, tests)


          if (!ret.success) {
            stop = true
            context = ret.context
            await robot.evaluateFunction(driver, variables, 'logfile', data, 'Message', '**************************************')
            await robot.evaluateFunction(driver, variables, 'logfile', data, 'Message', "Error detected in the suite ")
            await robot.evaluateFunction(driver, variables, 'logfile', data, 'Message', '**************************************')
            await robot.evaluateFunction(driver, variables, 'logfile', data, 'Error', "Error detected in the suite, stop the tests!")
            // write the suiteheaderID/suiteID in error in the reference
            await robot.evaluateFunction(driver, variables, 'setReference', data, 'Suite Error ' + suiteheaderID, suiteID + '=' + context, 'Position in the suite in case of error')
          }
        }
      } // end for suites

      await robot.evaluateFunction(driver, variables, 'logfile', data, 'Message', '**************************************')
      await robot.evaluateFunction(driver, variables, 'logfile', data, 'Message', "End suite: " + data.suiteName)
      await robot.evaluateFunction(driver, variables, 'logfile', data, 'Message', '**************************************')

      if (!stop) {
        // Reset the suite error in the reference
        await robot.evaluateFunction(driver, variables, 'setReference', data, 'Suite Error ' + suiteheaderID, '<N/A>', 'Position in the suite in case of error')
        await robot.evaluateFunction(driver, variables, 'setReference', data, 'Execution Status', 1, 'Test OK')
      } else await robot.evaluateFunction(driver, variables, 'setReference', data, 'Execution Status', 0, 'Error during the execuction')

      //await robot.evaluateFunction(driver, variables, 'listVariable', data, '', '')
      // close the browser
      await robot.evaluateFunction(driver, variables, 'pause', 3)
      await stopBrowser()
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

      const { Builder, By, Key, ChromeOptions } = require("selenium-webdriver")
      const robot = require("../library/robot.library.js")
      const { getScenarioById } = require("../../scenario/scenario.service.js");
      const { getTestByScenario } = require("../../test/test.service.js");
      const { getSuiteByHeader } = require("../../suite/suite.service.js");
      const { getStory } = require("../../story/story.service.js");
      const { deleteLogfile } = require("../../logfile/logfile.service.js");
      const { getReferenceByCode } = require("../../reference/reference.service.js");
      const { startBrowser, stopBrowser } = require("../browser/browser.service.js")

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
            ret = await robot.evaluateFunction(driver, variables, 'logfile', data, 'Warning', ' if not a setup, Test will restart from the last error detected!')
            variables.displayLog(1, 1, 'storyStatus:', storyStatus, 'StoryErrorId:', storyErrorID, 'suiteErrorID: ', suiteErrorID, 'context: ', context)
          } else {
            ret = await robot.evaluateFunction(driver, variables, 'logfile', data, 'Warning', ' Test will restart from the last execution detected!')
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
            ret = await robot.executeScenario(data, driver, tests)
            if (!ret.success && ret.stop) {
              fatalError = 1
              context = ret.context
              await robot.evaluateFunction(driver, variables, 'logfile', data, 'Error', "Error detected in the Story, stop the test!")
              // write the ERROR/storyheaderID/storyID/0/context in error in the reference
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
                ret = await robot.executeScenario(data, driver, tests)
                variables.displayLog(1, 1, 'Suite ret:', ret)
                if (!ret.success && ret.stop) {
                  fatalError = 1
                  context = ret.context
                  await robot.evaluateFunction(driver, variables, 'logfile', data, 'Error', "Error detected in the Story, stop the test!")
                  // write the storyheaderID/storyID/suiteID/context in error in the reference
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

      await robot.evaluateFunction(driver, variables, 'setReference', data, 'Story Last ' + data.subprojectID, storyheaderID + '=' + storyID, 'Last story executed')
      if (!fatalError) {
        // Reset the suite error in the reference
        if (suiteheaderID) await robot.evaluateFunction(driver, variables, 'setReference', data, 'Suite Error ' + suiteheaderID, '<N/A>', 'Position in the suite in case of error')
        await robot.evaluateFunction(driver, variables, 'setReference', data, 'Story Status ' + data.subprojectID + '/' + storyheaderID, 'OK=' + storyID + '=' + 0 + '=', 'Position in the story (Success)')
        await robot.evaluateFunction(driver, variables, 'setReference', data, 'Execution Status', 1, 'Test OK')
      } else await robot.evaluateFunction(driver, variables, 'setReference', data, 'Execution Status', 0, 'Error during the execuction')


      // try {
      //   // close the browser
      //   await robot.evaluateFunction(driver, variables, 'pause', 3)
      //   await driver.close()
      //   await driver.quit()
      //   return resolve(ret);
      // } catch (err) {
      //   variables.displayLog(1, 1, 'End story Error:', err.message)
      //   ret = { success: 0, message: err.message }
      //   return resolve(ret);
      // }
      await stopBrowser()
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

      const { Builder, By, Key, ChromeOptions } = require("selenium-webdriver")
      const robot = require("../library/robot.library.js")
      const { getScenarioById } = require("../../scenario/scenario.service.js");
      const { getTestByScenario } = require("../../test/test.service.js");
      const { getSuiteByHeader } = require("../../suite/suite.service.js");
      const { getStoryByHeader } = require("../../story/story.service.js");
      const { getReferenceByCode } = require("../../reference/reference.service.js");
      const { deleteLogfile } = require("../../logfile/logfile.service.js");
      const { startBrowser, stopBrowser } = require("../browser/browser.service.js")

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
      // let chrome = require("selenium-webdriver/chrome")
      // let options = new chrome.Options()

      // // Connect to the Chrome driver
      // let driver = 0
      // try {
      //   driver = await new Builder().forBrowser("chrome").build()
      // } catch (err) {
      //   variables.displayLog(1, 1, err.message)
      //   return { success: 0, message: err.message }
      // }
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

      // // close the browser
      // try {
      //   await robot.evaluateFunction(driver, variables, 'pause', 3)
      //   await driver.quit()
      //   return resolve(ret);
      // } catch (err) {
      //   variables.displayLog(1, 1, err.message)
      //   ret = { success: 0, message: err.message }
      //   return resolve(ret);
      // }
      await stopBrowser()
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
