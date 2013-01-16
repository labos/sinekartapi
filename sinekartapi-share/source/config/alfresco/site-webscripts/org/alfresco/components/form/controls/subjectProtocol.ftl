<#if field.control.params.rows??><#assign rows=field.control.params.rows><#else><#assign rows=3></#if>
<#if field.control.params.columns??><#assign columns=field.control.params.columns><#else><#assign columns=60></#if>

<div class="form-field">
   <#if form.mode == "view">
   <div class="viewmode-field">
      <#if field.mandatory && field.value == "">
      <span class="incomplete-warning"><img src="${url.context}/res/components/form/images/warning-16.png" title="${msg("form.field.incomplete")}" /><span>
      </#if>
      <span class="viewmode-label">${field.label?html}:</span>
      <#if field.control.params.activateLinks?? && field.control.params.activateLinks == "true">
         <#assign fieldValue=field.value?html?replace("((http|ftp|https):\\/\\/[\\w\\-_]+(\\.[\\w\\-_]+)+([\\w\\-\\.,@?\\^=%&:\\/~\\+#]*[\\w\\-\\@?\\^=%&\\/~\\+#])?)", "<a href=\"$1\" target=\"_blank\">$1</a>", "r")>
      <#else>
         <#assign fieldValue=field.value?html>
      </#if>
      <span class="viewmode-value"><#if fieldValue == "">${msg("form.control.novalue")}<#else>${fieldValue}</#if></span>
   </div>
   <#else>
      <script type="text/javascript">//<![CDATA[
   (function()
   {
     YUIEvent.onContentReady("${fieldHtmlId}", function(){   
     
     var subjectField = YAHOO.util.Dom.get("${fieldHtmlId}"),

   // Use an XHRDataSource 
    var oDS = new YAHOO.util.XHRDataSource(Alfresco.constants.URL_SERVICECONTEXT +  "components/subject/subject-suggest"); 

	oDS.responseType = YAHOO.util.XHRDataSource.TYPE_JSON; 
	oDS.responseSchema = {resultsList : "result", 
	fields : ["suggestedSubject"]};

	var oAC = new YAHOO.widget.AutoComplete("${fieldHtmlId}", "${fieldHtmlId}-Container", oDS);
	oAC.generateRequest = function(sQuery) {
    return "?query=" + sQuery;
	};
	oAC.questionMark = false; // Removes the question mark on the query string (this will be ignored anyway)
	oAC.applyLocalFilter = true; // Filter the results on the client
	oAC.queryDelay = 0.1 // Throttle requests sent
	oAC.animSpeed = 0.08;
	oAC.queryMatchContains = true;
     });
     
   })();
   //]]></script>
   
   <label for="${fieldHtmlId}">${field.label?html}:<#if field.mandatory><span class="mandatory-indicator">${msg("form.required.fields.marker")}</span></#if></label>
   <textarea id="${fieldHtmlId}" name="${field.name}" rows="${rows}" cols="${columns}" tabindex="0"
      <#if field.description??>title="${field.description}"</#if>
      <#if field.control.params.styleClass??>class="${field.control.params.styleClass}"</#if>
      <#if field.control.params.style??>style="${field.control.params.style}"</#if>
      <#if field.disabled && !(field.control.params.forceEditable?? && field.control.params.forceEditable == "true")>disabled="true"</#if>>${field.value?html}</textarea>
   <@formLib.renderFieldHelp field=field />
   </#if>
</div>