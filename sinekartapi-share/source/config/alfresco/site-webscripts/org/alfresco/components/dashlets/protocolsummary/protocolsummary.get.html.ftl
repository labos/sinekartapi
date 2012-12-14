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
         return Alfresco.constants.PROXY_URI + "slingshot/doclib/doclist/documents/site/protocollo/documentLibrary/Protocolli?max=50&filter=path";
      },

      /**
       * Calculate webscript parameters
       *
       * @method getParameters
       * @override
       */
      getParameters: function ProtocolliList_getParameters()
      {
         return "filter=recentlyModified";
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
