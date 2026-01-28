const mysql = require("../../config/database");
const { chromium } = require('playwright');

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2024-02-01
 * @Last Modified by: Someone
   * @Last Modified time: 2026-01-28 16:44:29
   * @Description: All the database services available for the API dictionary
   */


  // -----------------------------------------------------------
  // Insert dictionary info into the table dictionary
  // -----------------------------------------------------------
  createDictionary: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into dictionary(projectID, dictionaryheaderID, code, label, comment, language, position, active, createdby, created, updatedby, updated) 
                  values(?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          data.projectID,
          data.dictionaryheaderID,
          data.code,
          data.label,
          data.comment,
          data.language,
          data.position,
          (data.active != undefined ? data.active : 1),
          data.user,
          data.today,
          data.user,
          data.today
        ],

        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },

  // ---------------------------------------------------------------------------
  // Get a dictionary by id
  // ---------------------------------------------------------------------------
  getDictionary: (dictionaryId) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT D.dictionaryID, D.projectId, D.dictionaryheaderID, CONCAT(H.code, D.code) as fullcode, H.code as headercode, D.code, 
         D.label, D.comment, D.language, D.position, D.active, D.createdby, D.created, D.updatedby, D.updated 
         FROM dictionary D, dictionaryheader H
         WHERE D.dictionaryId = ? AND D.dictionaryheaderID = H.dictionaryheaderID`,
        [dictionaryId],
        (error, results, fields) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },
  // ---------------------------------------------------------------------
  // Get dictionary by full code and language (optional) and active (optional)
  // ---------------------------------------------------------------------
  getDictionaryByCode: (data) => {
    //console.log ('getDictionaryByCode', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT D.dictionaryID, D.label, D.createdby, D.created, D.updatedby, D.updated 
         FROM dictionary D, dictionaryheader H 
         WHERE D.projectID = ? AND concat (H.code, D.code) = ? 
         AND ( D.language = ? OR D.language = '*') AND D.active = ? 
         AND D.dictionaryheaderID = H.dictionaryheaderID 
         ORDER BY D.language DESC`,
        [
          data.projectID,
          data.code,
          (data.language ? data.language : '*'),
          (data.active ? data.active : 1)
        ],
        (error, results, fields) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },

  // ---------------------------------------------------------------------------
  // Get all records from the table dictionary by project
  // ---------------------------------------------------------------------------
  getDictionaryByProject: (projectId) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT D.dictionaryID, D.projectId, D.dictionaryheaderID, CONCAT(H.code, D.code) as fullcode, H.code as headercode, D.code,
         D.label, D.comment, D.language, D.position, D.active, D.createdby, D.created, D.updatedby, D.updated 
         FROM dictionary D, dictionaryheader H
         WHERE D.projectID = ?
         AND D.dictionaryheaderID = H.dictionaryheaderID 
         ORDER BY LPAD(LOWER(D.position), 10, 0)`,
        [projectId],
        (error, results, fields) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },


  // ---------------------------------------------------------------------------
  // Get all records from the table dictionary by a header
  // ---------------------------------------------------------------------------
  getDictionaryByHeader: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT D.dictionaryID, D.projectId, D.dictionaryheaderID, CONCAT(H.code, D.code) as fullcode, H.code as headercode, D.code,
         D.label, D.comment, D.language, D.position, D.active, D.createdby, D.created, D.updatedby, D.updated 
         FROM dictionary D, dictionaryheader H
         WHERE D.dictionaryheaderID = ?
         AND D.dictionaryheaderID = H.dictionaryheaderID 
         ORDER BY LPAD(LOWER(D.position), 10, 0)`,
        [data.dictionaryheaderID],
        (error, results, fields) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },


  // ---------------------------------------------------------------------------
  // Get unused records from the table dictionary by project
  // ---------------------------------------------------------------------------
  getUnusedDictionary: (projectId) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT D.dictionaryID, D.projectId, D.dictionaryheaderID, CONCAT(H.code, D.code) as fullcode, H.code as headercode, D.code,
         D.label, D.comment, D.language, D.position, D.active, D.createdby, D.created, D.updatedby, D.updated
         FROM dictionary D, dictionaryheader H 
         WHERE D.projectID = ? AND D.active = 1 AND D.dictionaryheaderID = H.dictionaryheaderID 
         AND (concat(H.code, D.code) NOT IN (SELECT parameter1 FROM test)) 
         AND (concat(H.code, D.code) NOT IN (SELECT parameter2 FROM test)) 
         AND (concat(H.code, D.code) NOT IN (SELECT parameter3 FROM test)) 
         AND (concat(H.code, D.code) NOT IN (SELECT parameter4 FROM test)) 
         AND (1 NOT IN (SELECT 1 FROM rule WHERE LOCATE(CONCAT(H.code, D.code), ruleResult)))`,
        [projectId],
        (error, results, fields) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },

  // ---------------------------------------------------------------------------
  // Update a dictionary record 
  // ---------------------------------------------------------------------------
  updateDictionary: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE dictionary SET code=?, label=?, comment=?, language=?, active=?, updatedby=?, updated=?  
         WHERE projectID = ? AND dictionaryID = ?`,
        [
          data.code,
          data.label,
          data.comment,
          (data.language ? data.language : '*'),
          (data.active != undefined ? data.active : 1),
          data.user,
          data.today,
          data.projectID,
          data.dictionaryID
        ],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },

  // -----------------------------------------------------------
  // Update Dictionary position
  // -----------------------------------------------------------
  updateDictionaryPosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE dictionary SET position = ? WHERE dictionaryID = ?`,
        [
          data.position,
          data.dictionaryID
        ],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },

  // -----------------------------------------------------------
  // reorder all Dictionarys
  // -----------------------------------------------------------

  reorderDictionary: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE dictionary AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, dictionaryID, LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM dictionary,
         (SELECT @row_number:=0) as t
         WHERE dictionaryheaderID=?
          ORDER BY  dictionaryheaderID, pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.dictionaryID = T2.dictionaryID`,
        [
          data.dictionaryheaderID
        ],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },

  // -----------------------------------------------------------
  // Copy a Dictionary record
  // -----------------------------------------------------------
  copyDictionary: (data) => {
    //console.log ('Data', data)

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO dictionary ( projectID, dictionaryheaderID, code, label, comment, language, active, position, createdby, created, updatedby, updated )
        SELECT t1.projectID, t1.dictionaryheaderID, t1.code, t1.label, t1.comment, t1.language, t1.active, ?, ?, ?, ?, ? 
        FROM dictionary t1 WHERE t1.dictionaryID = ?`,
        [
          data.position,
          data.user,
          data.today,
          data.user,
          data.today,
          data.dictionaryID
        ],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },


  // -----------------------------------------------------------
  // Copy all Dictionary records from a dictionaryheader
  // -----------------------------------------------------------
  copyAllDictionary: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO dictionary ( projectID, dictionaryheaderID, code, label, comment, language, active, position, createdby, created, updatedby, updated )
        SELECT t1.projectID, ?, t1.code, t1.label, t1.comment, t1.language, t1.active, t1.position, t1.createdby, t1.created, t1.updatedby, t1.updated
        FROM dictionary t1 WHERE t1.dictionaryheaderID = ?`,
        [
          data.dictionaryheaderIDCopy,
          data.dictionaryheaderIDOrigin
        ],

        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },

  // ---------------------------------------------------------------------------
  // Delete a record in the dictionary
  // ---------------------------------------------------------------------------
  deleteDictionary: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM dictionary WHERE dictionaryheaderID = ? AND dictionaryID = ?`,
        [
          data.dictionaryheaderID,
          data.dictionaryID
        ],
        (error, results, fields) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },

  // ---------------------------------------------------------------------------
  // Delete all dictionary record linked to a dictionaryheader
  // ---------------------------------------------------------------------------
  deleteAllDictionary: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM dictionary WHERE dictionaryheaderID = ?`,
        [
          data.dictionaryheaderID
        ],
        (error, results, fields) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },


  // ---------------------------------------------------------------------------
  // Scan a web browser to facilitate the creation of a dictionary record
  // ---------------------------------------------------------------------------

  scanDictionary: (data) => {
    return new Promise(async (resolve, reject) => {
      console.log('Url: ' + data.myUrl)

      // 1. Launch the browser (headless: false is required so the user can interact)
      const browser = await chromium.launch({ headless: false });
      const context = await browser.newContext();
      const page = await context.newPage();
      let theAttributes

      // The URL you want to inspect
      const targetUrl = data.myUrl
      await page.goto(targetUrl);


      // 2. Expose a Node.js function to the browser
      await page.exposeFunction('onElementClicked', (attributes) => {
        console.log('\n[Element Selected]:');
        //console.table(attributes);
        theAttributes = attributes
        console.table(theAttributes);
        browser.close();
      });

      // 3. Inject the Inspector logic
      await page.addInitScript(() => {

        // Helper function to generate XPath
        const getXPath = (element) => {

          if (element === document.body) {
            return '/html/body';
          }

          let ix = 0;
          const siblings = element.parentNode.childNodes;
          for (let i = 0; i < siblings.length; i++) {
            const sibling = siblings[i];
            if (sibling === element) {
              return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
            }
            if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
              ix++;
            }
          }
        };

        window.addEventListener('DOMContentLoaded', () => {
          // Create a style element for the hover effect
          const style = document.createElement('style');
          style.innerHTML = `
        .playwright-hover-outline {
          outline: 2px dashed #ff0000 !important;
          outline-offset: -2px !important;
          cursor: crosshair !important;
        }
      `;
          document.head.appendChild(style);

          let lastElement = null;

          // Mouseover: Highlight the element
          document.addEventListener('mouseover', (e) => {
            if (lastElement) lastElement.classList.remove('playwright-hover-outline');
            e.target.classList.add('playwright-hover-outline');
            lastElement = e.target;
          }, true);

          // Click: Capture attributes and send to Node.js
          document.addEventListener('click', (e) => {
            // Prevent links from opening or buttons from submitting
            e.preventDefault();
            e.stopPropagation();

            const el = e.target;

            // Gather attributes
            const attributes = {
              tagName: el.tagName.toLowerCase(),
              id: el.id || 'N/A',
              name: el.getAttribute('name') || 'N/A',
              class: el.className || 'N/A',
              innerText: el.innerText?.substring(0, 50).trim() || 'N/A',
              placeholder: el.getAttribute('placeholder') || 'N/A',
              source: el.getAttribute('src') || 'N/A',
              type: el.getAttribute('type') || 'N/A',
              xpath: getXPath(el)
            };

            // Call the Node.js function
            window.onElementClicked(attributes);
          }, true);
        });
      });

      // Reload the page once to ensure the script is injected correctly if navigating manually
      await page.reload();

      // Keep the script running
      page.on('close', () => {
        console.log('Browser is closed!')
        return resolve({ success: 1, attributes: theAttributes, message: 'Scan Ok' })
      });


    });
  }



};
