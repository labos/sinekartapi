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
	    	
	    	
	        
	        var reason = prompt("Perche' vuoi annullare il protocollo ?", "")
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
   
})();

