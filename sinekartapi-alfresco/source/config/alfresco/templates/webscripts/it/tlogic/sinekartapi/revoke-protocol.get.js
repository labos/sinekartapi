<import resource="classpath:/alfresco/extension/scripts/utils.js">

var nodeRef = "workspace://" + args.nodeRef.substring(args.nodeRef.search("SpacesStore/"));
var node = search.findNode(nodeRef);
var reason = args.reason; 
var result = revokeProtocol(node, reason);

model.json = jsonUtils.toJSONString(result);
