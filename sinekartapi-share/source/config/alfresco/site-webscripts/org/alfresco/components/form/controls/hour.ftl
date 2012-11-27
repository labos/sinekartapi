<#assign controlId = fieldHtmlId + "-cntrl">

<script type="text/javascript">//<![CDATA[
(function()
{

<#if form.mode == "view" || (field.disabled && !(field.control.params.forceEditable?? && field.control.params.forceEditable == "true"))>
   <#else>
YUIEvent.onContentReady("${fieldHtmlId}", function(){    
var hourField = YAHOO.util.Dom.get("${fieldHtmlId}");
YAHOO.util.Dom.setAttribute("${fieldHtmlId}" , "value", "00:00" );
YUIEvent.addListener("${fieldHtmlId}", "keyup",function (e, obj) {
  // the execution context is the custom object
  var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(e.target.value);
        if (isValid) {
            YAHOO.util.Dom.setStyle("${fieldHtmlId}","backgroundColor",'#bfa');
        } else {
        YAHOO.util.Dom.setStyle("${fieldHtmlId}","backgroundColor",'#fba');
        }
       
});



});

   </#if>

})();
//]]></script>

<div class="form-field">
   <#if form.mode == "view">
      <div class="viewmode-field">
         <span class="viewmode-label">${field.label?html}:</span>
         <span class="viewmode-value" id="${controlId}"></span>
      </div>
   <#else>
      <label for="${fieldHtmlId}">${field.label?html}:<#if field.mandatory><span class="mandatory-indicator">${msg("form.required.fields.marker")}</span></#if></label>
      <input class="hour" id="${fieldHtmlId}" name="${field.name}" type="text" value="${field.value?html}"/>

   </#if>
</div>