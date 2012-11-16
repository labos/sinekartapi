/*
 * padds str with characters char until it reaches length length
 * FIXME gestire il caso in cui str sia piu` lunga di length
 */
function Utils_pad(str, padChar, len){
	padChar = String(padChar);
	var res = "";
	for (var i=0; i<len; i++)
		res = res + padChar;
	res = res + str;
	res = res.slice(-len);
	return res;
}

function formatDate(dateProp){
	if (dateProp){
		var date = new Date(Date.parse(dateProp) ),
			day = date.getDate(),
			month = date.getMonth()+1,
			year = date.getFullYear(),
			dateStr = "" + day + "/" + month + "/" + year;
		return dateStr;
	}
	return null
}

function toISO8601(date, format){
	var isoDate = utils.toISO8601(date);
	if (format == "date")
		isoDate = isoDate.substring(0, 10);
	if (format == "datetime")
		isoDate = isoDate.substring(0, 19);
	//isoDate = isoDate.replace('-', '\\-');
	return isoDate;
}

function isUtenteProtocollo(m_person){
	var containerGroups = people.getContainerGroups(m_person),
		group, authName
		res = false;	
	for (var i=0; i<containerGroups.length; i++){
	   group = containerGroups[i];
	   authName = group.properties["cm:authorityName"];
	   if (authName == "GROUP_site_protocollo_SiteCollaborator" || authName == "GROUP_site_protocollo_SiteManager")
		   res = true;
	}
	return res;
}

function getNumeroProtocollo(aoo){

	var year = new Date().getFullYear().toString();

	var manager = Packages.it.tlogic.sinekartapi.protocolloManager.ProtocolManager;
	var counter = manager.nextValue(aoo);
	var protocolNumber = Utils_pad(counter, "0", 7);
	
	return protocolNumber;

}

function protocolDocument(node, aoo, protocolFileNodeRef) {

	if(node) {
		try {
			var numProtocollo = getNumeroProtocollo(aoo);
		} catch(e) {
			logger.log("ERRORE in creazione protocollo: " + e);
			return { "success": false };			
		}
		
		logger.log("ottenuto numero di protocollo: " + numProtocollo);
		node.name = "Protocollo-" + numProtocollo;
		node.properties['skpi:numero_protocollo'] = numProtocollo;
		node.properties['skpi:data_protocollazione'] = new Date();
		node.properties['skpi:stato'] = "Protocollato";
		node.properties['skpi:aoo'] = aoo;
		//update content file with uploaded content file
		var docNode = search.findNode(protocolFileNodeRef);
		if (docNode != null && docNode.isDocument) {
			node.properties.content.write(docNode.properties.content);
			docNode.remove();
		}
		node.save();
	
		return {
			"success": true,
			"numero_protocollo": numProtocollo
		};
		
	} else {
		logger.log("ERRORE in creazione protocollo: node not found");
		return { "success": false };
	}
}


function revokeProtocol(node, reason) {

	if(node) {
		
		var numProtocollo = node.properties['skpi:numero_protocollo'];
		logger.log("annullamento protocollo: " + numProtocollo);
		node.addAspect("skpi:annullato");
		node.properties['skpi:stato'] = "Annullato";
		node.properties['skpi:motivo'] = reason;
		node.properties['skpi:dataAnnullamento'] = new Date();
		node.properties['skpi:utenteAnnullante'] = person.properties.userName;;
		node.save();
	
		return {
			"success": true,
			"numero_protocollo": numProtocollo
		};
		
	} else {
		logger.log("ERRORE in annullamento protocollo: node not found");
		return { "success": false };
	}
}


function getContainerProtocolli(){
	var rootProtocolli = siteService.getSite("protocollo").node.childByNamePath("documentLibrary/Protocolli");
	return rootProtocolli;
}
