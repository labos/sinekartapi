<import resource="classpath:/alfresco/extension/scripts/utils.js">


var node = search.findNode(args.noderef);
var aoo = args.aoo;

var result = protocolDocument(node, aoo);

if(!result.success && node) {
	node.remove();
}

model.json = jsonUtils.toJSONString(result);
