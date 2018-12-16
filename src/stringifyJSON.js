// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

var stringifyJSON = function(obj) {
    // JSON doesn't stringify functions or undefined values
    // skip key/value pairs with function in them
    // check first for null / undefined / etc and return
    if (obj === null) {
        return 'null';
    } else if (obj === undefined) {
        return undefined;
    } else if (typeof obj === 'number') {
        return obj.toString();
    } else if (typeof obj === 'string') {
        return `"${obj}"`;
    } else if (typeof obj === 'boolean') {
        return obj.toString();
    }

    var myJSON = "";
    if (Array.isArray(obj)) {
        if (obj.length === 0) {
            return "[]";
        } else {
            myJSON += '[';

            if (obj.length === 1) {
                myJSON += stringifyJSON(obj[0]);
            } else {
                for (var i = 0; i < obj.length; i++) {
                    if (i !== obj.length - 1) {
                        myJSON += stringifyJSON(obj[i]) + ',';
                    } else {
                        myJSON += stringifyJSON(obj[i]);
                    }
                }
            }
        }
        return myJSON + "]";
    } else {
        myJSON += '{';
        // iterate through all the properties of the object
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                // check to see if this property is a string, number, etc
                if (typeof obj[p] === 'string') {
                    myJSON += `"${p}"` + ':' + `"${obj[p]}"` + ','; // the JSON representation of this value using p and obj[p]
                } else if (typeof obj[p] === null) {
                    myJSON += `"${p}"` + ':' + 'null' + ',';
                } else if (typeof obj[p] === 'number' || obj[p] === undefined || typeof obj[p] === 'boolean') {
                    myJSON += `"${p}"` + ':' + obj[p] + ','; // the JSON representation of this value using p and obj[p]
                } else if (typeof obj[p] === 'object' && !Array.isArray(obj[p])) { // test for nested object) {

                    if (obj[p] !== undefined) {
                        myJSON += `"${p}"` + ':' + stringifyJSON(obj[p]) + ',';
                    }
                } else if (Array.isArray(obj[p])) {
                    myJSON += `"${p}"` + ':' + '[';
                    var array = obj[p];
                    for (var i = 0; i < array.length; i++) {
                        if (i === array.length - 1) {
                            myJSON += stringifyJSON(array[i]);
                        } else {
                            myJSON += stringifyJSON(array[i]) + ',';
                        }
                    };
                    myJSON += ']' + ',';
                }
                // note: functions should be ignored, they aren't included in JSON
            }
        }
        if (myJSON[myJSON.length - 1] == ',') {
            myJSON = myJSON.substring(0, myJSON.length - 1);
        }
        return myJSON += "}";
    }
}