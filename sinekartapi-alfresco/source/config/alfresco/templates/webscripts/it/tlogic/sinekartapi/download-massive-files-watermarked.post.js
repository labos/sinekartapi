<import resource="classpath:/alfresco/extension/scripts/utils.js">
var resultStringLog = "Action failed",
    resultCode = 0,
    response = "";

var requestJsonContent = jsonUtils.toObject(requestbody.content),
protocolsFound = requestJsonContent.protocolsFound;



var tempPath = companyhome.childByNamePath("_temp_folder_");
if (tempPath == null) {
    tempPath = companyhome.createFolder("_temp_folder_");
tempPath.setPermission("Contributor", "GROUP_EVERYONE");
}

// create temporary subfolderresultStringLog
var tempSubfolder = tempPath.createFolder(new Date().getTime());
var nodesToArchive =  [] ;

for (var index=0; index < protocolsFound.size(); index++) {
	
	
	var nodeRefProtocol = protocolsFound.get(index);
	var nodeRef = "workspace://" + nodeRefProtocol.substring(nodeRefProtocol.search("SpacesStore/"));
	var docNode = search.findNode(nodeRef);
	if (docNode != null && docNode.isDocument && docNode.size > 0) {
	    try {

	        var first_pdf = docNode,
	        watermarkText = "Sardegna Ricerche" + " ";
	        //retrieve date and protocol number
	        var dateProtocol = first_pdf.properties["skpi:data_protocollazione"],
	        numberProtocol =first_pdf.properties["skpi:numero_protocollo"];
	        dateProtocol = formatDate(dateProtocol);
	        watermarkText+= dateProtocol + ' PROT. N.' + numberProtocol;
	        


	        // check if current document is a pdf-file. If not, create it
	        if (docNode.properties.content.mimetype  != "application/pdf" && docNode.properties.content.size > 0 ) {
	            try {
	                resultStringLog = "Could not convert document";
	                // create temporary subfolder
	                var tempSubfolderTransf = tempSubfolder.createFolder('_' + new Date().getTime());
	                var conversionFormat ="application/pdf";
	                var nodeTransf = docNode.transformDocument(conversionFormat, tempSubfolderTransf);
	                if (nodeTransf != null) {
	                    nodeTransf.properties.content.mimetype = "application/pdf";
	                    //overwrite source pdf file to watermark
	                    first_pdf = nodeTransf;
	                    resultStringLog = "Document converted";
	                }
	            } catch (e) {
	                resultStringLog = "Convertion failed due to exception";
	                throw new Error("Document pdf conversion failed.")
	            }

	        }


	        var dest_folder = tempSubfolder;
	        // set watermarkaction object and execute
	        var WatermarkAction = actions.create("pdf-watermark");

	        WatermarkAction.parameters["destination-folder"] = dest_folder;
	        WatermarkAction.parameters["watermark-text"] = watermarkText;
	        WatermarkAction.parameters["watermark-type"] = "text";
	        WatermarkAction.parameters["watermark-pages"] = "first";
	        WatermarkAction.parameters["watermark-depth"] = "over";
	        WatermarkAction.parameters["watermark-font"] = "Helvetica";
	        WatermarkAction.parameters["watermark-size"] = "12";
	        WatermarkAction.parameters["watermark-image"] = "workspace://SpacesStore/0154cb58-ce1f-4f0f-9b8c-5db8f9f19943";
	        WatermarkAction.parameters["position"] = "topright";


	        logger.log("Watermark action to be executed with result : " + resultStringLog + '--' + conversionFormat + '....'  + WatermarkAction + "***  " + docNode.properties.content.mimetype + '.........' + tempSubfolder + '-----');

	        var watermarkResult = WatermarkAction.execute(first_pdf);
	        
	        if(tempSubfolder.childByNamePath(first_pdf.name) !== null){
	        	var singleWatermarkedFileNodeRef = tempSubfolder.childByNamePath(first_pdf.name).nodeRef;	        	
	        	nodesToArchive.push(singleWatermarkedFileNodeRef.toString());
	        	// set success with one converted at least
	        	resultCode = 1;
	        	}

	    } catch (e) {
	        logger.info("Exception during watermarking.. " + e.description + e.message);
	    }
	}
	
	
	
}
//now tempSubfolder contains all documents watermarked and a list of watermarked document is returned as json

if(nodesToArchive.length) {
	model.response = nodesToArchive;
}
// set results for caller
model.resultCode = resultCode;

