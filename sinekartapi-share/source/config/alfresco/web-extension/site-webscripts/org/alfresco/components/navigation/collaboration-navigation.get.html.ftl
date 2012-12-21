<@markup id="css" >
   <#-- No CSS Dependencies -->
</@>

<@markup id="js">
   <#-- No JavaScript Dependencies -->
</@>

<@markup id="widgets">
   <@createWidgets group="navigation"/>
</@>

<@markup id="html">
   <@uniqueIdDiv>
      <#assign activeSite = page.url.templateArgs.site!"">
      <#assign pageFamily = template.properties.pageFamily!"dashboard">
      <div class="site-navigation">
      </div>
   </@>
</@>

