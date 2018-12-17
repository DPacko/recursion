// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
    // returns an array of all elements at that class name
    // use document.body, element.childNodes, and element.classList

var getElementsByClassName = function(className, node){
  // create ending array
  var nodeArray = [];

  // set node depending on if it's first time setting it
  node = node || document.body;

  // If the node contains the specific class list, push it into the array
  if (node.classList && node.classList.contains(className)) {
    nodeArray.push(node);
  }

  var children = node.childNodes;

  // If child nodes exist, continue
  if (children) {
    // loop over all child nodes
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      // recurse the child node
      nodeArray = nodeArray.concat(getElementsByClassName(className, child));
    }
  }
  return nodeArray;
};