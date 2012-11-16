<import resource="classpath:/alfresco/extension/scripts/utils.js">


var node = search.findNode(args.noderef);
var aoo = args.aoo;
var protocolFileNodeRef = args.uploadfile? args.uploadfile : "";

var result = protocolDocument(node, aoo, protocolFileNodeRef);

if(!result.success && node) {
	node.remove();
}

model.json = jsonUtils.toJSONString(result);
