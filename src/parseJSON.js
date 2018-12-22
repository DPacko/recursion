// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
// check for boolean statements
  var output;
  if(json.indexOf('function') !== -1 || json.indexOf('\\') !== -1){
//       throw SyntaxError("Unexpected token u in JSON at position 1");
    return undefined;
  }
  if(json[0] === '['){
    if(json[1] === ']'){
      return [];
    }
    return returnsArray(json);
  } else if(json[0] === '{'){
    if(json[1] === '}'){
      return {};
    }
    return returnObjects(json);
  } else if(json[0] === '"') {
    json = json.slice(1, json.length - 1);
    return json;
  } else if(json[0] === 't' || json[0] === 'f'){
    return returnsBoolean(json);
  } else if(Number(json[0])) {
    return returnsNumber(json);
  }
}

function returnsArray(json) {
    json = json.slice(1, json.length - 1);
    if(json.indexOf(', ') !== -1){
      json = json.split(', ');
    } else if(json.indexOf(',')) {
      json = json.split(',');
    }
    var output = [];
    for(var i = 0; i < json.length; i++){
      if(Number(json[i])){
        output.push(returnsNumber(json[i]));
      } else if(json[i] === 'true' || json[i] === 'false') {
        output.push(returnsBoolean(json[i]));
      } else if(json[i][0] === '"') {
        output.push(json[i].slice(1, json[i].length - 1));
      } else if(json[i][0] === '{') {
        output.push(returnObjects(json[i]));
      }
    }
    return output;
  }

function returnObjects(json){
  json = json.slice(1, json.length - 1);
  var nextElementIndex;
  if(json.indexOf(', ') !== -1){
      nextElementIndex = json.indexOf(', ');
//       json = json.split(', ');
    } else if(json.indexOf(',') !== -1) {
      nextElementIndex = json.indexOf(',');
//       json = json.split(',');
    }
  var output = {};
  if(json[0] === '"'){
   var keyString = returnString(json);
  }
  json = json.substring((keyString.length) + 4);

  if(json[0] === '{'){
    output[keyString] = returnObjects(json);
  } else if(json[0] === '['){
    output[keyString] = returnsArray(json);
  } else if(json[0] === '"'){
    var string = returnString(json);
    output[keyString] = string;
  }else if(Number(json[0] !== -1)){
    output[keyString] = returnsNumber(json);
  }
  if(nextElementIndex > -1){
    var index = json.indexOf(', ')
    json = json.substring(index + 2);
    json = json.split(': ');
    output[parseJSON(json[0])] = parseJSON(json[1]);
  }
  return output;
}

function returnString(json){
  var string = '';
  let index = 0;
  if(json[0] === '"'){
   index = 1;
   if(json[1] === '"'){
    return '';
   }
    while(json[index] !== '"'){
      string += json[index];
      index += 1
    };
   return string;
  } else {
    return undefined;
  }
}

function returnsNumber(json){
  var validNumbers = '';
  let i = 0;
  if(json[0] === '[') {
    i = 1;
  }
  do {
    validNumbers += json[i];
    i += 1;
  } while(Number(json[i]));

  return Number(validNumbers);
}

function returnsBoolean(json){
  var boolean = '';
  for(var i = 0; i < 4; i++){
    boolean += json[i];
  }
  if(boolean === 'true'){
    return true;
  } else if(boolean === 'fals'){
    return false;
  }
}
  // find out what the top-level value is that contains the rest of the input, work from within it and eventually return it
  // create a function for each grammar section (obj, array,string, boolean)
//   if(json[0] === 'f') {
//     return -1;
//   } else if(json[0] === '{') {
//     // remove spaces
//     // json = json.replace(/\s/g, '');

//     for(var i = 1; i < json.length; i++){
//       if(json[i] !== ' ') {
//         if(json[i] == '"' || "'") {
//           endResult += getString(json, i);
//         } else if(json[i] == '[') {
//           endResult += getArray(json);
//         }
//       }
//     }
//     return { + endResult + };


//   }
// };

// function getString(json, index) {
//   // go until end of "
//   for(var i = index; i < json; i++) {
//     if()
//   }
// }

// create a 'next character' fn