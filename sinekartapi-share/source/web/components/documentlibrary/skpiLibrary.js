/*
 * Copyright (C) 2012 - 2013 TLogic Software.
 *
 * This file is part of Sinekarta PI
 *
 * SinekartaPI is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * SinekartaPI is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 */
/**
 * sinekartaPI Document library actions
 * 
 * @namespace Alfresco
 * @class Alfresco.doclib.Actions
 */
(function() {

   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom;
   var Event = YAHOO.util.Event;
   var $html = Alfresco.util.encodeHTML;
   var $combine = Alfresco.util.combinePaths;
   var $siteURL = Alfresco.util.siteURL;

var override = Alfresco.DocumentList || Alfresco.DocumentActions;
var getActionUrls_override = override.prototype.getActionUrls;

override.prototype.getActionUrls = function(recordData){
 var jsNode = recordData.jsNode,
            nodeRef = jsNode.isLink ? jsNode.linkedNode.nodeRef : jsNode.nodeRef,
            strNodeRef = nodeRef.toString(),
            nodeRefUri = nodeRef.uri,
            mimeType = jsNode.mimetype,
            contentUrl = jsNode.contentURL,
            extensionMap =
            {
               "application/vnd.ms-excel": "xls",
               "application/vnd.ms-powerpoint": "ppt",
               "application/msword" : "doc",
               "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "xlsx",
               "application/vnd.openxmlformats-officedocument.presentationml.presentation" : "pptx",
               "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : "docx",
               "application/pdf" : "pdf",
               "application/x-zip" : "zip",
               "application/zip" : "zip",
            };
var actionUrls = getActionUrls_override.apply(this,arguments);
/* set extension for downloadable file attached to protocol */
var extensionFileString = Alfresco.util.getFileExtension(recordData.location.file);
     if (extensionFileString == null && extensionMap.hasOwnProperty(mimeType))
         {
		extensionFileString = "." + extensionMap[mimeType];
	}
	else{

	   extensionFileString =  "";
}
var downloadLinkWhitExtension = $combine(Alfresco.constants.PROXY_URI, contentUrl) +  extensionFileString + "?a=true";
actionUrls["downloadUrl"] = downloadLinkWhitExtension;
return actionUrls;
};




override.prototype.getDownloadActionUrls = function(recordData){
 var jsNode = recordData.jsNode,
            nodeRef = jsNode.isLink ? jsNode.linkedNode.nodeRef : jsNode.nodeRef,
            strNodeRef = nodeRef.toString(),
            nodeRefUri = nodeRef.uri,
            mimeType = jsNode.mimetype,
            contentUrl = jsNode.contentURL,
            extensionMap =
            {
               "application/vnd.ms-excel": "xls",
               "application/vnd.ms-powerpoint": "ppt",
               "application/msword" : "doc",
               "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "xlsx",
               "application/vnd.openxmlformats-officedocument.presentationml.presentation" : "pptx",
               "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : "docx",
               "application/pdf" : "pdf",
               "application/x-zip" : "zip",
               "application/zip" : "zip",
            };

/* set extension for downloadable file attached to protocol */
var extensionFileString = Alfresco.util.getFileExtension(recordData.location.file);
     if (extensionFileString == null && extensionMap.hasOwnProperty(mimeType))
         {
		extensionFileString = "." + extensionMap[mimeType];
	}
	else{

	   extensionFileString =  "";
}
var downloadLinkWhitExtension = $combine(Alfresco.constants.PROXY_URI, contentUrl) +  extensionFileString + "?a=true";
return downloadLinkWhitExtension;
};
	
   YAHOO.Bubbling.fire("registerAction",  { 
		actionName: "onActionStampaEtichetta", 
		fn: function dlA_onActionUploadStampaEtichetta(asset){    	
			
	        var nodeRef = new Alfresco.util.NodeRef(asset.nodeRef);       
	        window.open(Alfresco.constants.PROXY_URI + '/skpi/etichetta/' + nodeRef.uri, 'Etichetta + ' +asset.displayName);
	        
	        }   
	        
	   });
   

   
   YAHOO.Bubbling.fire("registerAction",  { 
		actionName: "onActionEliminaProtocollo", 
		fn: function dlA_onActionEliminaProtocollo(asset){    	
	        var nodeRef = new Alfresco.util.NodeRef(asset.nodeRef);
	        
	        var callbackEliminaProtocollo = function(reason){
		        this.modules.actions.genericAction(
		        {
		            success:
		            {
		                message: this.msg("message.eliminaProtocollo.success", asset.displayName),
		                callback: {
		                    fn: function(obj){YAHOO.Bubbling.fire("metadataRefresh")},
		                    scope: this
		                }
		            },
		            failure:
		            {
		                message: this.msg("message.eliminaProtocollo.failure", asset.displayName)
		            },
		            webscript:
		            {
		                method: Alfresco.util.Ajax.POST,
		                name: "eliminaProtocollo/node/{nodeRef}",
		                params:
		                {
		                    nodeRef: nodeRef.uri	                    
		                }
		            },
		            config:
	                {
	                    dataObj:
	                    {
	                    	reason: reason,
	                    	userName: Alfresco.constants.USERNAME
	                    }
	                }
		        });
	        };
	        var userInput = Alfresco.util.PopupManager.getUserInput(
	                {
	                   title: this.msg("message.confirm.delete.title"),
	                   text: this.msg("message.confirm.delete", asset.protocollabile.numeroProtocollo),               
	                   input: "text",
	                   callback: {
	                	   fn: callbackEliminaProtocollo,
	                	   scope: this
	                   }
	                });
	            
	            var i=0;
	            
	            
	        }   
		
	   });
   
YAHOO.Bubbling.fire("registerAction",  { 
		actionName: "onActionAnnullaProtocollo", 
		fn: function dlA_onActionAnnullaProtocollo(asset){   	
	    		        
	        var reason = prompt(this.msg("message.annullaProtocollo.question", asset.displayName));
	        if (reason == null)
				return;
	        
	        
	        var nodeRef = new Alfresco.util.NodeRef(asset.nodeRef);
	        this.modules.actions.genericAction(
	        {
	            success:
	            {
	                message: this.msg("message.annullaProtocollo.success", asset.displayName),
	                callback: {
	                    fn: function(obj){YAHOO.Bubbling.fire("metadataRefresh")},
	                    scope: this
	                }
	            },
	            failure:
	            {
	                message: this.msg("message.annullaProtocollo.failure", asset.displayName)
	            },
	            webscript:
	            {
	                method: Alfresco.util.Ajax.GET,
	                stem: Alfresco.constants.PROXY_URI + "it/tlogic/sinekartapi/",
	                name: "revoke-protocol?nodeRef={nodeRef}&reason={reason}",
			                params:
			                {
			                    nodeRef: nodeRef.uri,
			                    reason: reason
			                }
	            }
	        });
	    }   
		
	   });


YAHOO.Bubbling.fire("registerAction",  { 
		actionName: "onActionPrintProtocol", 
		fn: function dlA_onActionStampaProtocollo(asset){
        
	    var nodeRef = new Alfresco.util.NodeRef(asset.nodeRef),
		jsNode = asset.jsNode;
	    var  dateProtocolObj =  new Date(jsNode.properties['skpi:data_protocollazione'].iso8601); 
	    if(isNaN(dateProtocolObj)){
		    Alfresco.util.PopupManager.displayMessage(
	                {
	                   text: this.msg("message.dateProblem", asset.displayName)
	                });
		    return;
	    }
	    //add 1 month due to 0 index
	    var month = dateProtocolObj.getMonth() + 1;
	    var dateProtocolString = dateProtocolObj.getDate() + '/' + month + '/' + dateProtocolObj.getFullYear();
	    //retrieve protocol number from asset aspect property
		var protocolNumberString = this.msg("message.company", asset.displayName) + " " + "\r\n" + dateProtocolString + ' PROT. N.' +jsNode.properties['skpi:numero_protocollo'] ;
	        this.modules.actions.genericAction(
	        {
	            success:
	            {

	                callback: {
	                    fn: function(obj){
				 if(obj.json.result && obj.json.result!='' && obj.json.result!='0' && obj.json.response!=''){
					 
				window.open(Alfresco.constants.PROXY_URI + "api/node/content" + obj.json.response.replace("/d/a/", "/")  + '.pdf');}
				 else{  
					 Alfresco.util.PopupManager.displayMessage(
                     {
                        text: this.msg("message.printWithWatermark.failure", asset.displayName)
                     });

}

				YAHOO.Bubbling.fire("metadataRefresh")},
	                    	scope: this
	                }
	            },
	            failure:
	            {
	                message: this.msg("message.annullaProtocollo.failure", asset.displayName)
	            },
	            webscript:
	            {
	                method: Alfresco.util.Ajax.POST,
	                stem: Alfresco.constants.PROXY_URI + "it/tlogic/sinekartapi/",
	                name: "download-with-watermark?nodeRef={nodeRef}&watermarkText={watermarkText}",
			                params:
			                {
			                    nodeRef: nodeRef.uri,
			                    watermarkText: protocolNumberString
			                }
	            }
	        });
	    }   
		
	   });


   
})();

