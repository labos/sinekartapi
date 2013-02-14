/**
 * Copyright (C) 2005-2010 Alfresco Software Limited.
 *
 * This file is part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * NewProtocol component.
 * 
 * @namespace Alfresco.component
 * @class Alfresco.component.NewProtocol
 */
(function() {
	/**
	 * YUI Library aliases
	 */
	var Dom = YAHOO.util.Dom, Event = YAHOO.util.Event;

	/**
	 * NewProtocol constructor.
	 * 
	 * @param {String}
	 *            htmlId The HTML id of the parent element
	 * @return {Alfresco.component.NewProtocol} The new NewProtocol instance
	 * @constructor
	 */
	Alfresco.component.NewProtocol = function NewProtocol_constructor(htmlId) {
		Alfresco.component.NewProtocol.superclass.constructor.call(this,
				htmlId, [ "button" ]);

		// Re-register with our own name
		this.name = "Alfresco.component.NewProtocol";
		Alfresco.util.ComponentManager.reregister(this);

		// Instance variables
		this.options = YAHOO.lang.merge(this.options,
				Alfresco.component.NewProtocol.superclass.options);
		// this.selectedItems = "";
		this.destination = "";
		// file to protocol NodeRef
		this.protocolFileNodeRef ="";
		// this.workflowTypes = [];
		this.isEnterPressed = false;
		// YAHOO.Bubbling.on("objectFinderReady", this.onObjectFinderReady,
		// this);
		// YAHOO.Bubbling.on("formContentReady",
		// this.onNewProtocolFormContentReady, this);

		return this;
	};

	YAHOO
	.extend(Alfresco.component.NewProtocol,	Alfresco.component.ShareFormManager,
			{

		/**
		 * Object container for initialization options
		 * 
		 * @property options
		 * @type object
		 */
		options : {
			/**
			 * A nodeRef that represents the context of the
			 * workflow ********
			 * 
			 * @property destination
			 * @type string
			 */
			destination : "",
		},

		/**
		 * Fired by YUI when parent element is available for
		 * scripting. Template initialisation, including
		 * instantiation of YUI widgets and event listener
		 * binding.
		 * 
		 * @method onReady
		 */
		onReady : function NewProtocol_onReady() {
			// this.onProtocolCreate();
			return Alfresco.component.NewProtocol.superclass.onReady.call(this);

		},

		/**
		 * Will populate the form packageItem's objectFinder
		 * with selectedItems when its ready
		 * 
		 * @method onObjectFinderReady
		 * @param layer
		 *            {object} Event fired (unused)
		 * @param args
		 *            {array} Event parameters
		 */
		onObjectFinderReady : function NewProtocol_onObjectFinderReady(
				layer, args) {
			var objectFinder = args[1].eventGroup;
			if (objectFinder.options.field == "assoc_packageItems"
				&& objectFinder.eventGroup.indexOf(this.id) == 0) {
				// objectFinder.selectItems(this.options.selectedItems);
			}
		},

		/**
		 * Called when a workflow definition has been selected
		 * 
		 * @method onWorkflowSelectChange
		 */
		// onProtocolCreate: function
		// NewProtocol_onProtocolCreate(p_sType, p_aArgs)
		onProtocolCreateForm : function NewProtocol_onProtocolCreateForm() {

				Alfresco.util.Ajax.request({
					url : Alfresco.constants.URL_SERVICECONTEXT + "components/form",
					dataObj : {
						htmlid : this.id + "protocol-create",
						itemKind : "type",
						itemId : "skpi:protocollo",
						mode : "create",
						submitType : "json",
						showCaption : true,
						formUI : true,
						//showSubmitButton: true,
						showCancelButton : true,
						mimeType : "text/plain",
						destination : this.options.destination,
					},
					successCallback : {
						fn : this.onProtocolFormLoaded,
						scope : this
					},
					failureMessage : this.msg("message.failure"),
					scope : this,
					execScripts : true
				});
		},

		/**
		 * Called when a workflow form has been loaded. Will
		 * insert the form in the Dom.
		 * 
		 * @method onProtocolFormLoaded
		 * @param response
		 *            {Object}
		 */
		onProtocolFormLoaded : function NewProtocol_onProtocolFormLoaded(response) {
			var formEl = Dom.get(this.id + "-protocolFormContainer");
			// Dom.addClass(formEl, "hidden");
			formEl.innerHTML = response.serverResponse.responseText;

			var protocolForm = new Alfresco.forms.Form(this.id + "protocol-create-form");
protocolForm.addValidation(this.id + "protocol-create_prop_skpi_oggetto", Alfresco.forms.validation.mandatory, null,
null,"Devi aggiungere l'oggetto");
protocolForm.addValidation(this.id + "protocol-create_prop_skpi_mittente", Alfresco.forms.validation.mandatory, null,
null,"Devi aggiungere il mittente");
protocolForm.addValidation(this.id + "protocol-create_prop_skpi_destinatario", Alfresco.forms.validation.mandatory, null,
null,"Devi aggiungere il destinatario");


//File Upload button: user needs  "create" access
var rootNodeRef = "alfresco://company/home";
var nodeRef = new Alfresco.util.NodeRef(rootNodeRef);
this.fileUpload = Alfresco.getFileUploadInstance();

this.widgets.fileUpload = Alfresco.util.createYUIButton(this, "", this.onClickUploadButton,
{
   disabled: false,
   value: "create",
   menuclassname: "yui-button-protocol"
},
this.id + "protocol-create_my-upload-cntrl");


			var callbacks = {
					successCallback : {
						fn : this.onProtocolSent,
						scope : this,
					},
					failureMessage : "Errore nella creazione del protocollo"
			};
			protocolForm.setValidateOnSubmit(true);
			protocolForm.setAJAXSubmit(true, callbacks);
			
			protocolForm.init();
			
			 /*  Event.removeListener(formEl, "submit");
	         formEl.setAttribute("onsubmit", "return false;");
	         */
		  var me = this;	
	      var enterListener = new YAHOO.util.KeyListener(formEl,
	        	      {
	        	         keys: YAHOO.util.KeyListener.KEY.ENTER
	        	      }, function(e, args){
	        	    	  me.isEnterPressed = true;
	        	    	  Event.preventDefault(e);
	        	    	  Event.stopEvent(e);
	        	    	  Event.stopPropagation(e);
	        	    	  Event.removeListener(formEl, "submit");
	        	    	  return false;
	        	      }, "keydown");
	        	      enterListener.enable();
	        
			
			
			
	         protocolForm.doBeforeAjaxRequest =
	        	         {
	        	            fn: function(config, obj)
	        	            {
	        	                // Return false so the form isn't submitted
	        	            	//return this.isEnterPressed?  false : true;
	        	            	return true;
	        	             },
	        	            obj: null,
	        	            scope: this
	        	         }
	        
			//add event listener for change of select protocol
			Dom.get(this.id + "protocol-create_prop_skpi_" + "destinatario").value = this.msg("message.company");
			Event.addListener(this.id + "protocol-create_prop_skpi_tipo", "change", this.onSelectTypeChange,this, true); 
		},
		
		/**
	       * Handles changes on protocol type select html .
	       *
	       * @method onSelectTypeChange
	       * @param event
	       * @param args
	       * @param obj
	       * @private
	       */
	      onSelectTypeChange: function NewProtocol__onSelectTypeChange(event, args, obj)
	      {
	         // save the current contents of the editor to the underlying textarea
	    	 var selectedType = event.target.value,
	    	 	 confirmOverwrite  = true,
	    	 	 me = this,
	             defaultRecipientSenderMap =
	            {"Entrata": "destinatario",
	             "Uscita": "mittente"};

	            if (selectedType && defaultRecipientSenderMap.hasOwnProperty(selectedType))
	            {
	            	var recipientSender = Dom.get(this.id + "protocol-create_prop_skpi_" + defaultRecipientSenderMap[selectedType]);
	            	if( recipientSender.value  !==''  && recipientSender.value !== this.msg("message.company") ) { 
	            		Alfresco.util.PopupManager.displayPrompt({
		    				text : this.msg("message.defaultRecipientSenderOverwrite"),
		    				effect : null,
		    				 buttons: [
										{
									    title: Alfresco.util.message("label.titleRecipientSenderOverwrite"),
										text: Alfresco.util.message("button.ok"),
										handler: function error_onOk(e, p_obj)
										{
										this.destroy();
										recipientSender.value = me.msg("message.company");	
										//YAHOO.util.Dom.get("").focus();
										//YAHOO.util.Dom.get("").select();
										},
										isDefault: true
										},
										{
											text: Alfresco.util.message("button.cancel"),
											handler: function error_onCancel()
											{
												confirmOverwrite  = false;
												this.destroy();
											
											}
											}]
	            		
		    			});
	            	}
	            	else{
		            	recipientSender.value = this.msg("message.company");	
	            	}

	            	
	            }
	         
	      },


		  onClickUploadButton : function NewProtocol_onClickUploadButton(e, args){
			   YAHOO.util.Event.stopEvent(e);
			   var multiUploadConfig =
			   {
			   		// siteId: this.siteid,
			            containerId: "documentLibrary",
			            uploadDirectory: "/_temp_protocol_",
			            filter: [],
			            siteId: this.options.siteId,
			            //destination: this.options.destination,
			            updateNodeRef: null,
			            uploadURL: "/api/upload",
			            mode: this.fileUpload.MODE_MULTI_UPLOAD,
			            thumbnails: "doclib",
			            onFileUploadComplete:
			            {
			               fn: this.onProtocolUploadComplete,
			               scope: this
			            }
			    }
			   this.fileUpload.show(multiUploadConfig);
			   
			   },
			   
			  onProtocolUploadComplete: function NewProtocol_onProtocolUploadComplete( complete ){
					
					var success = complete.successful.length;
			         // replace image URL with the updated one
			           var iconProtocolledId = this.id + "protocol-create_my-upload" + "-uploadFinish";
			           Dom.setStyle (iconProtocolledId, "visibility" , "hidden" );
					       if (success != 0)
					        {
					         var noderef = complete.successful[0].nodeRef;
					         this.protocolFileNodeRef = noderef;
					         var mypreview = Alfresco.util.ComponentManager.findFirst("Alfresco.WebPreview"); 
					         mypreview.setOptions(
					        		 {
					        		 nodeRef: this.protocolFileNodeRef,
					        		 name: "my-name",
					        		 //icon: "${node.icon}",
					        		 //mimeType: "${node.mimeType}",
					        		 //previews: [<#list node.previews as p>"${p}"<#if (p_has_next)>, </#if></#list>],
					        		 //size: "${node.size}"
					        		 }).setMessages("preview");
					         mypreview.plugin.display();
					         //mypreview.refresh("/components/preview/web-preview");
					         var previewDocumentProtocol = new Alfresco.WebPreview("web-preview").setOptions(
					        		 {
					        		 nodeRef: this.protocolFileNodeRef,
					        		 name: "my-name",
					        		 //icon: "${node.icon}",
					        		 //mimeType: "${node.mimeType}",
					        		 //previews: [<#list node.previews as p>"${p}"<#if (p_has_next)>, </#if></#list>],
					        		 //size: "${node.size}"
					        		 }).setMessages("preview");
					         // replace image URL with the updated one
					           Dom.setStyle (iconProtocolledId, "visibility" , "visible" );
					          //logoImg.src = Alfresco.constants.PROXY_URI + "api/node/" + noderef.replace("://", "/") + "/content";
					            
					            // set noderef value in hidden field ready for options form submit
					           Dom.get("console-options-logo").value = noderef;
					        }
				},
		/**
		 * Called when a protocol request is being submitted
		 * 
		 * @method onProtocolSent
		 * @param response
		 *            {Object}
		 */
		onProtocolSent : function NewProtocol_onProtocolSent(response) {

			// TODO: selezionare area organizzativa omogenea
			// opportuna
			var aoo = "A01";
			var protocolAddress = Alfresco.constants.PROXY_URI
			+ "it/tlogic/sinekartapi/protocol-document?noderef="
			+ response.json.persistedObject + "&aoo="
			+ aoo + "&uploadfile=" + this.protocolFileNodeRef;
			Alfresco.util.PopupManager.displayMessage({
				text : "Inserimento protocollo in corso",
				spanClass : "wait",
				displayTime : 0,
				effect : null
			});

			Alfresco.util.Ajax
			.request({
				url : protocolAddress,
				successCallback : {
					fn : function(response) {
						Alfresco.util.PopupManager.displayMessage({
							text : "Inserito protocollo " + response.json.numero_protocollo
						});
						var formEl = Dom.get(this.id + "protocol-create-form");
						this.protocolFileNodeRef ="";
						var iconProtocolledId = this.id + "protocol-create_my-upload" + "-uploadFinish";
						Dom.setStyle (iconProtocolledId, "visibility" , "hidden" );
						var tree = new YAHOO.util.Element(
						"protocol-create_prop_skpi_titolario-cntrl");
						var label = new YAHOO.util.Element(
						"protocol-create_prop_skpi_titolario-label");

						tree.setStyle('display', 'block');
						label.setStyle('display', 'none');
						// var protocolForm = new
						// Alfresco.forms.Form("protocol-create-form");
						formEl.reset();
						Dom.get(this.id + "protocol-create_prop_skpi_" + "destinatario").value = this.msg("message.company");
						
						// reset preview
						var mypreview = Alfresco.util.ComponentManager.findFirst("Alfresco.WebPreview"); 
				         mypreview.setOptions(
				        		 {
				        		 nodeRef: "workspace://SpacesStore/05f2e236-0a98-44a0-bcd4-92a2df0df525",
				        		 }).setMessages("preview");
				         mypreview.plugin.display();
				         
						var millis = 2000;
						var date = new Date();
						var curDate = null;
						do {
							curDate = new Date();
						} while (curDate - date < millis);
						YAHOO.Bubbling
						.fire("protocolliRefresh", {});

						var millis = 2000;
						var date = new Date();
						var curDate = null;
						do {
							curDate = new Date();
						} while (curDate - date < millis);
						YAHOO.Bubbling.fire("protocolliRefresh", {});

						var millis = 2000;
						var date = new Date();
						var curDate = null;
						do {
							curDate = new Date();
						} while (curDate - date < millis);
						YAHOO.Bubbling.fire("protocolliRefresh", {});

					},
					scope : this
				},
				failureMessage : "Impossibile protocollare il documento",
				scope : this
			});
		},

		/**
		 * Event handler called when the "formContentReady"
		 * event is received
		 */
		onNewProtocolFormContentReady : function FormManager_onNewProtocolFormContentReady(
				layer, args) {
			var formEl = Dom.get(this.id
					+ "-protocolFormContainer");
			// Dom.removeClass(formEl, "hidden");
			Alfresco.util.PopupManager.displayMessage({
				text : "contentReady"
			});
		},
	 

		/**
		 * Tries to get a common parent nodeRef for an action that
		 * requires one.
		 * 
		 * @method getParentNodeRef
		 * @param record
		 *            {object} Object literal representing one file
		 *            or folder to be actioned
		 * @return {string|null} Parent nodeRef or null
		 */
		//		getParentNodeRef: function dlA_getParentNodeRef(record)
		//		{
		//		var nodeRef = null;
		//		if (YAHOO.lang.isArray(record))
		//		{
		//		try
		//		{
		//		nodeRef = this.doclistMetadata.parent.nodeRef;
		//		}
		//		catch (e)
		//		{
		//		nodeRef = null;
		//		}
		//		if (nodeRef === null)
		//		{
		//		for (var i = 1, j = record.length, sameParent = true; i < j && sameParent; i++)
		//		{
		//		sameParent = (record[i].parent.nodeRef == record[i - 1].parent.nodeRef)
		//		}
		//		nodeRef = sameParent ? record[0].parent.nodeRef : this.doclistMetadata.container;
		//		}
		//		}
		//		else
		//		{
		//		nodeRef = record.parent.nodeRef;
		//		}
		//		return nodeRef;
		//		}
			});

})();
