<#assign controlId = fieldHtmlId + "-cntrl">
<#assign labelId = fieldHtmlId + "-label">


<script type="text/javascript">//<![CDATA[

var onLabelTreeClicked = function(event) {

	var tree = new YAHOO.util.Element("${controlId}");
	var label = new YAHOO.util.Element("${labelId}");
	
	
	label.setStyle("display", "none");
	tree.setStyle("display", "block");
	
};

var onNodeTreeSelected = function(event) {

	var node = event.node;
	
	if(node.isLeaf) {

		var tree = new YAHOO.util.Element("${controlId}");
		var label = new YAHOO.util.Element("${labelId}");
		var fieldVal = new YAHOO.util.Element("${fieldHtmlId}");
		
		
		label.set("text", node.data.description);
		document.getElementById("${labelId}").innerHTML = node.data.description;
		
		fieldVal.set("value", node.data.description);
		
		tree.setStyle('display', 'none');
		label.setStyle('display', 'block');
		
	};
};


var populateTreeNodes = function(node, treeViewParentNode) {
	var isLeaf = false;
	
	
	
	if(node.tree == undefined || node.tree.length <= 0) {
		isLeaf = true;
	};
	
	var name = node.name;
	if(node.descrizione) {
		name += " " + node.descrizione;
		
	};
	
	
	var nodeObj = {
		label: name,
		isLeaf: isLeaf,
		description: node.descrizione
	};
	var tmpNode = new YAHOO.widget.MenuNode(nodeObj, treeViewParentNode);
	
	if (node.tree != undefined) {
		var child = node.tree;
		var num = node.tree.length;
		var i = 0;
		while (i < num) {
			populateTreeNodes(child[i], tmpNode);
			i = i + 1;
			
		}
		
		//for (var child in node.tree) {
		//	populateTreeNodes(child, tmpNode);
		//};
	}
};

var onSuccessTree = function(response) {
	
	var titolari = response.json.titolari;
	var tree = new YAHOO.widget.TreeView("${controlId}");
	var root = tree.getRoot();

	populateTreeNodes(titolari, root);

	tree.subscribe("clickEvent", onNodeTreeSelected);
	tree.render();
};


var onFailureTree = function(response) {
	alert("Impossibile aprire il titolario per l'area organizzativa specificata (" + response.titolari + ")");

};
var treeInit = function functiontreeInit() {
		
	Alfresco.util.Ajax.jsonRequest(
	{
		url: Alfresco.constants.PROXY_URI + "it/tlogic/titolario/" + "A01",
        method: "GET",
        successCallback:
        {
			fn: onSuccessTree,
            scope: this
        },
        failureCallback:
        {
			fn: onFailureTree,
			scope: this
		}
	});

	try {
		var label = new YAHOO.util.Element("${labelId}");
		YAHOO.util.Event.addListener("${labelId}", "click", onLabelTreeClicked); 
	} catch (e) {
		//-- alert(e);
	}
	
//	tree.setStyle('display', 'none');
//	label.setStyle('display', 'block');
		
};

YUIEvent.onContentReady("${controlId}", treeInit);

 
//]]></script>


<div  class="form-field">
	<label for="${fieldHtmlId}">${field.label?html}:<#if field.endpointMandatory!false || field.mandatory!false><span class="mandatory-indicator">${msg("form.required.fields.marker")}</span></#if></label>
	<input type="hidden" id="${fieldHtmlId}" name="${field.name}" value="${field.value?html}" />
	<a href="#" id="${labelId}" ></a>
	 <div id="${controlId}" style="width:300px !important; height:80px !important; overflow:auto; padding: 4px; border:1px solid #EEE; border-right: 0 solid;">&nbsp</div>
</div>


