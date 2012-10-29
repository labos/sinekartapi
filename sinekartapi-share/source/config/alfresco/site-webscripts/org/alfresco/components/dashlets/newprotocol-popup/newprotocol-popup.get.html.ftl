<#include "../../documentlibrary/include/toolbar.lib.ftl" />

<#assign el=args.htmlid?html>
<#assign jsid = args.htmlid?js_string>

<@link rel="stylesheet" type="text/css" href="${page.url.context}/res/components/newprotocol/newprotocol-popup.css" />

<div class="dashlet">
  <div class="title">
  	${msg("title")}
  </div>
  <#-- title’s value will be taken from property file -->
  <#--<div class="body scrollableList"-->
  <div>
  	<#if args.height??>style="height: ${args.height}px;"</#if>
    
    <div id="${el}-body" class="form-manager">
    	<h1>${msg("header")}</h1>
	  	<div id="${el}-protocolFormContainer"></div>
	  	
	  	<div class="crea-protocollo"><button id="${el}-creaProtocollo-button" name="creaProtocollo">${msg("button.creaProtocollo")}</button></div>
		<div class="stampa-registro" style="margin-top:10px;"><button id="${el}-stampaRegistro-button" name="stampaRegistro">${msg("button.stampaRegistro")}</button></div>
	  	
    </div>
  	
    
  </div>
</div>

<script type="text/javascript">//<![CDATA[
	//new Alfresco.widget.DashletResizer("${jsid}", "${instance.object.id}");
	
	var np = new Alfresco.component.NewProtocolPopup("${el}");
	np.setOptions(
	{
  		siteId: "${page.url.templateArgs.site!""}",
  		hideNavBar: false, <#-- ${(preferences.hideNavBar!false)?string}, -->
  		googleDocsEnabled: ${(googleDocsEnabled!false)?string},
		destination: ${destination}
	}).setMessages( ${messages} );
	
/*
   new Alfresco.DocListToolbar("${el}").setOptions(
   {
      siteId: "${page.url.templateArgs.site!""}",
      hideNavBar: false, <#--${(preferences.hideNavBar!false)?string},-->
      googleDocsEnabled: ${(googleDocsEnabled!false)?string}
   }).setMessages(
      ${messages}
   );
	*/
//]]></script>