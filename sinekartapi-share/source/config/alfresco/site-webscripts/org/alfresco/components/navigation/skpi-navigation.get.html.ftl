<#assign activeSite = page.url.templateArgs.site!"">
<#assign pageFamily = template.properties.pageFamily!"dashboard">

<div class="site-navigation">
<#if siteExists>
   <#if url.context + "/page/site/" + activeSite + "/dashboard" == page.url.uri>
      <#assign linkClass>class="active-page theme-color-4"</#assign>
   <#else>
      <#assign linkClass>class="theme-color-4"</#assign>
   </#if>
   <span class="navigation-item"><a href="${url.context}/page/site/${activeSite}/dashboard" ${linkClass}>${msg("link.siteDashboard")}</a></span>
<#--
   <#if siteValid>
      <span class="navigation-separator">&nbsp;</span>
      <#list pages as p>
         <#assign linkPage=p.pageUrl!p.title/>
         <#if linkPage?index_of(pageFamily) != -1>
            <#assign linkClass>class="active-page theme-color-4"</#assign>      
         <#else>
            <#assign linkClass>class="theme-color-4"</#assign>
         </#if>
      <span class="navigation-item"><a href="${url.context}/page/site/${activeSite}/${linkPage}" ${linkClass}>${(p.sitePageTitle!p.title)?html}</a></span>
         <#if p_has_next>
      <span class="navigation-gap">&nbsp;</span>
         </#if>
      </#list>
   </#if>
-->





   <span class="navigation-separator">&nbsp;</span>
   <#if pageFamily = "site-members">
      <#assign linkClass>class="active-page theme-color-4"</#assign>      
   <#else>
      <#assign linkClass>class="theme-color-4"</#assign>
   </#if>
<span class="navigation-item"><a href="${url.context}/page/site/${activeSite}/advsearch" ${linkClass}>RICERCA PROTOCOLLO</a></span>
</#if>
</div>



<script type="text/javascript">//<![CDATA[

// nota: usare questo per identificare il sito di protocollazione parametrico
//alert("${activeSite}");

var journalLink = document.getElementById("${args.htmlid}-journalLink");
var newProtocolLink = document.getElementById("${args.htmlid}-newProtocolLink");

var printProtocolJournal = function(data) {

	Alfresco.util.Ajax.request(
		{
			url: Alfresco.constants.PROXY_URI + "it/tlogic/sinekartapi/protocol-journal/A01",
			method: "post",
			successCallback: {
                   fn: function dlA_onActionDetails_success(response) {
                          
                			YAHOO.Bubbling.fire("metadataRefresh", {});

			                // Display success message
                			var msgResult = response.json.message;
			                Alfresco.util.PopupManager.displayMessage(
                                {
                                        text: msgResult
                                });
					},
        			scope: this
			},
			
			failureCallback:
				{
					fn: function dlA_onActionDetails_failure(response) {
                		var msgResult = response.json.message;
                		Alfresco.util.PopupManager.displayMessage(
                        	{
                            	text: msgResult
                            });
        		},
        	scope: this
		}

	});
}


// Form stuff
var onNewProtocolClick = function(event) {

	var npp = new Alfresco.component.NewProtocolPopup("${args.htmlid}");
	
	npp.setOptions(
	{
  		siteId: "${page.url.templateArgs.site!""}",
  		hideNavBar: false, <#-- ${(preferences.hideNavBar!false)?string}, -->
  		googleDocsEnabled: ${(googleDocsEnabled!false)?string},
		destination: ${destination}
	}).setMessages( ${messages} );	

	npp.onNewProtocolClick(event);
	
}

// Events handling

YAHOO.util.Event.addListener(journalLink, "click", printProtocolJournal);
YAHOO.util.Event.addListener(newProtocolLink, "click", onNewProtocolClick);

//]]></script>
