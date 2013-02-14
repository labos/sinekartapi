<@markup id="css" >
   <#-- CSS Dependencies -->
   <@link href="${url.context}/res/components/search/search.css" group="search"/>
      <@link href="${url.context}/res/components/search/protocol-search.css" group="search"/>
</@>

<@markup id="js">
   <#-- JavaScript Dependencies -->
   <@script type="text/javascript" src="${url.context}/res/modules/simple-dialog.js"></@script>
   <@script src="${url.context}/res/components/search/search-lib.js" group="search"/>
   <@script src="${url.context}/res/components/search/protocol-search.js" group="search"/>
</@>

<@markup id="widgets">
   <@createWidgets group="search"/>
</@>

<@markup id="html">
   <@uniqueIdDiv>
      <#assign el=args.htmlid>
      <#assign searchconfig=config.scoped['Search']['search']>
      <div id="${el}-body" class="search">
         <#if searchQuery?length == 0 && (searchconfig.getChildValue('repository-search')!"context") != "always">
         <div class="search-sites">
            <#if siteId?length != 0><a id="${el}-site-link" href="#" <#if !searchAllSites && !searchRepo>class="bold"</#if>>${msg('message.singlesite', siteTitle)?html}</a> |</#if>
            <a id="${el}-all-sites-link" href="#" <#if searchAllSites && !searchRepo>class="bold"</#if>>${msg('message.allsites')}</a>
            <span <#if (searchconfig.getChildValue('repository-search')!"context") == "none">class="hidden"</#if>>| <a id="${el}-repo-link" href="#" <#if searchRepo>class="bold"</#if>>${msg('message.repository')}</a></span>
         </div>
         </#if>
       <#-- hide generic search form -->
         <div class="search-box">
         <#if siteId?length != 0 && siteId != "protocollo">
            <div>
               <input type="text" class="terms" name="${el}-search-text" id="${el}-search-text" value="" maxlength="1024" />
            </div>
            <div style="text-align:left">
               <span id="${el}-search-button" class="yui-button yui-push-button search-icon">
                  <span class="first-child">
                     <button type="button">${msg('button.search')}</button>
                  </span>
               </span>
            </div>
            </#if>
         </div>
         <div class="yui-gc search-bar theme-bg-color-3">
            <div class="yui-u first">
               <div id="${el}-search-info" class="search-info">${msg("search.info.searching")}</div>
               <div id="${el}-paginator-top" class="paginator hidden"></div>
               <!-- Download schedule button -->
         <#if siteId?length == 0 || siteId == "protocollo">
              <!-- <div class="download-schedule" style="float:left;padding:0.5em 0 0.6em 1em;">
               		<a href="#" id="lnk-download-schedule" target="_blank"><strong>${msg("search.info.download.schedule")}</strong><img src="/share/res/components/images/email_2.png"/></a>
               </div>-->
            <div class="yui-u align-left">
            
               <span class="yui-button yui-push-button" id="${el}-schedule-menubutton">
                  <span class="first-child"><button></button></span>
               </span>
               <select id="${el}-schedule-menu" class="yuimenu hidden">
               <option value="send-results">${msg("search.info.sendEmail")}</option>
               <option value="zip">${msg("search.info.download.zip")}</option>
               <!--
                  <option value="daily">${msg("search.info.download.daily")}</option>
                  <option value="schedule">${msg("search.info.download.schedule")}</option>
                  <option value="report">${msg("search.info.download.report")}</option>
                  -->
               </select>
               
            </div>
               
                  </#if>   
                <!-- End Download schedule button -->
            </div>
            <div class="yui-u align-right">
               <span class="yui-button yui-push-button" id="${el}-sort-menubutton">
                  <span class="first-child"><button></button></span>
               </span>
               <select id="${el}-sort-menu" class="yuimenu hidden">
                  <#list sortFields as sort>
                  <option value="${sort.type!""}">${sort.label}</option>
                  </#list>
               </select>
            </div>
         </div>
         
         <div id="${el}-help" class="yui-g theme-bg-color-2 help hidden">
            <span class="title">${msg("help.title")}</span>
            <div class="yui-u first">
               <span class="subtitle">${msg("help.subtitle1")}</span>
               <span>${msg("help.info1")}</span>
               <span class="example">${msg("help.example1")}</span>
               <span>${msg("help.result1")}</span>
               <span>${msg("help.info2")}</span>
               <span class="example">${msg("help.example2")}</span>
               <span>${msg("help.result2")}</span>
               <span>${msg("help.info3")}</span>
               <span class="example">${msg("help.example3")}</span>
               <span>${msg("help.result3")}</span>
               <span>${msg("help.info4")}</span>
               <span class="example">${msg("help.example4")}</span>
               <span>${msg("help.result4")}</span>
               <span>${msg("help.info5")}</span>
               <span class="example">${msg("help.example5")}</span>
            </div>
            <div class="yui-u">
               <span class="subtitle">${msg("help.subtitle2")}</span>
               <span>${msg("help.info6")}</span>
               <span class="example">${msg("help.example6")}</span>
               <span>${msg("help.result6")}</span>
               <span>${msg("help.info7")}</span>
               <span class="example">${msg("help.example7")}</span>
               <span>${msg("help.result7")}</span>
               <span>${msg("help.info8")}</span>
               <span>${msg("help.info9")}</span>
               <span class="example">${msg("help.example9")}</span>
               <span>${msg("help.result9")}</span>
               <span>${msg("help.info10")}</span>
               <span class="example">${msg("help.example10")}</span>
               <span>${msg("help.result10")}</span>
            </div>
         </div>
         
         <div id="${el}-results" class="results"></div>
         
         <div id="${el}-search-bar-bottom" class="yui-gc search-bar search-bar-bottom theme-bg-color-3 hidden">
            <div class="yui-u first">
               <div class="search-info">&nbsp;</div>
               <div id="${args.htmlid}-paginator-bottom" class="paginator paginator-bottom"></div>
            </div>
         </div>
      </div>
   </@>
</@>