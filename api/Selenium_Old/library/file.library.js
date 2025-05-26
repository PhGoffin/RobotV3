

/**
* @author 	Philippe Goffin
* @name   	File utility
* @property	javascript 
*
* @description 
*  File functions
*
* @version 
* V1.0 PGO	16/02/2024	Initial version   
*
*/

/**
* @function
*   importPatterns: import patterns from a json file to a table pattern in the database
*
* @param {string} myFilename:  filename of the json file
*
*/
async function importPatterns(projectID, myFilename) {
    const { createPattern, deleteAllPattern } = require("../../pattern/pattern.service");
    let dataAPI = {}

    // Read all the patterns of the json file
    let fileName = './data/' + myFilename
    let parseJson = await readInfo(fileName)
    if (!parseJson) {
        return { success: 0, message: "Cannot read the json file: " + fileName }
    }

    // Delete all the patterns of the project
    dataAPI = { projectID: projectID }
    const result = await deleteAllPattern(dataAPI);
    console.log ('Deleted ' + result.affectedRows + ' pattern(s) of the project: ' + projectID )

    // Insert the patterns into the database
    let position = 0
    for (let element in parseJson.Dictionaries) {
      var dict = parseJson.Dictionaries[element]
      position = position + 1
      console.log(dict.name + '(' + dict.id + ')' + " path: " + dict.path + " tag: " + dict.tag + " result: " + dict.result.length );
      // write the information in the database
      dataAPI = { projectID: projectID, selector: dict.name, path: dict.path, tag: dict.tag, attribute: dict.attribute,
                  result: dict.result, weight: dict.weight, comment: dict.comment, position: position, active: 1 }
      const result = await createPattern(dataAPI);
      if (!result.affectedRows) {
        return { success: 0, message: "Error inserting pattern: " + dict.id + ' ' + dict.name }
      }
  
    }
    console.log ('Imported: ' + position + ' pattern(s)')
    return { success: 1, message: 'Imported: ' + position + ' pattern(s)' }

}



/**
* @function
*   importAttributes: import attributes from a json file to a table attribute in the database
*
* @param {string} myFilename:  filename of the json file
*
*/
async function importAttributes(projectID, myFilename) {
    const { createAttribute, deleteAllAttribute } = require("../../ai_attribute/attribute.service");
    let dataAPI = {}

    // Read all the patterns of the json file
    let fileName = './data/' + myFilename
    let parseJson = await readInfo(fileName)
    if (!parseJson) {
        return { success: 0, message: "Cannot read the json file: " + fileName }
    }

    // Delete all the attributes of the project
    dataAPI = { projectID: projectID }
    const result = await deleteAllAttribute(dataAPI);
    console.log ('Deleted ' + result.affectedRows + ' attribute(s) of the project: ' + projectID )

    // Insert the attributes into the database
    let position = 0
    for (let element in parseJson.Dictionaries) {
      var dict = parseJson.Dictionaries[element]
      position = position + 1
      console.log(dict.name + '(' + dict.id + ')' + " name: " + dict.name  );
      // write the information in the database
      // projectID, name, first, intermediate, last, comment, position, active
      dataAPI = { projectID: projectID, name: dict.name, first: dict.first, intermediate: dict.intermediate, last: dict.last,
                  comment: dict.comment, position: position, active: 1 }
      const result = await createAttribute(dataAPI);
      if (!result.affectedRows) {
        return { success: 0, message: "Error inserting attribute: " + dict.id + ' ' + dict.name }
      }
  
    }
    console.log ('Imported: ' + position + ' pattern(s)')
    return { success: 1, message: 'Imported: ' + position + ' pattern(s)' }

}

/**
* @function
*   importPaths: import paths from a json file to a table path in the database
*
* @param {string} myFilename:  filename of the json file
*
*/
async function importPaths(projectID, myFilename) {
    const { createPath, deleteAllPath } = require("../../ai_path/path.service");
    let dataAPI = {}

    // Read all the patterns of the json file
    let fileName = './data/' + myFilename
    let parseJson = await readInfo(fileName)
    if (!parseJson) {
        return { success: 0, message: "Cannot read the json file: " + fileName }
    }

    // Delete all the paths of the project
    dataAPI = { projectID: projectID }
    const result = await deleteAllPath(dataAPI);
    console.log ('Deleted ' + result.affectedRows + ' path(s) of the project: ' + projectID )

    // Insert the paths into the database
    let position = 0
    for (let element in parseJson.Dictionaries) {
      var dict = parseJson.Dictionaries[element]
      position = position + 1
      //console.log( '(' + dict.id + ')' );
      // write the information in the database
      // projectID, fullPath, pathCondition, comment, position, active
      dataAPI = { projectID: projectID, fullPath: dict.path, pathCondition: dict.condition,
                  comment: dict.comment, weight: dict.weight, position: position, active: 1 }
      const result = await createPath(dataAPI);
      if (!result.affectedRows) {
        return { success: 0, message: "Error inserting path: " + dict.id + ' ' + dict.name }
      }
  
    }
    console.log ('Imported: ' + position + ' path(s)')
    return { success: 1, message: 'Imported: ' + position + ' path(s)' }

}

/**
* @function
*   importSelectors: import selectors from a json file to a table ai_selector in the database
*
* @param {string} myFilename:  filename of the json file
*
*/
async function importSelectors(projectID, myFilename) {
    const { createSelector, deleteAllSelector } = require("../../ai_selector/selector.service");
    let dataAPI = {}

    // Read all the patterns of the json file
    let fileName = './data/' + myFilename
    let parseJson = await readInfo(fileName)
    if (!parseJson) {
        return { success: 0, message: "Cannot read the json file: " + fileName }
    }

    // Delete all the selectors of the project
    dataAPI = { projectID: projectID }
    const result = await deleteAllSelector(dataAPI);
    console.log ('Deleted ' + result.affectedRows + ' selector(s) of the project: ' + projectID )

    // Insert the paths into the database
    let position = 0
    for (let element in parseJson.Dictionaries) {
      var dict = parseJson.Dictionaries[element]
      position = position + 1
      console.log( '(' + dict.id + ')' );
      // write the information in the database
      // projectID, name, endTag, comment, position, active
      dataAPI = { projectID: projectID, name: dict.name, endTag: dict.endTag,
                  comment: dict.comment, position: position, active: 1 }
      const result = await createSelector(dataAPI);
      if (!result.affectedRows) {
        return { success: 0, message: "Error inserting selectors: " + dict.id + ' ' + dict.name }
      }
  
    }
    console.log ('Imported: ' + position + ' selector(s)')
    return { success: 1, message: 'Imported: ' + position + ' selector(s)' }

}





/**
* @function
*   readInfo: read data from a json file
*
* @param {string} myFilename:  filename of the json file
*
*/
async function readInfo(myFilename) {
    let fs = require("fs")
    let parseJson = []
    console.log("\n**** readInfo: " + myFilename + " *****")
    //console.log("Current directory:", process.cwd());
    let ret = await fileExist(myFilename)
    if ( ret == true) {
        // file exist
        let content = fs.readFileSync(myFilename, 'utf8')
        // parse the json file
        try {
            parseJson = JSON.parse(content)
            //console.log ("json: ", parseJson)
            return parseJson
        }
        catch (err) {
            console.log("Error reading json file: " + err.message)
            return ""
        }
    }
    else {
        console.log("File not found!")
        return ""
    }
}


/**
* @function
*   fileExist: Check if a file exists
*
* @param {string} filename:  filname of the json file
*
* @return: true: file exists otherwise false
*
*/
async function fileExist (filePath) {
    var fs = require('fs')

    // console.log ('fileExist - filePath: ' + filePath)
    // console.log("Current directory:", process.cwd());

    try {
        fs.statSync(filePath)
    } catch (err) {
        if (err.code == 'ENOENT') return false
    }
    return true
}


/**
* @function
*   fileDelete: Delete a file (if it exists)
*
* @param {string} filename:  filname of the json file
*
*/

async function fileDelete(filename) {
    var fs = require('fs')

    if (fileExist(filename) == true) {
        fs.unlink(filename, function (err) {
            if (err) return console.log(err)
            console.log('file deleted successfully')
        })
    }
}

/**
* @function
*   writeFile: Write a value in a file
*
* @param {string} filename:  filname of the file
* @param {string} value:     value to write into the file
*
*/

async function writeFile(filename, value) {
    var fs = require('fs')
    fs.writeFile(filename, value, function (err) {
        if (err) return console.log('===> ERROR: file.library - writeFile: ' + err)
        return 1
    })
}


/**
* @function
*   appendFile: Append a value into a file
*
* @param {string} filename:  filname of the file
* @param {string} value:     value to append into the file
*
*/

async function appendFile(filename, value) {
    var fs = require('fs')
    fs.appendFile(filename, value, function (err) {
        if (err) return console.log('===> ERROR: file.library - appendFile: ' + err)
        return 1
    })
}


module.exports = {
    readInfo: readInfo,
    importPatterns: importPatterns,
    importAttributes: importAttributes,
    importPaths: importPaths,
    importSelectors: importSelectors,
    fileExist: fileExist

};    