<#include "../../documentlibrary/include/toolbar.lib.ftl" />
<@markup id="js">
   <#-- JavaScript Dependencies -->
   <#include "../../form/form.js.ftl"/>
</@>
<#assign el=args.htmlid?html>
<#assign jsid = args.htmlid?js_string>

<script type="text/javascript">//<![CDATA[
	// resizeable dashlet
	new Alfresco.widget.DashletResizer("${jsid}", "${instance.object.id}");
	
	var np = new Alfresco.component.NewProtocol("${el}");
	np.setOptions(
	{
  		siteId: "${page.url.templateArgs.site!""}",
  		hideNavBar: false, <#-- ${(preferences.hideNavBar!false)?string}, -->
  		googleDocsEnabled: ${(googleDocsEnabled!false)?string},
		destination: ${destination}
	}).setMessages( ${messages} );
	np.onProtocolCreateForm();
//]]></script>

<@link rel="stylesheet" type="text/css" href="${page.url.context}/res/components/newprotocol/newprotocol.css" />

<div class="dashlet">
	<div class="title">
		${msg("title")}
	</div>

	<div class="body scrollableList"
		<#if args.height??>style="height: ${args.height}px;"</#if> >
    
		<div id="${el}-body" class="form-manager">
			<#--<h1>${msg("header")}</h1>-->
		<div>

        <#--<h1>sito: ${page.url.templateArgs.site}</h1>-->
	</div>
	
	<div id="${el}-protocolFormContainer"></div>
</div>
  	
    
<#--  </div>
</div>-->
