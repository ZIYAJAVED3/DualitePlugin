// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// Runs this code if the plugin is run in Figma
if (figma.editorType === 'figma') {
    figma.showUI(__html__);
    figma.ui.resize(942, 540)
    figma.on("selectionchange",()=>{
      console.log("data", figma.currentPage.selection)
      if(figma.currentPage.selection.length)
      figma.ui.postMessage(nodeToObject(figma.currentPage.selection[0]))
    })
   
   
  }
  
  const nodeToObject = (node) => {
  	const props = Object.entries(Object.getOwnPropertyDescriptors(node.__proto__));
  	const blacklist = ['parent', 'children', 'removed'];
  	let obj = { id: node.id, type: node.type, children: undefined };
  	if (node.parent) obj.parent = { id: node.parent.id, type: node.type };
  	for (const [name, prop] of props) {
  		if (prop.get && blacklist.indexOf(name) < 0) {
  			obj[name] = prop.get.call(node);
  			if (typeof obj[name] === 'symbol') obj[name] = 'Mixed';
  		}
  	}
  	if (node.children) obj.children = node.children.map((child) => nodeToObject(child));
  	if (node.masterComponent) obj.masterComponent = nodeToObject(node.masterComponent);
  	return obj;
  };