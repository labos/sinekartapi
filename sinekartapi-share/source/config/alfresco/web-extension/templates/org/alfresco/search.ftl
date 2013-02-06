<#include "include/alfresco-template.ftl" />
<@templateHeader />

<@templateBody>
   <@markup id="alf-hd">
   <div id="alf-hd">
      <@region id="header" scope="global" />
      <@region id="title" scope="page" />
   </div>
   </@>
   <@markup id="bd">
   <div id="bd">
      <div class="yui-t1">
         <div id="yui-main">
            <@region id="search" scope="page" />
            <@region id="archive-and-download" scope="page"/>
         </div>
      </div>
   </div>
   </@>
</@>

<@templateFooter>
   <@markup id="alf-ft">
   <div id="alf-ft">
      <@region id="footer" scope="global" />
   </div>
   </@>
</@>
