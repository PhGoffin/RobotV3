/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2023-11-28 07:46:48 
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-28-04
 * @Description: The Express server
 */

const express = require ('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require ('cors')
const AppError = require("./utils/appError");
const errorController = require("./utils/errorController");

// Instance of the main routers
const userRouter = require("./api/user/user.router");
const projectRouter = require("./api/project/project.router");
const subprojectRouter = require("./api/subproject/subproject.router");
const dataSessionRouter = require("./api/datasession/datasession.router");
const fakerRouter = require("./api/faker/faker.router");
const referenceRouter = require("./api/reference/reference.router");
const referencebackupheaderRouter = require("./api/referencebackupheader/referencebackupheader.router");
const referencebackupRouter = require("./api/referencebackup/referencebackup.router");
const dictionaryRouter = require("./api/dictionary/dictionary.router");
const dictionaryheaderRouter = require("./api/dictionaryheader/dictionaryheader.router");
const naturalRouter = require("./api/ai_natural/natural.router");
const naturalheaderRouter = require("./api/ai_naturalheader/naturalheader.router");
const workspaceRouter = require("./api/workspace/workspace.router");
const licenseRouter = require("./api/license/license.router");
const libraryRouter = require("./api/library/library.router");
const roleRouter = require("./api/role/role.router");
const todoRouter = require("./api/todo/todo.router");
const scenarioRouter = require("./api/scenario/scenario.router");
const testRouter = require("./api/test/test.router");
//const testfunctionRouter = require("./api/testfunction/testfunction.router");
const suiteheaderRouter = require("./api/suiteheader/suiteheader.router");
const suiteRouter = require("./api/suite/suite.router");
const storyheaderRouter = require("./api/storyheader/storyheader.router");
const storyRouter = require("./api/story/story.router");
const storyexecRouter = require("./api/storyexec/storyexec.router");
const parameterRouter = require("./api/parameter/parameter.router");
const logfileRouter = require("./api/logfile/logfile.router");
const functionRouter = require("./api/function/function.router");
const datasetheaderRouter = require("./api/datasetheader/datasetheader.router");
const datasetRouter = require("./api/dataset/dataset.router");
const ruleheaderRouter = require("./api/ruleheader/ruleheader.router");
const ruleRouter = require("./api/rule/rule.router");
const dummyuserRouter = require("./api/dummyuser/dummyuser.router");
const patternRouter = require("./api/pattern/pattern.router");
const performanceRouter = require("./api/performance/performance.router")

// AI Robot
const selectorRouter = require("./api/ai_selector/selector.router");
const pathRouter = require("./api/ai_path/path.router");
const attributeRouter = require("./api/ai_attribute/attribute.router");
const tagelementRouter = require("./api/ai_tagelement/tagelement.router");
const tagattributeRouter = require("./api/ai_tagattribute/tagattribute.router");
const trainingRouter = require("./api/ai_training/training.router");
const browserRouter = require("./api/Selenium/browser/browser.router");



// Selenium
const robotRouter = require("./api/Selenium/robot/robot.router");
//Playwright
const playwrightRouter = require("./api/playwright/robot/robot.router");


// Upload
const uploadRouter = require("./api/upload/upload.router");


app.use(express.json());
app.use(express.urlencoded( {extended: true}));
app.use(cors());

//<router-link :to="{ name: 'AIAttributeEdit', params: { id: attributeID } }">

app.use("/api/browser", browserRouter );
// browser.getBrowser()
// browser.setBrowser()
// browser.getBrowser()



// main routing
app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);
app.use("/api/subproject", subprojectRouter);
app.use("/api/datasession", dataSessionRouter);
app.use("/api/faker", fakerRouter);
app.use("/api/reference", referenceRouter);
app.use("/api/referencebackupheader", referencebackupheaderRouter);
app.use("/api/referencebackup", referencebackupRouter);
app.use("/api/dictionaryheader", dictionaryheaderRouter);
app.use("/api/dictionary", dictionaryRouter);
app.use("/api/naturalheader", naturalheaderRouter);
app.use("/api/natural", naturalRouter);
app.use("/api/performance", performanceRouter);

app.use("/api/workspace", workspaceRouter);
app.use("/api/license", licenseRouter);
app.use("/api/library", libraryRouter);
app.use("/api/role", roleRouter);
app.use("/api/todo", todoRouter);
app.use("/api/scenario", scenarioRouter);
app.use("/api/test", testRouter);
//app.use("/api/testfunction", testfunctionRouter);
app.use("/api/suiteheader", suiteheaderRouter);
app.use("/api/suite", suiteRouter);
app.use("/api/storyheader", storyheaderRouter);
app.use("/api/story", storyRouter);
app.use("/api/storyexec", storyexecRouter);
app.use("/api/parameter", parameterRouter);
app.use("/api/logfile", logfileRouter);
app.use("/api/function", functionRouter);
app.use("/api/dataset", datasetRouter);
app.use("/api/datasetheader", datasetheaderRouter);
app.use("/api/ruleheader", ruleheaderRouter);
app.use("/api/rule", ruleRouter);
app.use("/api/dummyuser", dummyuserRouter);
app.use("/api/pattern", patternRouter);


app.use("/api/aiselector", selectorRouter);
app.use("/api/aipath", pathRouter);
app.use("/api/aiattribute", attributeRouter);
app.use("/api/aitagelement", tagelementRouter);
app.use("/api/aitagattribute", tagattributeRouter);
app.use("/api/aitraining", trainingRouter);

app.use("/api/Selenium/robot", robotRouter);
app.use("/api/playwright/robot", playwrightRouter);



app.use("/api/upload", uploadRouter);


// Error Exception
app.all('*', (req, res) => {
    throw new AppError(`Requested URL ${req.path} not found!`, 200); // 404
});

app.use(errorController)


app.listen(process.env.SERVER_PORT, () => console.log('app is running on port: ' + process.env.SERVER_PORT));