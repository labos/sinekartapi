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
 * Alfresco.component.NewProtocolPopup
 * Aggregates events from all the sites the user belongs to.
 * For use on the user's dashboard.
 *
 * @namespace Alfresco
 * @class Alfresco.component.NewProtocolPopup
 */
(function()
		{
	/**
	 * YUI Library aliases
	 */
	var Dom = YAHOO.util.Dom,
	Event = YAHOO.util.Event;

	/**
	 * NewProtocolPopup constructor.
	 * 
	 * @param {String} htmlId The HTML id of the parent element
	 * @return {Alfresco.component.WikiDashlet} The new WikiDashlet instance
	 * @constructor
	 */
	Alfresco.component.NewProtocolPopup = function NewProtocolPopup_constructor(htmlId)
	{
		//this.name = "Alfresco.component.NewProtocolPopup";
		//Alfresco.util.ComponentManager.reregister(this);
		Alfresco.component.NewProtocolPopup.superclass.constructor.call(this, "Alfresco.component.NewProtocolPopup", htmlId);

		return this;
	};

	YAHOO.extend(Alfresco.component.NewProtocolPopup, Alfresco.component.Base,
			{
		options:
		{

		},
//		{
//		/**
//		* Object container for initialization options
//		*
//		* @property options
//		* @type object
//		*/
//		options:
//		{
//		/**
//		* The gui id.
//		*
//		* @property guid
//		* @type string
//		*/
//		//guid: "",

//		/**
//		* Current siteId.
//		*
//		* @property siteId
//		* @type string
//		*/
//		siteId: "",

//		/**
//		* The pages on this site's wiki.
//		*
//		* @property pages
//		* @type Array
//		*/
//		//pages: []
//		},

		/**
		 * Wiki mark-up parser instance.
		 *
		 * @property parser
		 * @type Alfresco.WikiParser
		 */
		//parser: null,

		/**
		 * Allows the user to configure the feed for the dashlet.
		 *
		 * @property configDialog
		 * @type DOM node
		 */
		configDialog: null,

		/**
		 * Fired by YUI when parent element is available for scripting.
		 * Initialises components, including YUI widgets.
		 *
		 * @method onReady
		 */ 
		onReady: function NewProtocolPopup_onReady()
		{
			//Event.addListener(this.id + "-newProtocolLink", "click", this.onNewProtocolClick, this, true);

			/*this.parser.URL = Alfresco.util.uriTemplate("sitepage",
         {
            site: this.options.siteId,
            pageid: "wiki-page?title="
         });*/

			//var wikiDiv = Dom.get(this.id + "-newProtocolPopup");
			//wikiDiv.innerHTML = this.parser.parse(wikiDiv.innerHTML, this.options.pages);
		},


		/**
		 * Called to create a new protocol via popup.
		 * 
		 * @method onCreateP
		 * @param asset
		 *            {object} Object literal representing one
		 *            file or folder to be actioned
		 */
		onNewProtocolClick : function dlTB_onNewProtocolClick(event) {

//			Event.stopEvent(event);

			//this.beforeRenderEvent = new YAHOO.util.CustomEvent('beforeRenderEvent', this, true);

			// Intercept before dialog show
			var doBeforeDialogShow = function dlA_onActionDetails_doBeforeDialogShow(
					p_form, p_dialog) {
				Dom.get(p_dialog.id + "-form-container_h").innerHTML = this.msg("label.dati-protocollo.title");
			};

			var templateUrl = YAHOO.lang.substitute(
					Alfresco.constants.URL_SERVICECONTEXT +
					"components/form?itemKind={itemKind}&itemId={itemId}&destination={destination}&mode={mode}&submitType={submitType}&showCancelButton=true",
					{
						itemKind : "type",
						itemId : "skpi:protocollo",
						//itemId: "cm:content",
						mode : "create",
						destination : this.options.destination,
						submitType : "json",
					});

			// Using Forms Service, so always create a new instance
			var editDetails = new Alfresco.module.SimpleDialog(this.id + "-editDetails").setOptions(
					{
						width : "1000px",
						templateUrl : templateUrl,
						actionUrl : null,
						destroyOnHide : true,
						doBeforeDialogShow : {
							fn : doBeforeDialogShow,
							scope : this
						},
						onSuccess : {
							fn : this.onProtocolSent,
							scope : this
						},
						onFailure : {
							fn : function dLA_onActionDetails_failure(response) {
								Alfresco.util.PopupManager.displayMessage({
									text : this.msg("message.details.failure" + adressProtocolli)
								});
							},
							scope : this
						}
					}).show(); // setOptions end
		},

		onProtocolSent : function NewProtocol_onProtocolSent(response) {
//			YAHOO.Bubbling.fire("metadataRefresh", {});

			// TODO: selezionare area organizzativa omogenea opportuna
			var aoo = "A01";
			var protocolAddress = Alfresco.constants.PROXY_URI
			+ "it/tlogic/sinekartapi/protocol-document?noderef="
			+ response.json.persistedObject + "&aoo=" + aoo;

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
//						var formEl = Dom.get(this.id + "protocol-create-form");
						// var titolario =
						// Dom.get("protocol-create_prop_skpi_titolario-label");

						var tree = new YAHOO.util.Element(
						"protocol-create_prop_skpi_titolario-cntrl");
						var label = new YAHOO.util.Element(
						"protocol-create_prop_skpi_titolario-label");

						tree.setStyle('display', 'block');
						label.setStyle('display', 'none');
						// var protocolForm = new
						// Alfresco.forms.Form("protocol-create-form");
//						formEl.reset();

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
		 * Configuration click handler
		 *
		 * @method onConfigFeedClick
		 * @param e {object} HTML event
		 */
		/*      onConfigFeedClick: function WikiDashlet_onConfigFeedClick(e)
      {
         Event.stopEvent(e);


         var actionUrl = Alfresco.constants.URL_SERVICECONTEXT + "modules/wiki/config/" + encodeURIComponent(this.options.guid);

         if (!this.configDialog)
         {
            this.configDialog = new Alfresco.module.SimpleDialog(this.id + "-configDialog").setOptions(
            {
               width: "50em",
               templateUrl: Alfresco.constants.URL_SERVICECONTEXT + "modules/wiki/config/" + this.options.siteId,
               onSuccess:
               {
                  fn: function WikiDashlet_onConfigFeed_callback(e)
                  {
                     var obj = YAHOO.lang.JSON.parse(e.serverResponse.responseText);
                     if (obj)
                     {
                        // Update the content via the parser
                        Dom.get(this.id + "-scrollableList").innerHTML = this.parser.parse(obj["content"], this.options.pages);

                        // Update the title
                        Dom.get(this.id + "-title").innerHTML = Alfresco.util.message("label.header-prefix", this.name) + (obj.title !== "" ? " - <a href=\"wiki-page?title=" + encodeURIComponent(e.config.dataObj.wikipage) + "\">" + obj.title + "</a>" : "");
                     }
                  },
                  scope: this
               }
            });
         }

         this.configDialog.setOptions(
         {
            actionUrl: actionUrl
         }).show();

      }*/
			});
		})();