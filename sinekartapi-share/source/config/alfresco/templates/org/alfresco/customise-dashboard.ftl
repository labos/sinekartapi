<#include "include/alfresco-template.ftl" />
<#import "import/alfresco-layout.ftl" as layout />
<@templateHeader "transitional" />

<@templateBody>
   <div id="alf-hd">
      <@region id="header" scope="global" />
      <@region id="title" scope="page" />
      <@region id="navigation" scope="page" />
   </div>
   <div id="bd">
      <div class="yui-gc">
         <div class="yui-u first">
		<@region id="component-1-1" scope="template"/>
		<@region id="component-1-2" scope="page"/>
         </div>
         <div class="yui-u">
		<@region id="component-2-1" scope="page"/>		
		<@region id="component-2-2" scope="page"/>
         </div>
      </div>

   </div>
      <@region id="html-upload" scope="template"/>
      <@region id="flash-upload" scope="template"/>
      <@region id="file-upload" scope="template"/>
      <@region id="dnd-upload" scope="template"/>
</@>

<@templateFooter>
   <div id="alf-ft">
      <@region id="footer" scope="global" />
   </div>
</@>
