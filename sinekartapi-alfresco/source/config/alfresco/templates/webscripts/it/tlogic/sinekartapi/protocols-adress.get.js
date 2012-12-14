<import resource="classpath:alfresco/extension/scripts/utils.js">

// spampare indirizzo nodo

function main()
{
	var siteName = url.templateArgs.site;
	
	var site = siteService.getSite(siteName);
	if(!site) {
		return {nodeRef: "SITE ERROR"};
	}
	
	var rootProtocolli = site.node.childByNamePath("documentLibrary/Protocolli");
	var rootTempProtocol= site.node.childByNamePath("documentLibrary/_temp_protocol_");
	if(!rootProtocolli) {
		rootProtocolli = site.node.childByNamePath("documentLibrary").createFolder("Protocolli");
	}
	if(!rootTempProtocol) {
		rootTempProtocol = site.node.childByNamePath("documentLibrary").createFolder("_temp_protocol_");
	}
	var nodeId = rootProtocolli.id;
	return "workspace://SpacesStore/" + nodeId;
}

model.json = jsonUtils.toJSONString(main());