    
function createSchedulePdf(xml,fileName){
	

	try {
		var reportsFolderName = "Reports";
		
		var reports = siteService.getSite("protocollo").node.childByNamePath("documentLibrary/" + reportsFolderName);
		var protocolli = siteService.getSite("protocollo").node.childByNamePath("documentLibrary/Protocolli");
		if (!reports) {
			logger.log("AlfrescoJasperReports - Folder not present " + reportsFolderName); 
			reports = companyhome.createFolder("documentLibrary/" + reportsFolderName);
		}
			
		logger.log("AlfrescoJasperReports -  load report template"); 
		var jrxml =  siteService.getSite("protocollo").node.childByNamePath("documentLibrary/" + reportsFolderName + "/reportScheduleProtocollo.jrxml");
		
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
				var tempPath = companyhome.childByNamePath("_temp_folder_");
		        if (tempPath == null) {
		            tempPath = companyhome.createFolder("_temp_folder_");
			    tempPath.setPermission("Contributor", "GROUP_EVERYONE");
		        }

		        // create temporary subfolderresultStringLog
		        var tempSubfolder = tempPath.createFolder(new Date().getTime());
		        
				logger.log("jasperReportsHelper.generate");
				var generatedReportNodeRef= jasperReportsHelper.generateXMLDataSourceReport( xmlDataSourceString,  query, jrxml.getNodeRef(), tempSubfolder.nodeRef, fileName);
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
		}p
	} catch(err) { 
		logger.log("AlfrescoJasperReports - error while generating report... :( " + err);
		model.message = "" + err;
	}
}

// default code execute when this webscript is called
try {
    	var requestJsonContent = jsonUtils.toObject(requestbody.content),
         protocolsFound = requestJsonContent.protocolsFound,
         text ="<items>",
         textLine ="";
    	
    	for (var index=0; index < protocolsFound.size(); index++) {
    		var currentDocumentNodeRef = protocolsFound.get(index),
    		docNode = search.findNode(currentDocumentNodeRef);
    		textLine ="";
    		if (docNode != null && docNode.isDocument) {
 
    		    	var destinatario = docNode.properties['skpi:destinatario'],
    		    		address = docNode.properties['skpi:address'],
    		    		city = docNode.properties['skpi:city'],
    		    		postalCode = docNode.properties['skpi:postalCode'],
    		    		province = docNode.properties['skpi:province'],
    		    		entryNumber = index +1;
    		    	
    		    	//html+='<tr valign="top"><td>' + entryNumber + '&nbsp;'  + destinatario + '</td><td>' + address.toUpperCase() + '</td></tr>' + '<tr><td>' + 'Localit&agrave; ' + city.toUpperCase() + '</td><td>' +zipCode.toUpperCase() + '</td></tr>'; 
    				textLine = "<item><entryNumber>"+entryNumber+"</entryNumber><destinatario>"+destinatario+"</destinatario><address>"+address+"</address><city>"+city+"</city><postalCode>"+postalCode+"</postalCode><province>" + province + "</province></item>";	
    		    }
    		
    		text+= textLine;
    		
    	}
        
        text+='</items>';
        
        var uuidFile = new Date().getTime(),
        fileSchedule = createSchedulePdf(text,uuidFile);
        /*
        var tempPath = companyhome.childByNamePath("_temp_folder_");
        if (tempPath == null) {
            tempPath = companyhome.createFolder("_temp_folder_");
	    tempPath.setPermission("Contributor", "GROUP_EVERYONE");
        }
        // create temporary subfolderresultStringLog
        var tempSubfolder = tempPath.createFolder(new Date().getTime());
        var content = "Questo è il contenuto del file.";
        var fileSchedule = tempSubfolder.createFile("schedule.html") ;
        
        fileSchedule.mimetype = "text/html";
        var args = new Array()
        args["id"] = "01234-56789";
        var result = fileSchedule.processTemplate(html, args);
        
        fileSchedule.content = result;
        var trans2 = fileSchedule.transformDocument("application/pdf");
        
        */
        /*
        fileSchedule.content = content;
        fileSchedule.properties.content.setEncoding("UTF-8");
        //fileSchedule.properties.content.guessMimetype(filename);
        fileSchedule.properties.content.mimetype = "application/pdf";
        
        fileSchedule.properties.title = "distinta";
        fileSchedule.properties.description = "distinta sardegna ricerche";
        
       
        fileSchedule.save();
         */
        //var nodeTransf = docNode.transformDocument(conversionFormat, tempSubfolder);
        //+ '&ticket=' + session.getTicket()
	    model.response = fileSchedule.nodeRef.toString() ;
	    model.resultCode = 1;
	    
	    
       
    }
    catch(e){
    	
        resultStringLog = "Distinta creation failed due to exception " + args + protocolsFound;
        throw new Error(resultStringLog + e);
    }