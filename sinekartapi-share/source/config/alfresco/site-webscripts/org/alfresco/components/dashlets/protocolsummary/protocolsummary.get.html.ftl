<#assign id = args.htmlid>
<#assign jsid = args.htmlid?js_string>
<#assign prefSimpleView = preferences.simpleView!true>
<script type="text/javascript">//<![CDATA[

(function()
{
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom,
      Event = YAHOO.util.Event;
   /**
    * Alfresco Slingshot aliases
    */
   var $html = Alfresco.util.encodeHTML,
      $links = Alfresco.util.activateLinks,
      $userProfile = Alfresco.util.userProfileLink,
      $siteDashboard = Alfresco.util.siteDashboardLink,
      $relTime = Alfresco.util.relativeTime;
      
   /**
    * Preferences
    */
   var PREFERENCES_PROTOCOLLILIST_DASHLET = "org.alfresco.share.protocollilist.dashlet"
      PREFERENCES_PROTOCOLLILIST_DASHLET_FILTER = PREFERENCES_PROTOCOLLILIST_DASHLET + ".filter",
      PREFERENCES_PROTOCOLLILIST_DASHLET_VIEW = PREFERENCES_PROTOCOLLILIST_DASHLET + ".simpleView";

   /**
    * Dashboard ProtocolliList constructor.
    *
    * @param {String} htmlId The HTML id of the parent element
    * @return {Alfresco.dashlet.ProtocolliList} The new component instance
    * @constructor
    */
   Alfresco.dashlet.ProtocolliList = function ProtocolliList_constructor(htmlId)
   {
	  var sum = Alfresco.dashlet.ProtocolliList.superclass.constructor.call(this, htmlId);
	  YAHOO.Bubbling.on("protocolliRefresh", this.onRefreshProtocollo, this);
      return sum;
   };

   YAHOO.extend(Alfresco.dashlet.ProtocolliList, Alfresco.component.SimpleDocList,
   {
      /**
       * Fired by YUI when parent element is available for scripting
       * @method onReady
       */
      onReady: function ProtocolliList_onReady()
      {
         Alfresco.dashlet.ProtocolliList.superclass.onReady.apply(this, arguments);

         // Detailed/Simple List button
         this.widgets.simpleDetailed = new YAHOO.widget.ButtonGroup(this.id + "-simpleDetailed");
         if (this.widgets.simpleDetailed !== null)
         {
            this.widgets.simpleDetailed.check(this.options.simpleView ? 0 : 1);
            this.widgets.simpleDetailed.on("checkedButtonChange", this.onSimpleDetailed, this.widgets.simpleDetailed, this);
         }
      },

      /**
       * Generate base webscript url.
       *
       * @method getWebscriptUrl
       * @override
       */
      getWebscriptUrl: function SimpleDocList_getWebscriptUrl()
      {
         return Alfresco.constants.PROXY_URI + "slingshot/doclib/doclist/documents/site/protocollo/documentLibrary/Protocolli?max=50";
      },

      /**
       * Calculate webscript parameters
       *
       * @method getParameters
       * @override
       */
      getParameters: function ProtocolliList_getParameters()
      {
         //return "filter=recentlyModified";
         	return "filter=path&sortField=cm:created&sortAsc=false";
      },
        onRefreshProtocollo: function ProtocolliList_Refresh()
      {
        
         this.reloadDataTable();
      },

      /**
       * Show/Hide detailed list buttongroup click handler
       *
       * @method onSimpleDetailed
       * @param e {object} DomEvent
       * @param p_obj {object} Object passed back from addListener method
       */
      onSimpleDetailed: function ProtocolliList_onSimpleDetailed(e, p_obj)
      {
         this.options.simpleView = e.newValue.index === 0;
         this.services.preferences.set(PREFERENCES_PROTOCOLLILIST_DASHLET_VIEW, this.options.simpleView);
         if (e)
         {
            Event.preventDefault(e);
         }

         this.reloadDataTable();
      },
      
      
      /**
       * Override detail custom datacell formatter
       *
       * @method renderCellDetail
       * @param elCell {object}
       * @param oRecord {object}
       * @param oColumn {object}
       * @param oData {object|string}
       */
      renderCellDetail: function SimpleDocList_renderCellDetail(elCell, oRecord, oColumn, oData)
      {
         var record = oRecord.getData(),
            desc = "";

         if (record.isInfo)
         {
            desc += '<div class="empty"><h3>' + record.title + '</h3>';
            desc += '<span>' + record.description + '</span></div>';
         }
         else
         {
            var id = this.id + '-metadata-' + oRecord.getId(),
               version = "",
               description = '<span class="faded">' + this.msg("details.description.none") + '</span>',
               dateLine = "",
               canComment = record.permissions.userAccess.create,
               locn = record.location,
               nodeRef = new Alfresco.util.NodeRef(record.nodeRef),
               docDetailsUrl = Alfresco.constants.URL_PAGECONTEXT + "site/" + locn.site + "/document-details?nodeRef=" + nodeRef.toString();

            // Description non-blank?
            if (record.description && record.description !== "")
            {
               description = $links($html(record.description));
            }

            // Version display
            if (record.version && record.version !== "")
            {
               version = '<span class="document-version">' + $html(record.version) + '</span>';
            }
            
            // Date line
            var dateI18N = "modified", dateProperty = record.modifiedOn;
            if (record.custom && record.custom.isWorkingCopy)
            {
               dateI18N = "editing-started";
            }
            else if (record.modifiedOn === record.createdOn)
            {
               dateI18N = "created";
               dateProperty = record.createdOn;
            }
            if (Alfresco.constants.SITE === "")
            {
               dateLine = this.msg("details." + dateI18N + "-in-site", $relTime(dateProperty), $siteDashboard(locn.site, locn.siteTitle, 'class="site-link theme-color-1" id="' + id + '"'));
            }
            else
            {
               dateLine = this.msg("details." + dateI18N + "-by", $relTime(dateProperty), $userProfile(record.modifiedByUser, record.modifiedBy, 'class="theme-color-1"'));
            }

            if (this.options.simpleView)
            {
               /**
                * Simple View
                */
                
                	var  dateProtocolString  =  Alfresco.util.formatDate(record.createdOn,"dd-mm-yyyy");
                  	//var  dateProtocolObj =  new Date(record.createdOn.iso8601), 
                  	//add 1 month due to 0 index
	    			//month = dateProtocolObj.getMonth() + 1,
	    			// dateProtocolString = dateProtocolObj.getDate() + '/' + month + '/' + dateProtocolObj.getFullYear();
                
               desc += '<h3 class="filename simple-view"><a class="theme-color-1" href="' + docDetailsUrl + '">' + $html(record.displayName) +'</a>' +  ' ' + $html(dateProtocolString) + '</h3>';
               desc += '<div class="detail"><span class="item-simple">' + dateLine + '</span></div>';
            }
            else
            {
               /**
                * Detailed View
                */
               desc += '<h3 class="filename"><a class="theme-color-1" href="' + docDetailsUrl + '">' + $html(record.displayName) + '</a>' + version + '</h3>';

               desc += '<div class="detail">';
               desc +=    '<span class="item">' + dateLine + '</span>';
               if (this.options.showFileSize)
               {
                  desc +=    '<span class="item">' + Alfresco.util.formatFileSize(record.size) + '</span>';
               }
               desc += '</div>';
               desc += '<div class="detail"><span class="item">' + description + '</span></div>';

               /* Favourite / Likes / Comments */
               desc += '<div class="detail detail-social">';
               desc +=    '<span class="item item-social">' + Alfresco.component.SimpleDocList.generateFavourite(this, oRecord) + '</span>';
               desc +=    '<span class="item item-social item-separator">' + Alfresco.component.SimpleDocList.generateLikes(this, oRecord) + '</span>';
               if (canComment)
               {
                  desc +=    '<span class="item item-social item-separator">' + Alfresco.component.SimpleDocList.generateComments(this, oRecord) + '</span>';
               }
               desc += '</div>';
            }
            
            // Metadata tooltip
            this.metadataTooltips.push(id);
         }

         elCell.innerHTML = desc;
      }
      
      
   });
})();


(function()
{
   var docSum = new Alfresco.dashlet.ProtocolliList("${jsid}");
   docSum.setOptions(
		   {
			  simpleView: ${prefSimpleView?string?js_string},
			  maxItems: ${maxItems?c}
		   }).setMessages(${messages});

	
   new Alfresco.widget.DashletResizer("${jsid}", "${instance.object.id}");
   new Alfresco.widget.DashletTitleBarActions("${jsid}").setOptions(
   {
      actions:
      [
         {
            cssClass: "help",
            bubbleOnClick:
            {
               message: "${msg("dashlet.help")?js_string}"
            },
            tooltip: "${msg("dashlet.help.tooltip")?js_string}"
         }
      ]
   });
})();
//]]></script>

<div class="dashlet docsummary">
   <div class="title">${msg("header")}</div>
   <div class="toolbar flat-button">
      <div id="${id}-simpleDetailed" class="align-right simple-detailed yui-buttongroup inline">
         <span class="yui-button yui-radio-button simple-view<#if prefSimpleView> yui-button-checked yui-radio-button-checked</#if>">
            <span class="first-child">
               <button type="button" tabindex="0" title="${msg("button.view.simple")}"></button>
            </span>
         </span>
         <span class="yui-button yui-radio-button detailed-view<#if !prefSimpleView> yui-button-checked yui-radio-button-checked</#if>">
            <span class="first-child">
               <button type="button" tabindex="0" title="${msg("button.view.detailed")}"></button>
            </span>
         </span>
      </div>
      <div class="clear"></div>
   </div>
   <div class="body scrollableList" <#if args.height??>style="height: ${args.height}px;"</#if>>
      <div id="${id}-documents"></div>
   </div>
</div>
