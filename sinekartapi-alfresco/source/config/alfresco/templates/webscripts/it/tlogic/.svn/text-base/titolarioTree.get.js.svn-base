<import resource="classpath:alfresco/extension/scripts/utils.js">

var getTitolarioTree = function(ramoPrecDescr, treeList) {
	
	var lista = [];
	for (var index=0; index < treeList.size(); index++) {
		var tree = treeList.get(index);
		var descr = ramoPrecDescr + " - " + tree.getId() + "(" +tree.getDescr() +")";  
		var ramo = {"id": tree.getId(), 
						"name": tree.getName(), 
						"voce": tree.getDescr(), 
						"descrizione": descr, 
						"tree": getTitolarioTree(descr, tree.getChild())};
		lista.push(ramo);
	};
	return lista;
	
};

var main = function ()
{
	
	var aoo = url.templateArgs.aoo;
	var manager = Packages.it.tlogic.sinekartapi.protocolloManager.ProtocolManager;
	var titolarioObject = manager.getTitolario(aoo);
	
	var titolario = {"id": titolarioObject.getId(), "name": titolarioObject.getName(), 
			"descrizione": titolarioObject.getDescr(), "tree": getTitolarioTree("", titolarioObject.getTitolarioTree())};
	
	
	
	
//	var titolari = [];
//	var separator = '|';
//	for eche();
//	
//	for(var i=0; i<titolarioList.size(); i++) {
//	  titolari.push(titolarioList.get(i));
//	}
	
	//var titolarioString = titolari.join(separator);
	
	return jsonUtils.toJSONString({ titolari: titolario });
	
	
}

model.json = main();