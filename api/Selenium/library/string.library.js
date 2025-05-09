/**
* @author 	Philippe Goffin
* @name   	string utility
* @property	javascript 
*
* @description 
*  some string functionalities
*
* @version 
* V1.0 PGO	09/10/2017	Initial version   
*
*/


/**
 * @function
 *   Left: simulate the left function
 *
 * @param {string} str  text.
 * @param {string} n    left position.
 *
 */
function Left(str, n) {
    if (n <= 0)
      return "";
    else if (n > String(str).length)
      return str;
    else
      return String(str).substring(0, n);
  }
  
  /**
   * @function
   *   Right: simulate the right function
   *
   * @param {string} str  text.
   * @param {string} n    right position.
   *
   */
  function Right(str, n) {
    if (n <= 0)
      return "";
    else if (n > String(str).length)
      return str;
    else {
      var iLen = String(str).length;
      return String(str).substring(iLen, iLen - n);
    }
  }
  
  /**
   * @function
   *   countWords: a basic function to count the number of words in a string
   *
   * @param {string} str  text.
   *
   */
  function countWords(str) {
    return str.split(/\s+/).length;
  }
  
  /**
   * @function
   *  Contains: a basic function to indicate if a substring is contained into a string
   *
   * @param {string} str     string
   * @param {string} subStr  substring.
   *
   */
  function Contains(str, subStr) {
    if (str.indexOf(subStr) >= 0) return 1;
    else return 0;
  }
  
  
  /**
   * @function
   *  Capitalize: The first letter of each word is set in upper case
   *  if the parameter is TRUE, all the sentence is converted in lowercase first
   *  E.g. : capitalize('javaSCrIPT');        // -> 'JavaSCrIPT'
   *         capitalize('javaSCrIPT', true);  // -> 'Javascript'
   *
   * @param {string}  str       the text to process
   * @param {boolean} lower     TRUE if text must be first converted in lowercase
   *
   */
  function Capitalize(str, lower = false) {
    return (lower ? str.toLowerCase() : str).replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
  };
  
  
  
  /**
   * @function
   *  pad: Add leading zero to number
   *
   * @param {number}  num       number to process
   * @param {number}  size      number of leading zero
   *
   */
  function pad(num, size) {
    return ('000000000' + num).substr(-size);
  };
  
  /**
   * @function
   *  parseHTML: convert HTML tag into a text ready to be printed on the console
   *
   * @param {text}  value       a value to transform
   *
   */
  function parseHTML(value) {
  
    let rex = /(<([^>]+)>)/ig;
    value = value.replace(rex , "");
    //console.log ('>-->  After parseHTML: ' + value);
    return value;
  };
  
  
  module.exports = {
    Left: Left,
    Right: Right,
    Contains: Contains,
    countWords: countWords,
    Capitalize: Capitalize,
    pad: pad,
    parseHTML: parseHTML
  };
  