<#assign controlId = fieldHtmlId + "-cntrl">
<#assign fieldPostalCodeId = args.htmlid + "_prop_skpi_postalCode">
<#assign fieldProvinceId = args.htmlid + "_prop_skpi_province">
<#assign fieldCityId = args.htmlid + "_prop_skpi_city">
<script type="text/javascript">//<![CDATA[
(function()
{

<#if form.mode == "view" || (field.disabled && !(field.control.params.forceEditable?? && field.control.params.forceEditable == "true"))>
   <#else>
var onSuccessAddressPostal = function(response) {
	var zipCode = response.json.zipCode;

};

var onFailureAddressPostal = function(response) {
	alert("Impossibile ottenere i CAP!");

};

YUIEvent.onContentReady("${fieldHtmlId}", function(){    
var addressField = YAHOO.util.Dom.get("${fieldHtmlId}"),
cityField = YAHOO.util.Dom.get("${fieldCityId}");
   // Use an XHRDataSource 
    var oDS = new YAHOO.util.XHRDataSource(Alfresco.constants.URL_SERVICECONTEXT +  "components/postal-code/postal-code"); 

oDS.responseType = YAHOO.util.XHRDataSource.TYPE_JSON; 
oDS.responseSchema = {resultsList : "result", 
fields : ["suggestedAddress", "zipCode", "route", "province"]};

var oAC = new YAHOO.widget.AutoComplete("${fieldHtmlId}", "${fieldHtmlId}-Container", oDS);
oAC.generateRequest = function(sQuery) {
    return "?query=" + sQuery + "&city=" + cityField.value;
};
oAC.questionMark = false; // Removes the question mark on the query string (this will be ignored anyway)
oAC.applyLocalFilter = true; // Filter the results on the client
oAC.queryDelay = 0.1 // Throttle requests sent
oAC.animSpeed = 0.08;
oAC.queryMatchContains = true;


    // Define an event handler to populate a hidden form field 
	    // when an item gets selected 
    var postalCodeField = YAHOO.util.Dom.get("${fieldPostalCodeId}"),
     	provinceField = YAHOO.util.Dom.get("${fieldProvinceId}");
    
    var myHandler = function(sType, aArgs) { 
        var myAC = aArgs[0]; // reference back to the AC instance 
        var elLI = aArgs[1]; // reference to the selected LI element 
        var oData = aArgs[2]; // object literal of selected item's result data 
      // update hidden form field with the selected item's ID 
	        postalCodeField.value = oData[1]; 
	        addressField.value = oData[2];
	        provinceField.value = oData[3];
	        
	    }; 
	    oAC.itemSelectEvent.subscribe(myHandler); 


return {
oDS: oDS,
oAC: oAC
};

	Alfresco.util.Ajax.jsonRequest(
	{
		url: Alfresco.constants.URL_SERVICECONTEXT +  "components/postal-code/postal-code",
        method: "GET",
        successCallback:
        {
			fn: onSuccessAddressPostal,
            scope: this
        },
        failureCallback:
        {
			fn: onFailureAddressPostal,
			scope: this
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
		<div id="${fieldHtmlId}-Container"></div> 
   </#if>
</div>