/**
* @author 	Philippe Goffin
* @name   	Rules
* @property	Class 
*
* @description 
*  variable functionalities in a class
*
* @version 
* V1.00 PGO	30/01/2024	Initial version
*
*/
class Variables {

    /**
     * @function
     *   constructor: create an array to contain the Variables
     *
     * @param {string} myFilename path of the json file.
     *
     */
    constructor(myFilename) {

        // Definition of the global variables
        this.myVariables = [];  // storage for the rules variables
        this.myMessage = '';    // A global error message
        this.verbose = 1;       // verbose mode: 0 - Normal, 1 - Full
        this.startingTime = 0;  // start date
        this.userStartingTime = 0;  // User start date
        // clean previous variables
        this.cleanVariable();

        // Include the external libraries
        this.moment = require('moment');

        // clean previous variables
        this.cleanVariable();

    }

    /**
     * @function
     *   formatDate: return a date in the right format
     *
     * @param {object} date a date object.
     * @param {string} format example: dd/mm/year.
     *
     */
    formatDate(date, format) {
        const map = {
            mm: date.getMonth() + 1,
            dd: date.getDate(),
            yy: date.getFullYear().toString().slice(-2),
            year: date.getFullYear(),
            hh: date.getHours(),
            mi: date.getMinutes()
        }

        return format.replace(/mm|dd|yy|year|hh|mi/gi, matched => map[matched])
    }



    /**
     * @function
     *   getVariable: get the value of a variable (stored in an object)
     *
     * @param {string} myName Name of the variable.
     *
     */
    getVariable(myName) {
        for (var item in this.myVariables) {
            if (item == myName) {
                // check if it's a numeric value
                if (isNaN(this.myVariables[item] * 1)) {
                    // Variable is a string
                    this.displayLog(2, 3, "> getVariable - Variable: " + myName + " = '" + this.myVariables[item] + "' (" + typeof (this.myVariables[item]) + ")");
                    let myValue = "'" + this.myVariables[item] + "'";
                    myValue = myValue.replace(/''/g, "'");
                    return myValue;
                }
                else { // Variable is a number
                    this.displayLog(2, 3, "> getVariable - Variable: " + myName + " = " + this.myVariables[item] * 1 + " (" + typeof (this.myVariables[item] * 1) + ")");
                    return this.myVariables[item] * 1;
                }
            }
        }
        // variable is not defined
        return "<N/A>";
    }


    /**
     * @function
     *   latinize: remove the french characters (E.g.: é è ê...)
     *
     * @param {string} myValue Value to convert
     *
     */
    latinize(myValue) {
        var Latinise = {};

        if (typeof (myValue) == "string") {
            Latinise.latin_map = { "Á": "A", "Ă": "A", "Ắ": "A", "Ặ": "A", "Ằ": "A", "Ẳ": "A", "Ẵ": "A", "Ǎ": "A", "Â": "A", "Ấ": "A", "Ậ": "A", "Ầ": "A", "Ẩ": "A", "Ẫ": "A", "Ä": "A", "Ǟ": "A", "Ȧ": "A", "Ǡ": "A", "Ạ": "A", "Ȁ": "A", "À": "A", "Ả": "A", "Ȃ": "A", "Ā": "A", "Ą": "A", "Å": "A", "Ǻ": "A", "Ḁ": "A", "Ⱥ": "A", "Ã": "A", "Ꜳ": "AA", "Æ": "AE", "Ǽ": "AE", "Ǣ": "AE", "Ꜵ": "AO", "Ꜷ": "AU", "Ꜹ": "AV", "Ꜻ": "AV", "Ꜽ": "AY", "Ḃ": "B", "Ḅ": "B", "Ɓ": "B", "Ḇ": "B", "Ƀ": "B", "Ƃ": "B", "Ć": "C", "Č": "C", "Ç": "C", "Ḉ": "C", "Ĉ": "C", "Ċ": "C", "Ƈ": "C", "Ȼ": "C", "Ď": "D", "Ḑ": "D", "Ḓ": "D", "Ḋ": "D", "Ḍ": "D", "Ɗ": "D", "Ḏ": "D", "ǲ": "D", "ǅ": "D", "Đ": "D", "Ƌ": "D", "Ǳ": "DZ", "Ǆ": "DZ", "É": "E", "Ĕ": "E", "Ě": "E", "Ȩ": "E", "Ḝ": "E", "Ê": "E", "Ế": "E", "Ệ": "E", "Ề": "E", "Ể": "E", "Ễ": "E", "Ḙ": "E", "Ë": "E", "Ė": "E", "Ẹ": "E", "Ȅ": "E", "È": "E", "Ẻ": "E", "Ȇ": "E", "Ē": "E", "Ḗ": "E", "Ḕ": "E", "Ę": "E", "Ɇ": "E", "Ẽ": "E", "Ḛ": "E", "Ꝫ": "ET", "Ḟ": "F", "Ƒ": "F", "Ǵ": "G", "Ğ": "G", "Ǧ": "G", "Ģ": "G", "Ĝ": "G", "Ġ": "G", "Ɠ": "G", "Ḡ": "G", "Ǥ": "G", "Ḫ": "H", "Ȟ": "H", "Ḩ": "H", "Ĥ": "H", "Ⱨ": "H", "Ḧ": "H", "Ḣ": "H", "Ḥ": "H", "Ħ": "H", "Í": "I", "Ĭ": "I", "Ǐ": "I", "Î": "I", "Ï": "I", "Ḯ": "I", "İ": "I", "Ị": "I", "Ȉ": "I", "Ì": "I", "Ỉ": "I", "Ȋ": "I", "Ī": "I", "Į": "I", "Ɨ": "I", "Ĩ": "I", "Ḭ": "I", "Ꝺ": "D", "Ꝼ": "F", "Ᵹ": "G", "Ꞃ": "R", "Ꞅ": "S", "Ꞇ": "T", "Ꝭ": "IS", "Ĵ": "J", "Ɉ": "J", "Ḱ": "K", "Ǩ": "K", "Ķ": "K", "Ⱪ": "K", "Ꝃ": "K", "Ḳ": "K", "Ƙ": "K", "Ḵ": "K", "Ꝁ": "K", "Ꝅ": "K", "Ĺ": "L", "Ƚ": "L", "Ľ": "L", "Ļ": "L", "Ḽ": "L", "Ḷ": "L", "Ḹ": "L", "Ⱡ": "L", "Ꝉ": "L", "Ḻ": "L", "Ŀ": "L", "Ɫ": "L", "ǈ": "L", "Ł": "L", "Ǉ": "LJ", "Ḿ": "M", "Ṁ": "M", "Ṃ": "M", "Ɱ": "M", "Ń": "N", "Ň": "N", "Ņ": "N", "Ṋ": "N", "Ṅ": "N", "Ṇ": "N", "Ǹ": "N", "Ɲ": "N", "Ṉ": "N", "Ƞ": "N", "ǋ": "N", "Ñ": "N", "Ǌ": "NJ", "Ó": "O", "Ŏ": "O", "Ǒ": "O", "Ô": "O", "Ố": "O", "Ộ": "O", "Ồ": "O", "Ổ": "O", "Ỗ": "O", "Ö": "O", "Ȫ": "O", "Ȯ": "O", "Ȱ": "O", "Ọ": "O", "Ő": "O", "Ȍ": "O", "Ò": "O", "Ỏ": "O", "Ơ": "O", "Ớ": "O", "Ợ": "O", "Ờ": "O", "Ở": "O", "Ỡ": "O", "Ȏ": "O", "Ꝋ": "O", "Ꝍ": "O", "Ō": "O", "Ṓ": "O", "Ṑ": "O", "Ɵ": "O", "Ǫ": "O", "Ǭ": "O", "Ø": "O", "Ǿ": "O", "Õ": "O", "Ṍ": "O", "Ṏ": "O", "Ȭ": "O", "Ƣ": "OI", "Ꝏ": "OO", "Ɛ": "E", "Ɔ": "O", "Ȣ": "OU", "Ṕ": "P", "Ṗ": "P", "Ꝓ": "P", "Ƥ": "P", "Ꝕ": "P", "Ᵽ": "P", "Ꝑ": "P", "Ꝙ": "Q", "Ꝗ": "Q", "Ŕ": "R", "Ř": "R", "Ŗ": "R", "Ṙ": "R", "Ṛ": "R", "Ṝ": "R", "Ȑ": "R", "Ȓ": "R", "Ṟ": "R", "Ɍ": "R", "Ɽ": "R", "Ꜿ": "C", "Ǝ": "E", "Ś": "S", "Ṥ": "S", "Š": "S", "Ṧ": "S", "Ş": "S", "Ŝ": "S", "Ș": "S", "Ṡ": "S", "Ṣ": "S", "Ṩ": "S", "Ť": "T", "Ţ": "T", "Ṱ": "T", "Ț": "T", "Ⱦ": "T", "Ṫ": "T", "Ṭ": "T", "Ƭ": "T", "Ṯ": "T", "Ʈ": "T", "Ŧ": "T", "Ɐ": "A", "Ꞁ": "L", "Ɯ": "M", "Ʌ": "V", "Ꜩ": "TZ", "Ú": "U", "Ŭ": "U", "Ǔ": "U", "Û": "U", "Ṷ": "U", "Ü": "U", "Ǘ": "U", "Ǚ": "U", "Ǜ": "U", "Ǖ": "U", "Ṳ": "U", "Ụ": "U", "Ű": "U", "Ȕ": "U", "Ù": "U", "Ủ": "U", "Ư": "U", "Ứ": "U", "Ự": "U", "Ừ": "U", "Ử": "U", "Ữ": "U", "Ȗ": "U", "Ū": "U", "Ṻ": "U", "Ų": "U", "Ů": "U", "Ũ": "U", "Ṹ": "U", "Ṵ": "U", "Ꝟ": "V", "Ṿ": "V", "Ʋ": "V", "Ṽ": "V", "Ꝡ": "VY", "Ẃ": "W", "Ŵ": "W", "Ẅ": "W", "Ẇ": "W", "Ẉ": "W", "Ẁ": "W", "Ⱳ": "W", "Ẍ": "X", "Ẋ": "X", "Ý": "Y", "Ŷ": "Y", "Ÿ": "Y", "Ẏ": "Y", "Ỵ": "Y", "Ỳ": "Y", "Ƴ": "Y", "Ỷ": "Y", "Ỿ": "Y", "Ȳ": "Y", "Ɏ": "Y", "Ỹ": "Y", "Ź": "Z", "Ž": "Z", "Ẑ": "Z", "Ⱬ": "Z", "Ż": "Z", "Ẓ": "Z", "Ȥ": "Z", "Ẕ": "Z", "Ƶ": "Z", "Ĳ": "IJ", "Œ": "OE", "ᴀ": "A", "ᴁ": "AE", "ʙ": "B", "ᴃ": "B", "ᴄ": "C", "ᴅ": "D", "ᴇ": "E", "ꜰ": "F", "ɢ": "G", "ʛ": "G", "ʜ": "H", "ɪ": "I", "ʁ": "R", "ᴊ": "J", "ᴋ": "K", "ʟ": "L", "ᴌ": "L", "ᴍ": "M", "ɴ": "N", "ᴏ": "O", "ɶ": "OE", "ᴐ": "O", "ᴕ": "OU", "ᴘ": "P", "ʀ": "R", "ᴎ": "N", "ᴙ": "R", "ꜱ": "S", "ᴛ": "T", "ⱻ": "E", "ᴚ": "R", "ᴜ": "U", "ᴠ": "V", "ᴡ": "W", "ʏ": "Y", "ᴢ": "Z", "á": "a", "ă": "a", "ắ": "a", "ặ": "a", "ằ": "a", "ẳ": "a", "ẵ": "a", "ǎ": "a", "â": "a", "ấ": "a", "ậ": "a", "ầ": "a", "ẩ": "a", "ẫ": "a", "ä": "a", "ǟ": "a", "ȧ": "a", "ǡ": "a", "ạ": "a", "ȁ": "a", "à": "a", "ả": "a", "ȃ": "a", "ā": "a", "ą": "a", "ᶏ": "a", "ẚ": "a", "å": "a", "ǻ": "a", "ḁ": "a", "ⱥ": "a", "ã": "a", "ꜳ": "aa", "æ": "ae", "ǽ": "ae", "ǣ": "ae", "ꜵ": "ao", "ꜷ": "au", "ꜹ": "av", "ꜻ": "av", "ꜽ": "ay", "ḃ": "b", "ḅ": "b", "ɓ": "b", "ḇ": "b", "ᵬ": "b", "ᶀ": "b", "ƀ": "b", "ƃ": "b", "ɵ": "o", "ć": "c", "č": "c", "ç": "c", "ḉ": "c", "ĉ": "c", "ɕ": "c", "ċ": "c", "ƈ": "c", "ȼ": "c", "ď": "d", "ḑ": "d", "ḓ": "d", "ȡ": "d", "ḋ": "d", "ḍ": "d", "ɗ": "d", "ᶑ": "d", "ḏ": "d", "ᵭ": "d", "ᶁ": "d", "đ": "d", "ɖ": "d", "ƌ": "d", "ı": "i", "ȷ": "j", "ɟ": "j", "ʄ": "j", "ǳ": "dz", "ǆ": "dz", "é": "e", "ĕ": "e", "ě": "e", "ȩ": "e", "ḝ": "e", "ê": "e", "ế": "e", "ệ": "e", "ề": "e", "ể": "e", "ễ": "e", "ḙ": "e", "ë": "e", "ė": "e", "ẹ": "e", "ȅ": "e", "è": "e", "ẻ": "e", "ȇ": "e", "ē": "e", "ḗ": "e", "ḕ": "e", "ⱸ": "e", "ę": "e", "ᶒ": "e", "ɇ": "e", "ẽ": "e", "ḛ": "e", "ꝫ": "et", "ḟ": "f", "ƒ": "f", "ᵮ": "f", "ᶂ": "f", "ǵ": "g", "ğ": "g", "ǧ": "g", "ģ": "g", "ĝ": "g", "ġ": "g", "ɠ": "g", "ḡ": "g", "ᶃ": "g", "ǥ": "g", "ḫ": "h", "ȟ": "h", "ḩ": "h", "ĥ": "h", "ⱨ": "h", "ḧ": "h", "ḣ": "h", "ḥ": "h", "ɦ": "h", "ẖ": "h", "ħ": "h", "ƕ": "hv", "í": "i", "ĭ": "i", "ǐ": "i", "î": "i", "ï": "i", "ḯ": "i", "ị": "i", "ȉ": "i", "ì": "i", "ỉ": "i", "ȋ": "i", "ī": "i", "į": "i", "ᶖ": "i", "ɨ": "i", "ĩ": "i", "ḭ": "i", "ꝺ": "d", "ꝼ": "f", "ᵹ": "g", "ꞃ": "r", "ꞅ": "s", "ꞇ": "t", "ꝭ": "is", "ǰ": "j", "ĵ": "j", "ʝ": "j", "ɉ": "j", "ḱ": "k", "ǩ": "k", "ķ": "k", "ⱪ": "k", "ꝃ": "k", "ḳ": "k", "ƙ": "k", "ḵ": "k", "ᶄ": "k", "ꝁ": "k", "ꝅ": "k", "ĺ": "l", "ƚ": "l", "ɬ": "l", "ľ": "l", "ļ": "l", "ḽ": "l", "ȴ": "l", "ḷ": "l", "ḹ": "l", "ⱡ": "l", "ꝉ": "l", "ḻ": "l", "ŀ": "l", "ɫ": "l", "ᶅ": "l", "ɭ": "l", "ł": "l", "ǉ": "lj", "ſ": "s", "ẜ": "s", "ẛ": "s", "ẝ": "s", "ḿ": "m", "ṁ": "m", "ṃ": "m", "ɱ": "m", "ᵯ": "m", "ᶆ": "m", "ń": "n", "ň": "n", "ņ": "n", "ṋ": "n", "ȵ": "n", "ṅ": "n", "ṇ": "n", "ǹ": "n", "ɲ": "n", "ṉ": "n", "ƞ": "n", "ᵰ": "n", "ᶇ": "n", "ɳ": "n", "ñ": "n", "ǌ": "nj", "ó": "o", "ŏ": "o", "ǒ": "o", "ô": "o", "ố": "o", "ộ": "o", "ồ": "o", "ổ": "o", "ỗ": "o", "ö": "o", "ȫ": "o", "ȯ": "o", "ȱ": "o", "ọ": "o", "ő": "o", "ȍ": "o", "ò": "o", "ỏ": "o", "ơ": "o", "ớ": "o", "ợ": "o", "ờ": "o", "ở": "o", "ỡ": "o", "ȏ": "o", "ꝋ": "o", "ꝍ": "o", "ⱺ": "o", "ō": "o", "ṓ": "o", "ṑ": "o", "ǫ": "o", "ǭ": "o", "ø": "o", "ǿ": "o", "õ": "o", "ṍ": "o", "ṏ": "o", "ȭ": "o", "ƣ": "oi", "ꝏ": "oo", "ɛ": "e", "ᶓ": "e", "ɔ": "o", "ᶗ": "o", "ȣ": "ou", "ṕ": "p", "ṗ": "p", "ꝓ": "p", "ƥ": "p", "ᵱ": "p", "ᶈ": "p", "ꝕ": "p", "ᵽ": "p", "ꝑ": "p", "ꝙ": "q", "ʠ": "q", "ɋ": "q", "ꝗ": "q", "ŕ": "r", "ř": "r", "ŗ": "r", "ṙ": "r", "ṛ": "r", "ṝ": "r", "ȑ": "r", "ɾ": "r", "ᵳ": "r", "ȓ": "r", "ṟ": "r", "ɼ": "r", "ᵲ": "r", "ᶉ": "r", "ɍ": "r", "ɽ": "r", "ↄ": "c", "ꜿ": "c", "ɘ": "e", "ɿ": "r", "ś": "s", "ṥ": "s", "š": "s", "ṧ": "s", "ş": "s", "ŝ": "s", "ș": "s", "ṡ": "s", "ṣ": "s", "ṩ": "s", "ʂ": "s", "ᵴ": "s", "ᶊ": "s", "ȿ": "s", "ɡ": "g", "ᴑ": "o", "ᴓ": "o", "ᴝ": "u", "ť": "t", "ţ": "t", "ṱ": "t", "ț": "t", "ȶ": "t", "ẗ": "t", "ⱦ": "t", "ṫ": "t", "ṭ": "t", "ƭ": "t", "ṯ": "t", "ᵵ": "t", "ƫ": "t", "ʈ": "t", "ŧ": "t", "ᵺ": "th", "ɐ": "a", "ᴂ": "ae", "ǝ": "e", "ᵷ": "g", "ɥ": "h", "ʮ": "h", "ʯ": "h", "ᴉ": "i", "ʞ": "k", "ꞁ": "l", "ɯ": "m", "ɰ": "m", "ᴔ": "oe", "ɹ": "r", "ɻ": "r", "ɺ": "r", "ⱹ": "r", "ʇ": "t", "ʌ": "v", "ʍ": "w", "ʎ": "y", "ꜩ": "tz", "ú": "u", "ŭ": "u", "ǔ": "u", "û": "u", "ṷ": "u", "ü": "u", "ǘ": "u", "ǚ": "u", "ǜ": "u", "ǖ": "u", "ṳ": "u", "ụ": "u", "ű": "u", "ȕ": "u", "ù": "u", "ủ": "u", "ư": "u", "ứ": "u", "ự": "u", "ừ": "u", "ử": "u", "ữ": "u", "ȗ": "u", "ū": "u", "ṻ": "u", "ų": "u", "ᶙ": "u", "ů": "u", "ũ": "u", "ṹ": "u", "ṵ": "u", "ᵫ": "ue", "ꝸ": "um", "ⱴ": "v", "ꝟ": "v", "ṿ": "v", "ʋ": "v", "ᶌ": "v", "ⱱ": "v", "ṽ": "v", "ꝡ": "vy", "ẃ": "w", "ŵ": "w", "ẅ": "w", "ẇ": "w", "ẉ": "w", "ẁ": "w", "ⱳ": "w", "ẘ": "w", "ẍ": "x", "ẋ": "x", "ᶍ": "x", "ý": "y", "ŷ": "y", "ÿ": "y", "ẏ": "y", "ỵ": "y", "ỳ": "y", "ƴ": "y", "ỷ": "y", "ỿ": "y", "ȳ": "y", "ẙ": "y", "ɏ": "y", "ỹ": "y", "ź": "z", "ž": "z", "ẑ": "z", "ʑ": "z", "ⱬ": "z", "ż": "z", "ẓ": "z", "ȥ": "z", "ẕ": "z", "ᵶ": "z", "ᶎ": "z", "ʐ": "z", "ƶ": "z", "ɀ": "z", "ﬀ": "ff", "ﬃ": "ffi", "ﬄ": "ffl", "ﬁ": "fi", "ﬂ": "fl", "ĳ": "ij", "œ": "oe", "ﬆ": "st", "ₐ": "a", "ₑ": "e", "ᵢ": "i", "ⱼ": "j", "ₒ": "o", "ᵣ": "r", "ᵤ": "u", "ᵥ": "v", "ₓ": "x" };
            myValue = myValue.replace(/[^A-Za-z0-9\[\] ]/g, function (a) { return Latinise.latin_map[a] || a });
        }
        return myValue;
    }


    /**
     * @function
     *   setVariable: set a value in a variable
     *
     * @param {string} myName  Name of the variable.
     * @param {string} myValue Value of the variable.
     *
     */
    setVariable(myName, myValue) {


        // if the value is pure numeric, convert it into a string
        //console.log ('setVariable (' + myName + ', ' + myValue + ')');
        if (myValue == '<EMPTY>') {
            //this.myVariables[myName] = '';
            this.myVariables[myName] = '<EMPTY>';
            return '';
        } else {
            // Protect the initial quote
            if (typeof myValue == "string") myValue = myValue.replace(/'/g, "&apos;");
            myValue = this.evaluateVariable(myValue);
            if (typeof (myValue) == "string") {
                myValue = this.dataValue(myValue);  // Specific keywords  
                //myValue = this.getVariable(myValue);
            }

            // console.log ('------------------------------')        
            // console.log ('VARIABLE :', myValue)

            // if (typeof myValue == "string") {
            //     myValue = myValue.replace(/'/g, "");
            //     myValue = myValue.replace(/&apos;/g, "'");
            //     myValue = "'" + myValue + "'"
            // }
        }


        // check if the variable already exists
        for (var item in this.myVariables) {
            if (item == myName) {
                this.myVariables[item] = myValue;
                myValue = this.latinize(myValue);
                return myValue;
            }
        }
        if (!isNaN(myValue)) myValue = myValue * 1

        // console.log ('------------------------------')        
        //  console.log ('VARIABLE :', myValue)
        //  console.log ('------------------------------')              

        //console.log ('setVariable store into the variable: ' + myName + ' = '  + myValue);
        this.myVariables[myName] = myValue;
        return myValue;
    }


    /**
     * @function
     *   copyVariable: Copy a varible into another one
     *
     * @param {string} myVariable  Name of the variable to get the value to copy.
     * @param {string} myCopy      Name of the variable to use as a copy.
     *
     */
    copyVariable(myVariable, myCopy) {

        let myValue = this.getVariable(myVariable);
        // remove the ' from the value
        if (myValue.length > 0) {
            myValue = myValue.replace(/'/g, "");
        }
        this.setVariable(myCopy, myValue);
        return myValue;
    }

    /**
     * @function
     *   listVariable: display all variables: structure is name: value (type))
     *
     */
    listVariable() {

        console.log("\n-- Variables: -----------------------");
        for (var item in this.myVariables) {
            //console.log(item + ": " + this.myVariables[item] + " (" + typeof(this.myVariables[item])+")");
            // check if it's a numeric value
            if (isNaN(this.myVariables[item] * 1)) {
                // Variable is a string
                console.log(item + ": " + this.myVariables[item] + " (" + typeof (this.myVariables[item]) + ")");
            }
            else { // Variable is a number
                console.log(item + ": " + this.myVariables[item] * 1 + " (" + typeof (this.myVariables[item] * 1) + ")");
            }
        }
        console.log("-------------------------------------");
    }

    /**
     * @function
     *   cleanVariable: delete all variables from memory
     *
     *
     */
    cleanVariable() {
        for (var item in this.myVariables) {
            delete this.myVariables[item];
        }
        return "OK";
    }


    /**
     * @function
     * 
     *   evaluateVariable: transpose all the variables by their values in an expression
     *   NEW: Improve algorithm, not necessary to enclose the variable name with spaces
     * 
     *   Some special variables - case sensitive: $TODAY (today date DD/MM/YYY), $YEAR (current year), $MONTH (current month), $DAY (current day number)
     * 
     * @param {string} myExpr expression to transpose.
     *
     */
    evaluateVariable(myExpr) {

        //console.log('*** EvaluateVariable: ' + myExpr + ' type: ' + typeof (myExpr));


        const { Left } = require("./string.library.js");

        let result = '';
        let myVar = '';
        let myVal = '';
        let i = 0;

        if (myExpr == undefined) {
            {
                this.displayLog(1, 3, 'evaluateVariable: expression is empty!')
                return ''
            }
        }


        if (typeof (myExpr) == 'object') {
            this.displayLog(1, 3, 'evaluateVariable: expression is an object!')
            return 'ERROR'
        }


        //console.log('evaluateVariable: ' + myExpr + ' type: ' + typeof (myExpr));

        //if the expression is a numeric value, return the expression (nothing to evaluate)
        if (!isNaN(myExpr)) {
            if (Left(myExpr, 2) != '00') {
                return (myExpr);
            } else {
                return ("'" + myExpr + "'");
            }
        }

        if (myExpr == undefined || myExpr.length == 0 || myExpr == NaN) {
            return '';
        }

        // console.log('EvaluateVariable - myExpr: ', myExpr)

        // Replace single quote by &apos; 
        if (typeof (myExpr) == "string") myExpr = myExpr.replace(/'/g, "&apos;");
        if (typeof (myExpr) == "string") myExpr = myExpr.replace(/\n/g, "<br>");

        for (let elt in myExpr) {
            result = result + myExpr[elt];
            if (myExpr[elt] == '$') {
                // a new variable is detected
                if (myVar != '') {
                    myVal = this.variableValue(myVar);
                    //myVal = this.dataValue(myVar);
                    if (myVal == "<N/A>") {
                        this.myMessage = "ERROR evaluateVariable: " + myVar + " is not defined!";
                        return this.myMessage; //myVal;
                    }
                    // // remove the first and the last character if it's a quote -- PGO 21/08/2024
                    // if (typeof (myVal) == "string") {
                    //     if (myVal[0] == "'") {
                    //         myVal = myVal.substring(1, myVal.length)
                    //     }
                    //     if (myVal.substring(myVal.length, myVal.length - 1) == "'") {
                    //         myVal = myVal.substring(0, myVal.length - 1)
                    //     } // <-- PGO 21/08/2024    
                    //}
                    result = result.replace(myVar, myVal);
                }
                myVar = '$';
            } else if (myExpr[elt].match(/^[a-z0-9]+$/i)) {
                if (myVar != '') {
                    // complete the name of the variable
                    myVar = myVar + myExpr[elt];
                }
            } else {
                // a non alphanumeric char detected
                if (myVar != '') {
                    // process previous variable
                    myVal = this.variableValue(myVar);
                    //myVal = this.dataValue(myVar);
                    if (myVal == "<N/A>") {
                        this.myMessage = "ERROR evaluateVariable: " + myVar + " is not defined!";
                        return this.myMessage;
                    }
                    //console.log('Process end of the Variable name: ' + myVar);
                    // // remove the first and the last character if it's a quote -- PGO 21/08/2024
                    // if (typeof (myVal) == "string") {
                    //     if (myVal[0] == "'") {
                    //         myVal = myVal.substring(1, myVal.length)
                    //     }
                    //     if (myVal.substring(myVal.length, myVal.length - 1) == "'") {
                    //         myVal = myVal.substring(0, myVal.length - 1)
                    //     } // <-- PGO 21/08/2024    
                    // }
                    result = result.replace(myVar, myVal);
                    myVar = '';
                }
            }
        }
        // Process the last variable (if any)
        if (myVar != '') {
            // process previous variable
            myVal = this.variableValue(myVar);
            //myVal = this.dataValue(myVar);
            if (myVal == "<N/A>") {
                this.myMessage = "ERROR evaluateVariable: " + myVar + " is not defined!";
                return this.myMessage;
            }
            //console.log('Process last Variable name: ' + myVar);
            result = result.replace(myVar, myVal);
        }
        // Replace the sign § by $ - PGO 13/04/2022
        result = result.replace(/§/g, "$");

        // remove the quotes - for the $GUI value
        if (myExpr == "$GUI") {
            result = result.slice(1, -1)
        }

        result = result.replace(/&apos;/g, "'");
        //console.log ('EvaluateVariable: ', result)


        return result;
    }


    /**
     * @function
     * 
     *   evaluateVariableForRule: transpose all the variables by their values in an expression by protecting the quotes inside the variables
     *   NEW: Improve algorithm, not necessary to enclose the variable name with spaces
     * 
     *   Some special variables - case sensitive: $TODAY (today date DD/MM/YYY), $YEAR (current year), $MONTH (current month), $DAY (current day number)
     * 
     * @param {string} myExpr expression to transpose.
     *
     */
    evaluateVariableForRule(myExpr) {

        console.log('*** evaluateVariableForRule: ' + myExpr + ' type: ' + typeof (myExpr));


        const { Left } = require("./string.library.js");

        let result = '';
        let myVar = '';
        let myVal = '';
        let i = 0;

        if (myExpr == undefined) {
            {
                this.displayLog(1, 3, 'evaluateVariableForRule: expression is empty!')
                return ''
            }
        }


        if (typeof (myExpr) == 'object') {
            this.displayLog(1, 3, 'evaluateVariableForRule: expression is an object!')
            return 'ERROR'
        }


        //console.log('evaluateVariableForRule: ' + myExpr + ' type: ' + typeof (myExpr));

        //if the expression is a numeric value, return the expression (nothing to evaluate)
        if (!isNaN(myExpr)) {
            if (Left(myExpr, 2) != '00') {
                return (myExpr);
            } else {
                return ("'" + myExpr + "'");
            }
        }

        if (myExpr == undefined || myExpr.length == 0 || myExpr == NaN) {
            return '';
        }

        // console.log('evaluateVariableForRule - myExpr: ', myExpr)

        // Replace single quote by &apos; 
        //myExpr = myExpr.replace(/'/g, "&apos;");

        for (let elt in myExpr) {
            result = result + myExpr[elt];
            if (myExpr[elt] == '$') {
                // a new variable is detected
                if (myVar != '') {
                    myVal = this.variableValue(myVar);
                    //myVal = this.dataValue(myVar);
                    if (myVal == "<N/A>") {
                        this.myMessage = "ERROR evaluateVariableForRule: " + myVar + " is not defined!";
                        return this.myMessage; //myVal;
                    }
                    result = result.replace(myVar, myVal);
                }
                myVar = '$';
            } else if (myExpr[elt].match(/^[a-z0-9]+$/i)) {
                if (myVar != '') {
                    // complete the name of the variable
                    myVar = myVar + myExpr[elt];
                }
            } else {
                // a non alphanumeric char detected
                if (myVar != '') {
                    // process previous variable
                    myVal = this.variableValue(myVar);
                    //myVal = this.dataValue(myVar);
                    if (myVal == "<N/A>") {
                        this.myMessage = "ERROR evaluateVariableForRule: " + myVar + " is not defined!";
                        return this.myMessage;
                    }
                    //console.log('Process end of the Variable name: ' + myVar);
                    if (typeof (myVal) == "string") {
                        myVal = myVal.slice(1, -1) // PGO 16/05/2024
                        myVal = myVal.replace(/'/g, "&apos;"); // PGO 16/05/2024
                        myVal = "'" + myVal + "'" // PGO 16/05/2024        
                    }
                    result = result.replace(myVar, myVal);
                    myVar = '';
                }
            }
        }
        // Process the last variable (if any)
        if (myVar != '') {
            // process previous variable
            myVal = this.variableValue(myVar);
            //myVal = this.dataValue(myVar);
            if (myVal == "<N/A>") {
                this.myMessage = "ERROR evaluateVariableForRule: " + myVar + " is not defined!";
                return this.myMessage;
            }
            //console.log('Process last Variable name: ' + myVar);
            if (typeof (myVal) == "string") {
                myVal = myVal.slice(1, -1) // PGO 05/07/2024
                myVal = myVal.replace(/'/g, "&apos;"); // PGO 16/05/2024
            }
            myVal = "'" + myVal + "'" // PGO 16/05/2024
            result = result.replace(myVar, myVal);
        }
        // Replace the sign § by $ - PGO 13/04/2022
        result = result.replace(/§/g, "$");

        // remove the quotes - for the $GUI value
        if (myExpr == "$GUI") {
            result = result.slice(1, -1)
        }

        //result = result.replace(/&apos;/g, "'");
        console.log('@@@@@@@@@@@@@@ Result: ', result)


        return result;
    }


    /**
     * @function
     * 
     *   variableValue: Extract the value of a variable name
     * 
     *   Some special variables - case sensitive: $TODAY (today date DD/MM/YYY), $YEAR (current year), $MONTH (current month), $DAY (current day number)
     * 
     * @param {string} myVar expression to transpose.
     *
     */
    variableValue(myVar) {

        let myVal = '';
        let myArray

        switch (myVar) {
            case '<NOW>': // today date
                myVal = this.moment(new Date()).format('DD/MM/YYYY HH:mm');
                break;

            case '<TODAY>': // today date
                myVal = this.moment(new Date()).format('DD/MM/YYYY');
                break;
            case '<YEAR>': // Current year 
                myVal = this.moment(new Date()).format('YYYY');
                break;
            case '<MONTH>': // Current month
                myVal = this.moment(new Date()).format('MM');
                break;
            case '<DAY>': // Current day
                myVal = this.moment(new Date()).format('DD');
                break;
            case '<HOUR>': // Current Hour
                myVal = this.moment(new Date()).format('HH');
                break;
            case '<MINUTE>': // Current Minute
                myVal = this.moment(new Date()).format('mm');
                break;
            default:
                myVal = this.getVariable(myVar);
                break;
        }
        //console.log('************************** variableValue: ' + myVal);
        return myVal;
    }


    /**
     * @function
     * 
     *   dataValue: Evaluate the data of the dataset
     * 
     *   Some special variables - case sensitive: TODAY (today date DD/MM/YYY), YEAR (current year), MONTH (current month), DAY (current day number)
     * 
     * @param {string} myVar expression to transpose.
     *
     */
    dataValue(myVar) {

        let myVal = '';
        let myArray
        let i = 0
        let j = 0

        if (myVar.indexOf('<SEQUENCE>', 0) >= 0) {
            myVal = this.moment(new Date()).format('YYYYMMDD_x');
            this.setVariable('$Sequence', myVal);
            myVal = myVar.replace('<SEQUENCE>', myVal)
            myVar = myVal
        }

        if (myVar.indexOf('<NOW+', 0) >= 0) {
            let myVar2 = myVar.substring(0, myVar.length - 1);
            myArray = myVar2.split("+");
            if (myArray[1] != undefined) {
                myVal = this.moment(new Date()).add(myArray[1], 'd').format('DD/MM/YYYY HH:mm');
                i = myVar.indexOf('<NOW+', 0);
                j = myVar.indexOf('>', i + 1);
                let myFaker = myVar.substring(i, j + 1);
                myVal = myVar.replace(myFaker, myVal);
            }
        } else if (myVar.indexOf('<NOW-', 0) >= 0) {
            let myVar2 = myVar.substring(0, myVar.length - 1);
            myArray = myVar2.split("-");
            if (myArray[1] != undefined) {
                myVal = this.moment(new Date()).subtract(myArray[1], 'd').format('DD/MM/YYYY HH:mm');
                i = myVar.indexOf('<NOW-', 0);
                j = myVar.indexOf('>', i + 1);
                let myFaker = myVar.substring(i, j + 1);
                myVal = myVar.replace(myFaker, myVal);
            }
        } else if (myVar.indexOf('<NOW>', 0) >= 0) {
            myVal = this.moment(new Date()).format('DD/MM/YYYY HH:mm');
            myVal = myVar.replace('<NOW>', myVal)
        } else if (myVar.indexOf('<TODAY+', 0) >= 0) {
            let myVar2 = myVar.substring(0, myVar.length - 1);
            myArray = myVar2.split("+");
            if (myArray[1] != undefined) {
                myVal = this.moment(new Date()).add(myArray[1], 'd').format('DD/MM/YYYY');
                i = myVar.indexOf('<TODAY+', 0);
                j = myVar.indexOf('>', i + 1);
                let myFaker = myVar.substring(i, j + 1);
                myVal = myVar.replace(myFaker, myVal);
            }
        } else if (myVar.indexOf('<TODAY-', 0) >= 0) {
            let myVar2 = myVar.substring(0, myVar.length - 1);
            myArray = myVar2.split("-");
            if (myArray[1] != undefined) {
                myVal = this.moment(new Date()).subtract(myArray[1], 'd').format('DD/MM/YYYY');
                i = myVar.indexOf('<TODAY-', 0);
                j = myVar.indexOf('>', i + 1);
                let myFaker = myVar.substring(i, j + 1);
                myVal = myVar.replace(myFaker, myVal);
            }
        } else if (myVar.indexOf('<TODAY>', 0) >= 0) {
            myVal = this.moment(new Date()).format('DD/MM/YYYY');
            myVal = myVar.replace('<TODAY>', myVal)
        } else if (myVar.indexOf('<YEAR+', 0) >= 0) {
            let myVar2 = myVar.substring(0, myVar.length - 1);
            myArray = myVar2.split("+");
            if (myArray[1] != undefined) {
                myVal = this.moment(new Date()).add(myArray[1], 'y').format('YYYY');
                i = myVar.indexOf('<YEAR+', 0);
                j = myVar.indexOf('>', i + 1);
                let myFaker = myVar.substring(i, j + 1);
                myVal = myVar.replace(myFaker, myVal);
            }
        } else if (myVar.indexOf('<YEAR-', 0) >= 0) {
            let myVar2 = myVar.substring(0, myVar.length - 1);
            myArray = myVar2.split("-");
            if (myArray[1] != undefined) {
                myVal = this.moment(new Date()).subtract(myArray[1], 'y').format('YYYY');
                i = myVar.indexOf('<YEAR-', 0);
                j = myVar.indexOf('>', i + 1);
                let myFaker = myVar.substring(i, j + 1);
                myVal = myVar.replace(myFaker, myVal);
            }
        } else if (myVar.indexOf('<YEAR>', 0) >= 0) {
            myVal = this.moment(new Date()).format('YYYY');
            myVal = myVar.replace('<YEAR>', myVal)
        } else if (myVar.indexOf('<MONTH+', 0) >= 0) {
            let myVar2 = myVar.substring(0, myVar.length - 1);
            myArray = myVar2.split("+");
            if (myArray[1] != undefined) {
                myVal = this.moment(new Date()).add(myArray[1], 'm').format('MM');
                i = myVar.indexOf('<MONTH+', 0);
                j = myVar.indexOf('>', i + 1);
                let myFaker = myVar.substring(i, j + 1);
                myVal = myVar.replace(myFaker, myVal);
            }
        } else if (myVar.indexOf('<MONTH-', 0) >= 0) {
            let myVar2 = myVar.substring(0, myVar.length - 1);
            myArray = myVar2.split("-");
            if (myArray[1] != undefined) {
                myVal = this.moment(new Date()).subtract(myArray[1], 'm').format('MM');
                i = myVar.indexOf('<MONTH-', 0);
                j = myVar.indexOf('>', i + 1);
                let myFaker = myVar.substring(i, j + 1);
                myVal = myVar.replace(myFaker, myVal);
            }
        } else if (myVar.indexOf('<MONTH>', 0) >= 0) {
            myVal = this.moment(new Date()).format('MM');
            myVal = myVar.replace('<MONTH>', myVal)
        } else if (myVar.indexOf('<DAY+', 0) >= 0) {
            let myVar2 = myVar.substring(0, myVar.length - 1);
            myArray = myVar2.split("+");
            if (myArray[1] != undefined) {
                myVal = this.moment(new Date()).add(myArray[1], 'd').format('DD');
                i = myVar.indexOf('<DAY+', 0);
                j = myVar.indexOf('>', i + 1);
                let myFaker = myVar.substring(i, j + 1);
                myVal = myVar.replace(myFaker, myVal);
            }
        } else if (myVar.indexOf('<DAY-', 0) >= 0) {
            let myVar2 = myVar.substring(0, myVar.length - 1);
            myArray = myVar2.split("-");
            if (myArray[1] != undefined) {
                myVal = this.moment(new Date()).subtract(myArray[1], 'd').format('DD');
                i = myVar.indexOf('<DAY-', 0);
                j = myVar.indexOf('>', i + 1);
                let myFaker = myVar.substring(i, j + 1);
                myVal = myVar.replace(myFaker, myVal);
            }
        } else if (myVar.indexOf('<DAY>', 0) >= 0) {
            myVal = this.moment(new Date()).format('DD');
            myVal = myVar.replace('<DAY>', myVal)
        } else if (myVar.indexOf('<HOUR+', 0) >= 0) {
            let myVar2 = myVar.substring(0, myVar.length - 1);
            myArray = myVar2.split("+");
            if (myArray[1] != undefined) {
                myVal = this.moment(new Date()).add(myArray[1], 'hours').format('HH');
                i = myVar.indexOf('<HOUR+', 0);
                j = myVar.indexOf('>', i + 1);
                let myFaker = myVar.substring(i, j + 1);
                myVal = myVar.replace(myFaker, myVal);
            }
        } else if (myVar.indexOf('<HOUR-', 0) >= 0) {
            let myVar2 = myVar.substring(0, myVar.length - 1);
            myArray = myVar2.split("-");
            if (myArray[1] != undefined) {
                myVal = this.moment(new Date()).subtract(myArray[1], 'hours').format('HH');
                i = myVar.indexOf('<HOUR-', 0);
                j = myVar.indexOf('>', i + 1);
                let myFaker = myVar.substring(i, j + 1);
                myVal = myVar.replace(myFaker, myVal);
            }
        } else if (myVar.indexOf('<HOUR>', 0) >= 0) {
            myVal = this.moment(new Date()).format('HH');
            myVal = myVar.replace('<HOUR>', myVal)
        }
        else {
            myVal = myVar;
        }

        //console.log('************************** dataValue: ' + myVal);
        return myVal;
    }



    /**
     * @function
     *  displayMsg: display a message on the console with a frame
     *
     * @param {string} myMessage Display a message on the console.
     *
     */
    displayMsg(myMessage) {

        myMessage = this.evaluateVariable(myMessage);
        myMessage = myMessage.replace(/'/g, '');
        myMessage = myMessage.replace(/<BR>/g, "\n");
        myMessage = myMessage.replace(/&quot/g, '"');

        let i = Math.max(myMessage.length, 170);
        for (var word = ''; word.length < i + 4; word += '-') { }
        console.log(">    " + word);

        var myText = myMessage.split('\n');
        for (var elt in myText) {
            console.log(">    - " + myText[elt]);
        }
        console.log(">    " + word);
    }

    /**
     * @function
     *  startTime: Store the time of the call
     *
     */
    startTime() {
        this.startingTime = new Date().getTime();
        return this.startingTime;
    }

    /**
     * @function
     *  endTime: Store the elspased time since the last startTime()
     *
     */
    endTime(myVariable) {
        let endTime = new Date().getTime();
        let elapsedTime = (endTime - this.startingTime) / 1000;
        let expr = 'ElapsedTime = ' + elapsedTime + ' sec.';
        this.displayMsg(expr);
        if (myVariable != undefined) {
            this.setVariable(myVariable, elapsedTime);
        }
        return elapsedTime;
    }


    /**
     * @function
     *  userTime: Store the time defined by instruction in the test
     *
     */
    userTime() {
        let userTime = new Date().getTime();
        return userTime;
    }


    /**
     * @function
     *  debug: set the verbose to define the level of debug messages
     *
     * @param {string} myVerbose 0: Normal, 1: Full debug
     *
     */
    debug(myVerbose) {
        this.verbose = myVerbose;
    }



    /**
     * ---------------------------------------------------------------------------- 
     * @function
     *  displayLog: display a message in the console of the server 
     * 
     * @param {number} myVerbose:   Level of detail (from 0 to 2)
     * @param {number} myLevel:     Level of indentation (from 1 to ...)
     * @param {string} myMessage:   Message to display
     * @param {string} myData1:     [Optional] Data to display (usefull for a table)
     * @param {string} myData2:     [Optional] Data to display (usefull for a table)
     * 
     */
    displayLog(myVerbose, myLevel, myMessage, myData1, myData2) {

        if (myData1 == undefined) myData1 = ''
        if (myData2 == undefined) myData2 = ''

        if (this.verbose < myVerbose) return 0;
        if (myLevel == 0) {
            console.log("> " + myMessage, myData1, myData2);
        } else if (myLevel == 1) {
            console.log(">--> " + myMessage, myData1, myData2);
        } else {
            let msg = ">--> ";
            for (let myId = 0; myId < myLevel - 1; myId++) {
                msg = msg + "-=-";
            }
            msg = msg + ">> ";
            console.log(msg + myMessage, myData1, myData2);
        }

        return 1;
    };



}  // end class
module.exports = Variables;
