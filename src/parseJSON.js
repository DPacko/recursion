// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:

  // first attempt at bottom

  // this correct answer is found online @ https://github.com/douglascrockford/JSON-js/blob/master/json_parse.js
  // placed here for my reference / practice -
var parseJSON = (function () {

    var at;     // The index of the current character
    var ch;     // The current character
    var escapee = {
        "\"": "\"",
        "\\": "\\",
        "/": "/",
        b: "\b",
        f: "\f",
        n: "\n",
        r: "\r",
        t: "\t"
    };
    var text;
    var next = function (c) {

// If a c parameter is provided, verify that it matches the current character.

        if (c && c !== ch) {
            return undefined;
        }

// Get the next character. When there are no more characters,
// return the empty string.

        ch = text.charAt(at);
        at += 1;
        return ch;
    };

    var number = function () {

// Parse a number value.

        var value;
        var string = "";

        if (ch === "-") {
            string = "-";
            next("-");
        }
        while (ch >= "0" && ch <= "9") {
            string += ch;
            next();
        }
        if (ch === ".") {
            string += ".";
            while (next() && ch >= "0" && ch <= "9") {
                string += ch;
            }
        }
        if (ch === "e" || ch === "E") {
            string += ch;
            next();
            if (ch === "-" || ch === "+") {
                string += ch;
                next();
            }
            while (ch >= "0" && ch <= "9") {
                string += ch;
                next();
            }
        }
        value = +string;
        if (!isFinite(value)) {
            return undefined;
        } else {
            return value;
        }
    };

    var string = function () {

// Parse a string value.

        var i;
        var value = "";

// When parsing for string values, we must look for " and \ characters.

        if (ch === "\"") {
            while (next()) {
                if (ch === "\"") {
                    next();
                    return value;
                }
                if (ch === "\\") {
                    next();
                  if (typeof escapee[ch] === "string") {
                        value += escapee[ch];
                    } else {
                        break;
                    }
                } else {
                    value += ch;
                }
            }
        }
        return undefined;
    };

    var skipWhitespace = function () {

// Skip whitespace.

        while (ch && ch <= " ") {
            next();
        }
    };

    var word = function () {

// true, false, or null.

        switch (ch) {
        case "t":
            next("t");
            next("r");
            next("u");
            next("e");
            return true;
        case "f":
            next("f");
            next("a");
            next("l");
            next("s");
            next("e");
            return false;
        case "n":
            next("n");
            next("u");
            next("l");
            next("l");
            return null;
        }
        return undefined;
    };

    var value;  // Place holder for the value function.

    var array = function () {

// Parse an array value.

        var arr = [];

        if (ch === "[") {
            next("[");
            skipWhitespace();
            if (ch === "]") {
                next("]");
                return arr;   // empty array
            }
            while (ch) {
                arr.push(value());
                skipWhitespace();
                if (ch === "]") {
                    next("]");
                    return arr;
                }
                next(",");
                skipWhitespace();
            }
        }
        return undefined;
    };

    var object = function () {

// Parse an object value.

        var key;
        var obj = {};

        if (ch === "{") {
            next("{");
            skipWhitespace();
            if (ch === "}") {
                next("}");
                return obj;   // empty object
            }
            while (ch) {
                key = string();
                skipWhitespace();
                next(":");
                if (Object.hasOwnProperty.call(obj, key)) {
                    return undefined;
                }
                obj[key] = value();
                skipWhitespace();
                if (ch === "}") {
                    next("}");
                    return obj;
                }
                next(",");
                skipWhitespace();
            }
        }
        return undefined;
    };

    value = function () {

// Parse a JSON value. It could be an object, an array, a string, a number,
// or a word.

        skipWhitespace();
        switch (ch) {
        case "{":
            return object();
        case "[":
            return array();
        case "\"":
            return string();
        case "-":
            return number();
        default:
            return (ch >= "0" && ch <= "9")
                ? number()
                : word();
        }
    };

// Return the json_parse function. It will have access to all of the above
// functions and variables.

    return function (source, reviver) {
        var result;

        text = source;
        at = 0;
        ch = " ";
        result = value();
        skipWhitespace();
        if (ch) {
            return undefined;
        }

// If there is a reviver function, we recursively walk the new structure,
// passing each name/value pair to the reviver function for possible
// transformation, starting with a temporary root object that holds the result
// in an empty key. If there is not a reviver function, we simply return the
// result.

        return (typeof reviver === "function")
            ? (function goThrough(holder, key) {
                var k;
                var v;
                var val = holder[key];
                if (val && typeof val === "object") {
                    for (k in val) {
                        if (Object.prototype.hasOwnProperty.call(val, k)) {
                            v = goThrough(val, k);
                            if (v !== undefined) {
                                val[k] = v;
                            } else {
                                delete val[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, val);
            }({"": result}, ""))
            : result;
    };
}());

// first try:

  // find out what the top-level value is that contains the rest of the input, work from within it and eventually return it
  // create a function for each grammar section (obj, array,string, boolean)

// var parseJSON = function(json) {
// // check for boolean statements
//   var output;
//   if(json.indexOf('function') !== -1 || json.indexOf('\\') !== -1){
// //       throw SyntaxError("Unexpected token u in JSON at position 1");
//     return undefined;
//     // throw new SyntaxError('Unexpected end of input');
//   }
//   if(json[0] === '['){
//     if(json[1] === ']'){
//       return [];
//     }
//     return returnsArray(json);
//   } else if(json[0] === '{'){
//     if(json[1] === '}'){
//       return {};
//     }
//     return returnObjects(json);
//   } else if(json[0] === '"') {
//     json = json.slice(1, json.length - 1);
//     return json;
//   } else if(json[0] === 't' || json[0] === 'f'){
//     return returnsBoolean(json);
//   } else if(Number(json[0])) {
//     return returnsNumber(json);
//   }
// }

// function returnsArray(json) {
//     json = json.slice(1, json.length - 1);
//     if(json.indexOf(', ') !== -1){
//       json = json.split(', ');
//     } else if(json.indexOf(',')) {
//       json = json.split(',');
//     }
//     var output = [];
//     for(var i = 0; i < json.length; i++){
//       if(Number(json[i])){
//         output.push(returnsNumber(json[i]));
//       } else if(json[i] === 'true' || json[i] === 'false') {
//         output.push(returnsBoolean(json[i]));
//       } else if(json[i][0] === '"') {
//         output.push(json[i].slice(1, json[i].length - 1));
//       } else if(json[i][0] === '{') {
//         output.push(returnObjects(json[i]));
//       }
//     }
//     return output;
//   }

// function returnObjects(json){
//   json = json.slice(1, json.length - 1);
//   var nextElementIndex;
//   if(json.indexOf(', ') !== -1){
//       nextElementIndex = json.indexOf(', ');
// //       json = json.split(', ');
//     } else if(json.indexOf(',') !== -1) {
//       nextElementIndex = json.indexOf(',');
// //       json = json.split(',');
//     }
//   var output = {};
//   if(json[0] === '"'){
//    var keyString = returnString(json);
//   }
//   json = json.substring((keyString.length) + 4);

//   if(json[0] === '{'){
//     output[keyString] = returnObjects(json);
//   } else if(json[0] === '['){
//     output[keyString] = returnsArray(json);
//   } else if(json[0] === '"'){
//     var string = returnString(json);
//     output[keyString] = string;
//   }else if(Number(json[0] !== -1)){
//     output[keyString] = returnsNumber(json);
//   }
//   if(nextElementIndex > -1){
//     var index = json.indexOf(', ')
//     json = json.substring(index + 2);
//     json = json.split(': ');
//     output[parseJSON(json[0])] = parseJSON(json[1]);
//   }
//   return output;
// }

// function returnString(json){
//   var string = '';
//   let index = 0;
//   if(json[0] === '"'){
//    index = 1;
//    if(json[1] === '"'){
//     return '';
//    }
//     while(json[index] !== '"'){
//       string += json[index];
//       index += 1
//     };
//    return string;
//   } else {
//     return undefined;
//   }
// }

// function returnsNumber(json){
//   var validNumbers = '';
//   let i = 0;
//   if(json[0] === '[') {
//     i = 1;
//   }
//   do {
//     validNumbers += json[i];
//     i += 1;
//   } while(Number(json[i]));

//   return Number(validNumbers);
// }

// function returnsBoolean(json){
//   var boolean = '';
//   for(var i = 0; i < 4; i++){
//     boolean += json[i];
//   }
//   if(boolean === 'true'){
//     return true;
//   } else if(boolean === 'fals'){
//     return false;
//   }
// }