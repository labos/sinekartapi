<import resource="classpath:alfresco/extension/scripts/utils.js">

/**
 * ottiene la data dell'ultimo documento Registrazioni di Protocollo
 * @returns
 */

/*
function getDataUltimoDocumentoRegistrazioniProtocollo(){
	var query = '+ASPECT:"skpi:registrazioniProtocollo" ';
	var searchConstr = {
			query: query,
			sort: [
			   {
				  column: "skpi:dataRegistrazioni",
				  ascending: false
			   }
			],
			page: {
				maxItems: 1
			}
		}
	var res = search.luceneSearch(query),
		doc = res[0],
		date;
	
	if (doc){
		date = doc.properties["skpi:dataRegistrazioni"];
		date = new Date(Date.parse(date));
	} 
	return date;
}

*/

/**
 * Recupera i protocolli da registrare nei rispettivi documenti
 * e li inserisce in una struttura dati opportuna
 * @param dataInizio
 * @returns
 */
function getProtocolliDaRegistrare(dataInizio){	
	var yesterday,
		beginDateRange = "MIN",
		endDateRange;
	
	ieri = new Date();
	ieri.setDate(ieri.getDate() - 1);
	// DA TOGLIIRE PER  TEST -------------
	ieri.setDate(ieri.getDate() + 1);
	logger.log("ieri " + ieri);
	if (dataInizio){
		beginDateRange = toISO8601(dataInizio, "date");
	}
	logger.log("beginDateRange " + beginDateRange);
	endDateRange = toISO8601(ieri, "date");
	logger.log("endDateRange " + endDateRange);
	//beginDateRange = "MIN";
	//endDateRange = "MAX";
	
	var query = '+ASPECT:"skpi:protocollabile" -ASPECT:"skpi:registrato" '+
		'+@skpi\\:data_protocollazione:['+beginDateRange+' TO '+endDateRange+']';
	logger.log("query " + query);
	var searchConstr = {
		query: query,
		sort: [
		   {
			  column: "skpi:numero_protocollo",
			  ascending: true
		   }
		]		
	};
	var res = search.luceneSearch(query);
	
	var registrazioni = {},
		doc, date, day, month, year;
	
	for (var i=0; i<res.length; i++){
		doc = res[i];
		date = new Date( Date.parse(doc.properties["skpi:data_protocollazione"]) );
		day = date.getDate();
		month = date.getMonth();
		year = date.getFullYear();
		
		if (!registrazioni[year])
			registrazioni[year] = {};
		if (!registrazioni[year][month] )
			registrazioni[year][month] = {};
		if (!registrazioni[year][month][day] )
			registrazioni[year][month][day] = [];
		registrazioni[year][month][day].push(doc);
	}
		
	return registrazioni;
}


/**
 * Genera il pdf con JasperReport
 * @param xml datasource dei dati
 * @param fileName nome del file
 * @returns
 */
function generaPdf(xml, fileName){	


	try {
		var reportsFolderName = "Reports";
		
		var reports = siteService.getSite("protocollo").node.childByNamePath("documentLibrary/" + reportsFolderName);
		var protocolli = siteService.getSite("protocollo").node.childByNamePath("documentLibrary/Protocolli");
		if (!reports) {
			logger.log("AlfrescoJasperReports - Folder mancante creo " + reportsFolderName); 
			reports = companyhome.createFolder("documentLibrary/" + reportsFolderName);
		}
			
		//var ftl =  siteService.getSite("protocollo").node.childByNamePath("documentLibrary/Reports/datasource_itemsInDataDictionary.ftl");
		//var jrxml = companyhome.childByNamePath("protocollo/documentLibrary/" + reportsFolderName + "/reportRegistroProtocollo.jrxml");
		logger.log("AlfrescoJasperReports -  carico report template"); 
		var jrxml =  siteService.getSite("protocollo").node.childByNamePath("documentLibrary/" + reportsFolderName + "/reportRegistroProtocollo.jrxml");
		
		//var jrxml = "/alfresco/templates/webscripts/it/tlogic/sinekartapi/report_itemsInDataDictionary.jrxml" 
		
		
		
		//if (!ftl) logger.log("AlfrescoJasperReports - missing test ftl!");
		if (!jrxml) logger.log("AlfrescoJasperReports - missing reportRegistroProtocollo jrxml!");
		
		//if (ftl && jrxml)
		if (jrxml)
		{
			var xmlDataSourceString = xml;//companyhome.processTemplate(ftl);
			logger.log("AlfrescoJasperReports -  xml: " + xml); 
		
			//getting query from JRXML file dynamically. You don't have to do that, you as "hardcode" it when executing jasperReportsHelper command
			//	e4x for some reason doesn't work when creating xml from whole file content.. that 1st line is problematic..
			try {
				var query = new XML(jrxml.content.substring(jrxml.content.indexOf("<queryString"), jrxml.content.lastIndexOf("</queryString>") + 14));
				query = "" + query;
				
				logger.log("AlfrescoJasperReports - query: " + query); 
			} catch(err) {
				logger.log("AlfrescoJasperReports - can't get query from report... "); 
				var query = "/items/*";
				model.message = "" + err;
			} 
			
			try {	
				/*
				   jasperReportsHelper.generateXMLDataSourceReport( 	xmlDataSourceString, 
											xpath report query, 
											nodeRef object of japer report document located on repository, 
											nodeRef object of destination folder to place generated report,
											output format ["pdf", "xls", "docx"]
				   );
				*/
				logger.log("jasperReportsHelper.generate");
				var generatedReportNodeRef= jasperReportsHelper.generateXMLDataSourceReport( xmlDataSourceString,  query, jrxml.getNodeRef(), protocolli.nodeRef, fileName);
				logger.log("jasperReportsHelper.search");
				var generatedReport = search.findNode(generatedReportNodeRef);
				logger.log("AlfrescoJasperReports - report generated. " + generatedReport.displayPath + "/" + generatedReport.name );
				model.message = "";
				return generatedReport;
			} catch(err) { 
				logger.log("AlfrescoJasperReports - error while generating report... :( " + err);
				model.message = "" + err;
			}
		} else {
			logger.log("reportRegistroProtocollo mancante aggiungerlo in companyHome/Report");
			model.message = "reportRegistroProtocollo mancante aggiungerlo in companyHome/Reports";
		}
	} catch(err) { 
		logger.log("AlfrescoJasperReports - error while generating report... :( " + err);
		model.message = "" + err;
	}
}


/**
 * Genera il documento contenente le registrazioni
 * @param registrazioni
 * 	{
 * 		dataRegistrazioni,
 * 		items: [ doc1..docN ]
 * 	}
 * @returns
 */
function creaDocumentoRegistrazioniProtocollo(registrazioni){


	var text = "<items>";
	var textLine = "";
	var protocollo;
	var nprot = ""; 
	var titolo; 
	var mittDest; 
	var oggetto; 
	var dataProtocollo; 
	var statoProtocollo;	

	logger.log("1");
	
	for (var i=0; i<registrazioni.items.length; i++){
		logger.log("2");
		protocollo = registrazioni.items[i];
		logger.log("NumProt: " + protocollo.properties["skpi:numero_protocollo"]);
		textLine = "<item>";
		nprot =  protocollo.properties["skpi:numero_protocollo"];
		textLine = textLine + "<dataRegistro>" + formatDate(registrazioni.dataRegistrazioni) +	"</dataRegistro>";
		nprot = "<numProtocollo>" + nprot + "</numProtocollo>";
		mittDest = "<mittDest>" + protocollo.properties["skpi:mittente"] + "</mittDest>";
		oggetto = "<oggetto>" + protocollo.properties["skpi:oggetto"] + "</oggetto>";
		titolo = "<titolo>" + protocollo.properties["skpi:titolario"] + "</titolo>";
		dataProtocollo = "<dataProtocollo>" + formatDate(protocollo.properties["skpi:data_protocollazione"]) + "</dataProtocollo>";			
		statoProtocollo = "<statoProtocollo>" + protocollo.properties["skpi:stato"] + "</statoProtocollo>";
		logger.log("3");
		textLine = textLine 
			 + nprot
		 	+ mittDest
		 	 + oggetto
		 	 + titolo
		 	 + dataProtocollo			
		 	 + statoProtocollo
		
			+ "</item>";
		text = text + textLine;
		
	}
	logger.log("4");
	//text = text + "</table>";
	//text = "<html>\n<body>\n"+text+"</body>\n</html>\n";
	text = text + "</items>";
	
	var pRoot = getContainerProtocolli();
	var fileName = "registrazioniProtocollo-<date>";
	logger.log("5");
	fileName = fileName.replace("<date>", toISO8601(registrazioni.dataRegistrazioni, "date") );
	logger.log("6");
	var docRegistrazioni = generaPdf(text, fileName);
	logger.log("7");
	
	//var docRegistrazioni = pRoot.childByNamePath(fileName);
	if (docRegistrazioni != undefined) {
	
		//docRegistrazioni.addAspect("skpi:registrazioniProtocollo");
		docRegistrazioni.addAspect("skpi:protocollabile");
				
		docRegistrazioni.properties["skpi:aoo"] = registrazioni.aoo;
        var manager = Packages.it.tlogic.sinekartapi.protocolloManager.ProtocolManager;
		docRegistrazioni.properties["skpi:titolario"] = manager.getTitolarioJournal(registrazioni.aoo);
		docRegistrazioni.properties["skpi:oggetto"] = "REGISTRAZIONE";
		docRegistrazioni.properties["skpi:tipo"] = "Documento Interno";
		docRegistrazioni.properties["skpi:data_protocollazione"] = new Date();
		try {
			docRegistrazioni.properties['skpi:numero_protocollo'] = getNumeroProtocollo(registrazioni.aoo);
		} catch (e) {
				
		}
		
		
		logger.log("8");
		//docRegistrazioni.properties["skpi:dataRegistrazioni"] = new Date();
		docRegistrazioni.save();
		logger.log("9");
		
		for (var i=0; i<registrazioni.items.length; i++){
			
			protocollo = registrazioni.items[i];
			protocollo.addAspect("skpi:registrato")
			protocollo.save();
		}
		
	} else {
		throw "Errore ! C'è già un registro " + fileName + " ? ";
	}	
}


try {

	logger.log("---------------------- Inizio ----------------------");
	model.message = "nulla  da archiviare";
	//var date = getDataUltimoDocumentoRegistrazioniProtocollo();
	var date = new Date();
	date.setDate(date.getDate() - 1);
	logger.log("ultimaArchiviazione " + date);
	var protocolli = getProtocolliDaRegistrare(date);
	logger.log("1-3");
	
	var aoo = url.templateArgs.aoo;
	if (aoo == undefined) 
		aoo = "A01";
	
	for (var y in protocolli){
		model.message = "registro creato";
		var protocolliAnno = protocolli[y];
		for (var m in protocolliAnno){
			var protocolliMese = protocolliAnno[m];
			for (var d in protocolliMese){
				var protocolliGiorno = protocolliMese[d];
				var dataProtocolli = new Date(y, m, d);
				creaDocumentoRegistrazioniProtocollo({
					dataRegistrazioni: dataProtocolli,
					items: protocolliGiorno,
					aoo: aoo
				})
			}
		}
	}
	logger.log("FINE");
} catch(err) { 
	logger.log("AlfrescoJasperReports - error while generating report... :( " + err);
	model.message = "" + err;
}



