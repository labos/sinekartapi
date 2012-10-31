var resultStringLog = "Action failed",
    resultCode = 0,
    response = "";

var nodeRef = "workspace://" + args.nodeRef.substring(args.nodeRef.search("SpacesStore/"));
var docNode = search.findNode(nodeRef);
if (docNode != null && docNode.isDocument) {
    try {

        var first_pdf = docNode;
        var tempPath = companyhome.childByNamePath("_temp_folder_");
        if (tempPath == null) {
            tempPath = companyhome.createFolder("_temp_folder_");
	    tempPath.setPermission("Contributor", "GROUP_EVERYONE");
        }

        // create temporary subfolderresultStringLog
        var tempSubfolder = tempPath.createFolder(new Date().getTime());

        // check if current document is a pdf-file. If not, create it
        if (docNode.properties.content.mimetype  != "application/pdf") {
            try {
                resultStringLog = "Could not convert document";
                // create temporary subfolder
                var tempSubfolderTransf = tempSubfolder.createFolder('_' + new Date().getTime());
		var conversionFormat ="application/pdf";
                var nodeTransf = docNode.transformDocument(conversionFormat, tempSubfolderTransf);
                if (nodeTransf != null) {
                    nodeTransf.properties.content.mimetype = "application/pdf";
                    first_pdf = nodeTransf;
                    resultStringLog = "Document converted";
                    //resultCode = 1;
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
        WatermarkAction.parameters["watermark-text"] = args.watermarkText;
        WatermarkAction.parameters["watermark-type"] = "text";
        WatermarkAction.parameters["watermark-pages"] = "first";
        WatermarkAction.parameters["watermark-depth"] = "over";
        WatermarkAction.parameters["watermark-font"] = "Courier";
        WatermarkAction.parameters["watermark-size"] = "14";
        WatermarkAction.parameters["watermark-image"] = "workspace://SpacesStore/0154cb58-ce1f-4f0f-9b8c-5db8f9f19943";
        WatermarkAction.parameters["position"] = "topleft";


        logger.log("Watermark action to be executed with result : " + resultStringLog + '--' + conversionFormat + '....'  + WatermarkAction + "***  " + docNode.properties.content.mimetype + '.........' + tempSubfolder + '-----');

        var watermarkResult = WatermarkAction.execute(first_pdf);

    } catch (e) {
        logger.info("Exception during watermarking.. " + e.description + e.message);
    }
}

if(tempSubfolder.childByNamePath(first_pdf.name) !== null){
resultCode = 1;
response = tempSubfolder.childByNamePath(first_pdf.name).downloadUrl;
}
// set results for caller
model.result = resultCode;
model.response = response;
