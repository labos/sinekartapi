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
	if(!rootProtocolli) {
		rootProtocolli = site.node.childByNamePath("documentLibrary").createFolder("Protocolli");
	}
	
	var nodeId = rootProtocolli.id;
	return "workspace://SpacesStore/" + nodeId;
}

model.json = jsonUtils.toJSONString(main());