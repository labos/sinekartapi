<import resource="classpath:alfresco/extension/scripts/utils.js">

// spampare indirizzo nodo

function main()
{
	//var rootProtocolli = siteService.getSite("protocollo");
	// recuperare nodeId
	//var rootProtocolli = siteService.getSite("protocollo").node.childByNamePath("documentLibrary/Protocolli");
	//var nodeId = getContainerProtocolli().id; //'workspace://SpacesStore/2b359208-f331-4c97-9991-9dbd4d9843d4';
	//return jsonUtils.toJSONString({nodeId: 'workspace://SpacesStore/' + nodeId});

/*
	var testClass = Packages.it.tlogic.sinekartapi.test.PropertyTest;
	var obj = new testClass();

	return jsonUtils.toJSONString({ result: obj.loadProperties("db.name") });
*/	
	
	var counter_type = Packages.it.tlogic.sinekartapi.counter.DBProtocolCounter;
	var counter = counter_type.getInstance();
	
	var protocolName = 'test';
	//var currentYear = (new Date().getFullYear()).toString();
	
	var protocolNumber = getNumeroProtocollo(protocolName);
//	var protocolNumber = counter.testConnection();
	
	//counter.propertiesTest();
	return jsonUtils.toJSONString({ protocol_number: protocolNumber });
	
}

model.json = main();