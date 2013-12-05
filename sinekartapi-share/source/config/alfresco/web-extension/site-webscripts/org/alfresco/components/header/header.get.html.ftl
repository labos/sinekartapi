<@markup id="css" >
   <#-- CSS Dependencies -->
   <@link href="${url.context}/res/components/header/header.css" group="header"/>
   <@link href="${url.context}/res/modules/about-share.css" group="header"/>
   <#if context.properties["editionInfo"].edition != "UNKNOWN">
      <#-- License usage -->
      <@link href="${url.context}/res/components/console/license.css" group="header"/>
   </#if>
   <#if config.global.header?? && config.global.header.dependencies?? && config.global.header.dependencies.css??>
      <#list config.global.header.dependencies.css as cssFile>
         <@link href="${url.context}/res${cssFile}" group="header"/>
      </#list>
   </#if>
</@>

<@markup id="js">
   <#-- JavaScript Dependencies -->
   <@script src="${url.context}/res/components/header/header.js" group="header"/>
   <@script src="${url.context}/res/modules/about-share.js" group="header"/>
   <#if config.global.header?? && config.global.header.dependencies?? && config.global.header.dependencies.js??>
      <#list config.global.header.dependencies.js as jsFile>
         <@script src="${url.context}/res${jsFile}" group="header"/>
      </#list>
   </#if>
</@>

<@markup id="widgets">
   <@createWidgets group="header"/>
   <@inlineScript group="header">
      Alfresco.util.createTwister.collapsed = "${collapsedTwisters?js_string}";
   </@>
</@>

<@markup id="html">
   <@uniqueIdDiv>
      <#include "../../include/alfresco-macros.lib.ftl" />
      <#import "header.inc.ftl" as header>
      <#assign siteActive = page.url.templateArgs.site??>
      <#assign id = args.htmlid?html>
      <#assign jsid = id?replace("-", "_")?js_string>
      <#assign defaultlogo=msg("header.logo")><#if defaultlogo="header.logo"><#assign defaultlogo="app-logo.png"></#if>
      <#if !user.isGuest>
      <div class="header">
         <span class="header-left">
            <span class="logo">
               <a href="${url.context}"><img src="${url.context}<#if logo?? && logo?length!=0>/proxy/alfresco/api/node/${logo?replace('://','/')}/content<#else>/res/themes/${theme}/images/${defaultlogo}</#if>" alt="Alfresco Share" /></a>
            </span>
            <span class="logo-spacer">&nbsp;</span>
            <span id="${id}-appItems" class="app-items hidden"><@header.renderItems config.global.header.appItems id "app" /></span>
         </span>
         <#-- Ideally this should be done via the inlineScript directive - but it doesn't work due to ordering at the moment -->
         <#-- <@inlineScript group="header"> -->
         <script type="text/javascript">//<![CDATA[
            ${jsid}.setAppItems([${header.js}]);
         //]]></script>
         <#-- </@> -->
		  <span id="${id}-userItems" class="user-items">
            <div class="user-items-wrapper">
               <@header.renderItems config.global.header.userItems id "user" />
            </div>
            <div class="search-box">
               <span id="${id}-search_more" class="yui-button yui-menu-button">
                  <span class="first-child" style="background-image: url(${url.context}/res/components/images/header/search-menu.png)">
                     <button type="button" title="${msg("header.search.description")}" tabindex="0"></button>
                  </span>
               </span>
               <input id="${id}-searchText" type="text" maxlength="1024" />
            </div>
            <div id="${id}-searchmenu_more" class="yuimenu yui-overlay yui-overlay-hidden">
               <div class="bd">
                  <ul class="first-of-type">
                     <li><a style="background-image: url(${url.context}/res/components/images/header/advanced-search.png)" title="${msg("header.advanced-search.description")}" href="${siteURL("advsearch")}">${msg("header.advanced-search.label")}</a></li>
                  </ul>
               </div>
            </div>
         </span>
         <label style="padding:4px;border-radius:0px 0px 5px 5px;background-color:#F2639D;-moz-box-shadow: 0px 5px 5px #3d3b3d;-webkit-box-shadow: 0px 5px 5px #3d3b3d;box-shadow: 0px 5px 5px #3d3b3d;">Cerca per Ufficio/Settore==></label>
         <select id="searchByUo">
            	<option value="">Scegli Ufficio</option>
          		<option value="workspace://SpacesStore/8e5ecb65-ae07-49d6-a5e4-68a5dbba38fc">AGI</option>  
          		<option value="workspace://SpacesStore/54ba0b71-dce9-4d9b-b97b-ed3e27da311f">APP</option>
          		<option value="workspace://SpacesStore/a448f5e6-0097-4768-bee5-10a40959bfe8">CDS</option>
          		<option value="workspace://SpacesStore/4c1189ad-91b4-47a7-b2c0-bd2e35cd7bd0">CGE</option>
				<option value="workspace://SpacesStore/a7316bd1-d2ae-453d-a612-55504e75c08f">DIR</option>
				<option value="workspace://SpacesStore/5af2dd9b-8dee-4c3e-b554-6063241b0866">DOC</option>
				<option value="workspace://SpacesStore/0d032a77-bcef-45cc-87d1-265d76d11ace">NET</option>
				<option value="workspace://SpacesStore/4159b15a-cfbe-4150-a926-bb1f8d893c5f">PRE</option>
				<option value="workspace://SpacesStore/9c3ba542-b6c0-43c2-aa00-e53bbd394f6e">PST</option>
				<option value="workspace://SpacesStore/74fe329b-d712-4f4b-8e4a-a355814b7667">REA</option>
				<option value="workspace://SpacesStore/ee95c832-8164-448d-a57c-540eeef43b78">RIC</option>
				<option value="workspace://SpacesStore/ff63a834-9d82-40b2-b4fd-c422cac14552">SAG</option>
				<option value="workspace://SpacesStore/cc02860f-4859-4ebb-b6cb-055256890d95">SIR</option>
				<option value="workspace://SpacesStore/91d7bb35-1e87-4eac-86c5-4af9f257fe52">SPF</option>
				<option value="workspace://SpacesStore/1dc0d123-cdc3-42f9-b4b1-003b3ece7e3b">STT</option>          	
         </select>    	
         <a style="float:right;padding:4px;border-radius:0px 0px 5px 5px;background-color:#F2639D;-moz-box-shadow: 0px 5px 5px #3d3b3d;-webkit-box-shadow: 0px 5px 5px #3d3b3d;box-shadow: 0px 5px 5px #3d3b3d;" href="${url.context}/page/advsearch">${msg("button.searchProtocol")}</a>
       
         <#-- Ideally this should be done via the inlineScript directive - but it doesn't work due to ordering at the moment -->
         <#-- <@inlineScript group="header"> -->
         <script type="text/javascript">//<![CDATA[
            ${jsid}.setUserItems([${header.js}]);
           YAHOO.util.Event.addListener("searchByUo", "change", function(event, args, obj){
           	var selectedUo = event.target.value;
           	window.location.href = YAHOO.lang.substitute(Alfresco.constants.URL_PAGECONTEXT + "search?t={terms}&q={query}&s=cm:created|false",
           	{
           	terms: "",
           	query:"	{\"prop_skpi_titolario\":\"\",\"prop_cm_categories\":\"" + selectedUo + "\",\"datatype\":\"cm:content\"}"
           	});
           	}, this, true);
            

         //]]></script>
         <#-- </@> -->
      </div>
      <#else>
      <div class="header">
         <span class="header-left">
            <span class="logo">
               <a href="#" onclick="${jsid}.showAboutShare(); return false;"><img src="${url.context}/res/themes/${theme}/images/${logo!"app-logo.png"}" alt="Alfresco Share" /></a>
            </span>
            <span class="logo-spacer">&nbsp;</span>
         </span>
      </div>
      </#if>
      <div class="clear"></div>
      <#if usage??>
      <div class="license">
         <div class="license-header">
            <div class="warnings">
               <div class="info">
                  <#list usage.warnings as w>
                     <div class="level${usage.level}">${w?html}</div>
                  </#list>
                  <#list usage.errors as e>
                     <div class="level${usage.level}">${e?html}</div>
                  </#list>
               </div>
            </div>
         </div>
      </div>
      </#if>
   </@>
</@>